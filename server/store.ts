import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const ALGORITHM = 'aes-256-gcm';

interface Envelope {
  v: 1;
  encrypted: boolean;
  salt?: string;
  iv?: string;
  tag?: string;
  data: string;
}

/**
 * A small JSON file store that encrypts at rest when GRACE_SECRET is set.
 *
 * Grace's memory is the most personal thing in this app, so it stays on local
 * disk rather than in a hosted database. Writes go through a temp file and a
 * rename so a crash mid-write can't truncate the store.
 */
export class JsonStore<T> {
  private cache: T | null = null;
  private keyCache = new Map<string, Buffer>();

  constructor(
    private readonly file: string,
    private readonly fallback: () => T,
    private readonly secret = process.env.GRACE_SECRET,
  ) {}

  read(): T {
    if (this.cache !== null) return this.cache;

    if (!existsSync(this.file)) {
      this.cache = this.fallback();
      return this.cache;
    }

    try {
      const envelope = JSON.parse(readFileSync(this.file, 'utf8')) as Envelope;
      this.cache = JSON.parse(this.decode(envelope)) as T;
    } catch (error) {
      // A corrupt or undecryptable store shouldn't take Grace down, but it also
      // shouldn't be silently overwritten — keep the original alongside.
      const quarantine = `${this.file}.unreadable-${Date.now()}`;
      renameSync(this.file, quarantine);
      console.error(
        `[grace] could not read ${this.file} (${(error as Error).message}). ` +
          `Moved it to ${quarantine} and started fresh.`,
      );
      this.cache = this.fallback();
    }

    return this.cache;
  }

  write(value: T): void {
    this.cache = value;
    mkdirSync(path.dirname(this.file), {recursive: true});

    const envelope = this.encode(JSON.stringify(value));
    const temp = `${this.file}.tmp`;
    writeFileSync(temp, JSON.stringify(envelope), {mode: 0o600});
    renameSync(temp, this.file);
  }

  update(mutate: (current: T) => T): T {
    const next = mutate(this.read());
    this.write(next);
    return next;
  }

  private key(salt: string): Buffer {
    let derived = this.keyCache.get(salt);
    if (!derived) {
      derived = scryptSync(this.secret!, Buffer.from(salt, 'hex'), 32);
      this.keyCache.set(salt, derived);
    }
    return derived;
  }

  private encode(plaintext: string): Envelope {
    if (!this.secret) {
      return {v: 1, encrypted: false, data: plaintext};
    }

    const salt = randomBytes(16).toString('hex');
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, this.key(salt), iv);
    const data = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]).toString('base64');

    return {
      v: 1,
      encrypted: true,
      salt,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex'),
      data,
    };
  }

  private decode(envelope: Envelope): string {
    if (!envelope.encrypted) return envelope.data;

    if (!this.secret) {
      throw new Error(
        'store is encrypted but GRACE_SECRET is not set in this environment',
      );
    }

    const decipher = createDecipheriv(
      ALGORITHM,
      this.key(envelope.salt!),
      Buffer.from(envelope.iv!, 'hex'),
    );
    decipher.setAuthTag(Buffer.from(envelope.tag!, 'hex'));

    return (
      decipher.update(Buffer.from(envelope.data, 'base64')).toString('utf8') +
      decipher.final('utf8')
    );
  }
}
