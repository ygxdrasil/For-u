/**
 * Things that are built and switched off.
 *
 * A flag rather than a revert. The conversation split is the kind of change
 * that is expensive to make and cheap to keep — the storage, the routes and
 * the tests all stand, and the first conversation is the only one anything
 * writes to while this is false, which is exactly how it behaved before any of
 * it existed. Turning it back on is one word here.
 *
 * Ripping it out instead would mean doing the risky half twice.
 */

/**
 * Several conversations, with a list to switch between them.
 *
 * Off for now, at the user's asking. With it off nothing creates a second
 * conversation, so `main` stays current for ever and the sidebar shows rooms
 * and nothing else.
 */
export const MANY_CONVERSATIONS = false;
