/**
 * POST /api/auth — the front door.
 *
 * The site is on a public URL and, once configured, holds an n8n API key with
 * full read/write on every workflow. So this is a real lock, not a speed bump:
 * scrypt password hashing, constant-time comparison, and a signed HttpOnly
 * cookie that the browser cannot read from JavaScript.
 *
 * Actions:
 *   status           is a password set, am I logged in
 *   setup            claim the instance by setting the first password
 *   login            exchange password for a session cookie
 *   logout           clear the cookie
 *   change-password  requires the current password
 *
 * First-run note: until a password is set, anyone who reaches the URL can set
 * it. There is nothing secret stored yet at that point, so the exposure is
 * "someone else claims your instance", not "someone reads your keys" — but set
 * it immediately after deploying. If someone does claim it first, clear the
 * app_kv row for auth:owner (or redeploy with an empty database) to reset.
 */

import { createStore } from '../core/store.js';
import { json, methodGuard, readBody } from '../core/http.js';
import { isPasswordSet, setupPassword, checkPassword, changePassword, sessionSecret, sessionKeyId } from '../core/settings.js';
import { issueSession, inspectSession, shouldRenew, sessionCookie, readSessionCookie } from '../core/secrets.js';

/** Shared by every route that serves a browser. */
export async function requireSession(req, store, res = null) {
  const secret = await sessionSecret(store);
  const { payload, reason } = inspectSession(secret, readSessionCookie(req));

  if (!payload) return { ok: false, error: 'Not signed in.', reason };

  // Sliding expiry: every authenticated request pushes the cookie out to a
  // full year again, so a session in regular use never lapses. Without this,
  // signing in once buys a fixed window that quietly runs out.
  if (res && shouldRenew(payload)) {
    res.setHeader('Set-Cookie', sessionCookie(issueSession(secret)));
  }

  return { ok: true, session: payload, reason };
}

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const store = await createStore();
  req.body = await readBody(req);
  const action = req.body?.action ?? 'status';

  const passwordSet = await isPasswordSet(store);

  if (action === 'status') {
    const session = await requireSession(req, store, res);
    return json(res, 200, {
      ok: true,
      passwordSet,
      signedIn: session.ok,
      // Why you were signed out, when you were: no cookie reached us, the
      // cookie expired, or the signing secret changed underneath it. Three
      // different problems that a bare "signed out" cannot tell apart.
      reason: session.ok ? 'ok' : session.reason,
      // Identifies which signing key is in force without revealing it. If this
      // changes between two requests, the secret is unstable and that alone
      // explains being asked for the password every time.
      sessionKeyId: await sessionKeyId(store),
      durable: store.durable,
      databaseUnreachable: Boolean(store.degraded),
      // Being honest about the consequence rather than letting them find out —
      // and about the cause, which is not the same in both cases.
      warning: store.durable
        ? null
        : store.degraded
          ? `The database is configured but could not be opened, so your password and keys are living in memory and will be lost on the next cold start. ${store.note ?? ''}`
          : 'There is no database configured, so the password and your keys live in memory and are lost whenever the function cold-starts. Set DATABASE_URL.',
    });
  }

  if (action === 'setup') {
    if (passwordSet) {
      return json(res, 409, { ok: false, error: 'A password is already set. Sign in instead.' });
    }
    // Refused rather than half-working. Serverless functions come and go, so
    // without a database the password would live in one instance's memory and
    // vanish the moment another instance served a request — you would be
    // locked out at random and unable to tell why.
    // ALLOW_MEMORY_AUTH exists so local development and the wiring probe can
    // run the real handlers without a database. Never set it in production.
    if (!store.durable && process.env.ALLOW_MEMORY_AUTH !== '1') {
      // Two different problems with two different fixes. Telling someone to add
      // a DATABASE_URL they have already added sends them to look in the wrong
      // place entirely, and the real reason was sitting in store.note unread.
      return json(res, 503, {
        ok: false,
        error: store.degraded
          ? `The database is configured but could not be opened, so a password set now would be forgotten between requests. This is not something to fix by adding DATABASE_URL — it is already set. ${store.note ?? ''}`
          : 'No database is configured, so a password set now would be forgotten between requests and lock you out at random. Add DATABASE_URL in Vercel (Neon free tier), redeploy, then set your password.',
        needsDatabase: !store.degraded,
        databaseUnreachable: Boolean(store.degraded),
        detail: store.note ?? null,
      });
    }
    try {
      await setupPassword(store, req.body.password);
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message });
    }
    const secret = await sessionSecret(store);
    res.setHeader('Set-Cookie', sessionCookie(issueSession(secret)));
    return json(res, 200, { ok: true, signedIn: true });
  }

  if (action === 'login') {
    if (!passwordSet) return json(res, 409, { ok: false, error: 'No password set yet. Set one first.' });

    const good = await checkPassword(store, req.body.password ?? '');
    if (!good) {
      // Same message and shape whether the password was wrong or empty.
      return json(res, 401, { ok: false, error: 'Wrong password.' });
    }
    const secret = await sessionSecret(store);
    res.setHeader('Set-Cookie', sessionCookie(issueSession(secret)));
    return json(res, 200, { ok: true, signedIn: true });
  }

  if (action === 'logout') {
    res.setHeader('Set-Cookie', sessionCookie(null, { clear: true }));
    return json(res, 200, { ok: true, signedIn: false });
  }

  if (action === 'change-password') {
    const session = await requireSession(req, store);
    if (!session.ok) return json(res, 401, { ok: false, error: session.error });
    try {
      await changePassword(store, req.body.currentPassword ?? '', req.body.newPassword ?? '');
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message });
    }
    // Re-issue so the current browser stays signed in.
    const secret = await sessionSecret(store);
    res.setHeader('Set-Cookie', sessionCookie(issueSession(secret)));
    return json(res, 200, { ok: true, changed: true });
  }

  return json(res, 400, { ok: false, error: `Unknown action "${action}".` });
}
