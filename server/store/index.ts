import {config} from '../config';
import {newSalt, seal, unseal} from '../crypto';
import {FileBackend} from './file';
import {RedisBackend, redisCredentials} from './redis';
import type {Backend} from './types';

let backend: Backend | null = null;

/**
 * Redis when it's configured, local disk otherwise. That single rule is what
 * lets the same build run on your machine and on serverless, where there is no
 * durable filesystem to write to.
 */
export function getBackend(): Backend {
  if (!backend) {
    const credentials = redisCredentials();
    backend = credentials
      ? new RedisBackend(credentials.url, credentials.token)
      : new FileBackend(config.dataDir);
  }
  return backend;
}

/** Test seam. */
export function setBackend(next: Backend | null): void {
  backend = next;
}

/** One JSON document, sealed on the way out and opened on the way in. */
export class Document<T> {
  /** Reused across writes so the scrypt key stays derived. */
  private salt: string | null = null;

  constructor(
    private readonly key: string,
    private readonly fallback: () => T,
  ) {}

  async read(): Promise<T> {
    const raw = await getBackend().read(this.key);
    if (raw === null) return this.fallback();

    try {
      const {plaintext, salt} = unseal(raw, config.secret);
      if (salt) this.salt = salt;
      return JSON.parse(plaintext) as T;
    } catch (error) {
      // Unreadable memory must not take Grace down, and must not be silently
      // overwritten either — set it aside and carry on empty.
      await getBackend().quarantine(this.key, raw);
      console.error(
        `[grace] could not read "${this.key}" (${(error as Error).message}). ` +
          'Set it aside and started fresh.',
      );
      return this.fallback();
    }
  }

  async write(value: T): Promise<void> {
    if (!this.salt) this.salt = newSalt();
    await getBackend().write(
      this.key,
      seal(JSON.stringify(value), config.secret, this.salt),
    );
  }

  /**
   * Read, change, write — with the three steps never interleaved.
   *
   * This was a plain read-modify-write, and twenty updates fired at once kept
   * one of them. Every other change was read before it existed and overwritten
   * after it landed. Nothing errored; the writes simply evaporated.
   *
   * It is not theoretical. Her voice splits a long reply into pieces and
   * fetches the next while the current one plays, so two speech requests meter
   * their cost concurrently and one of them is lost — she under-counts what
   * she has spent, against a cap that exists to stop her. And the laptop
   * bridge claims commands on a timer while she is adding them, so an
   * instruction could be dropped between the two, which looks precisely like
   * her saying she has done something and nothing happening.
   *
   * Serialised per key rather than globally: two unrelated documents have no
   * reason to wait for each other, and holding one lock across all of them
   * would put the whole of her behind whichever write is slowest.
   *
   * The queue is keyed by document *name* and shared between instances, not
   * held on the instance. That distinction is the whole fix rather than a
   * detail: the conversation log builds a fresh Document object on every
   * single call, so a per-instance queue would have serialised nothing at all
   * for the one document she writes to most. Compaction rewriting the log
   * while a new message is being appended is exactly how a turn of a
   * conversation would vanish.
   *
   * The honest limit: this covers one running copy of her. Two serverless
   * instances updating the same document at the same instant can still
   * collide, and closing that needs a compare-and-set in the store itself.
   * That is a much larger change for a much rarer case — her writes are small
   * and few, and the overwhelming majority of collisions are the ones above,
   * which happen inside a single instance and are now impossible.
   */
  async update(mutate: (current: T) => T): Promise<T> {
    const waitingOn = queues.get(this.key) ?? Promise.resolve();

    const mine = waitingOn.then(async () => {
      const next = mutate(await this.read());
      await this.write(next);
      return next;
    });

    // The chain must not break on a failed link: one update that throws would
    // otherwise wedge every later update to this document for the life of the
    // process. The caller still sees the rejection through `mine`.
    queues.set(
      this.key,
      mine.then(
        () => undefined,
        () => undefined,
      ),
    );
    return mine;
  }
}

/**
 * One queue per document name, for the lifetime of the process.
 *
 * Bounded by how many documents she has — a few dozen, plus one per
 * conversation — and each entry is a single settled promise, so this does not
 * grow into anything worth clearing.
 */
const queues = new Map<string, Promise<void>>();
