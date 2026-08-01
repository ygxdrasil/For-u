/**
 * POST /api/clientlog — where a broken screen goes to be diagnosed.
 *
 * A crash in the browser is invisible to the server: the function returned 200,
 * the logs are clean, and all anyone can report is "the screen went white".
 * That is not enough to fix anything, and guessing from it is how an evening
 * disappears.
 *
 * So the boundary sends the message and the stack here, and this writes them to
 * the function log — where they can be read directly instead of described.
 *
 * It stores nothing, returns nothing, and holds no state. It exists so the next
 * white screen arrives with its own explanation attached.
 */

import { createStore } from '../core/store.js';
import { json, methodGuard, readBody } from '../core/http.js';
import { requireSession } from './auth.js';

const clip = (value, max) => String(value ?? '').slice(0, max);

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  // Behind the password like everything else: this writes to logs, and an open
  // endpoint that writes to logs is a way to fill them with someone else's
  // noise.
  const store = await createStore();
  const session = await requireSession(req, store, res);
  if (!session.ok) return json(res, 401, { ok: false, error: session.error });

  const body = await readBody(req);

  // Bounded on every field. A crash report is not a place to accept arbitrary
  // volume, and truncating here is cheaper than truncating a log bill later.
  console.error(
    '[client]',
    JSON.stringify({
      kind: clip(body.kind, 40),
      message: clip(body.message, 500),
      at: clip(body.at, 40),
      url: clip(body.url, 200),
      build: clip(body.build, 60),
      stack: clip(body.stack, 4000),
      componentStack: clip(body.componentStack, 2000),
    }),
  );

  // Nothing to say back. The browser is already showing the user the error.
  res.statusCode = 204;
  res.end();
}
