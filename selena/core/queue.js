/**
 * Serialised read-modify-write, keyed by record name.
 *
 * Two watches finishing at the same moment both read the findings list, both
 * append, and both write back — and one of them is gone with no error anywhere.
 * The fix is to serialise updates per record key.
 *
 * The subtle part, and the reason this is a module-level map rather than a
 * field on some object: the queue must be keyed by NAME, not by object
 * identity. A fresh object per call means a per-instance queue that protects
 * nothing, because the two racing callers each get their own empty queue and
 * happily run at the same time. Serverless makes this easy to get wrong —
 * every route builds its own store instance.
 *
 * This protects against races inside ONE process. Two concurrent Vercel
 * invocations are two processes, so the Postgres store additionally does its
 * mutations in single statements rather than read-then-write. Both layers are
 * needed; neither is sufficient.
 */

const chains = new Map();

/**
 * @param {string} key   the record being mutated, e.g. `finding:abc123`
 * @param {() => Promise<any>} fn
 */
export function withLock(key, fn) {
  if (typeof key !== 'string' || !key) {
    throw new Error('withLock needs a stable string key. Keying by object identity protects nothing.');
  }

  const previous = chains.get(key) ?? Promise.resolve();

  // The chain must not break on failure: if one caller throws and that
  // rejection becomes the next caller's `previous`, every later write for this
  // key fails forever. So the chain link swallows the result and the caller
  // gets the real outcome from its own promise.
  const result = previous.then(fn, fn);
  chains.set(
    key,
    result.then(
      () => undefined,
      () => undefined,
    ),
  );

  // Housekeeping: drop the chain entry once it settles and nothing newer has
  // replaced it, so a long-running process does not accumulate one entry per
  // finding it has ever touched.
  const mine = chains.get(key);
  mine.then(() => {
    if (chains.get(key) === mine) chains.delete(key);
  });

  return result;
}

/** Test seam: how many keys currently have work queued or just settled. */
export function pendingKeyCount() {
  return chains.size;
}
