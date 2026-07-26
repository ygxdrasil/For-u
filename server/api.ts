import express, {type Express, type Request, type Response} from 'express';
import type {
  ActionCategory,
  ChatEvent,
  ConfirmationPolicy,
  GraceState,
  InputMode,
} from '../shared/types';
import {getPolicies, setPolicy} from './actions';
import {
  authStatus,
  checkPassword,
  clearSession,
  issueSession,
  pauseAfterFailure,
  requireAuth,
} from './auth';
import {config, isConfigured} from './config';
import {learnFrom} from './learn';
import {buildBriefing} from './google/briefing';
import {upcoming} from './google/calendar';
import {recentMail} from './google/gmail';
import {
  authorizeUrl,
  completeSignIn,
  connection,
  disconnect,
  googleConfigured,
  redirectUri,
  type GoogleError,
} from './google/oauth';
import {getProvider} from './llm/index';
import {getMode, isMode, setMode} from './modes';
import {
  clearConversation,
  compactIfNeeded,
  forget,
  getMessages,
  getProfile,
  getSummary,
  record,
  recentTurns,
  setAddressAs,
} from './memory';
import {buildSystemPrompt} from './persona';
import {getBackend} from './store/index';

/**
 * Express 4 lets a rejected async handler escape as an unhandled rejection,
 * which takes the process down. Grace is meant to stay up, so every async route
 * goes through here.
 */
function guard(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response) => {
    handler(req, res).catch((error: Error) => {
      console.error('[grace] request failed:', error.message);
      if (!res.headersSent) res.status(500).json({error: 'something went wrong'});
      else if (!res.writableEnded) res.end();
    });
  };
}

const NO_KEY_MESSAGE =
  'No Gemini API key is configured, so I have no voice to think with. ' +
  'Add GEMINI_API_KEY and restart me.';

/**
 * A full express app rather than a bare Router: Vite's dev middleware hands over
 * a plain Node response, and it is express itself — not Router — that adds
 * res.json and friends. Mounting the app works in dev, production and serverless.
 */
export function createApi(): Express {
  const api = express();
  // Recorded speech arrives as base64 in a JSON body, so the default 100kb
  // ceiling would reject anything longer than a sentence or two.
  api.use(express.json({limit: '25mb'}));

  // ---- open endpoints ----------------------------------------------------

  api.get('/health', (_req, res) => {
    res.json({
      ok: true,
      configured: isConfigured(),
      model: config.model,
      storage: getBackend().name,
      encrypted: Boolean(config.secret),
    });
  });

  api.get('/session', (req, res) => {
    res.json({status: authStatus(req)});
  });

  api.post(
    '/login',
    guard(async (req, res) => {
      const status = authStatus(req);
      if (status === 'misconfigured') {
        res.status(503).json({error: 'no password is set on the server'});
        return;
      }

      if (!checkPassword(String(req.body?.password ?? ''))) {
        await pauseAfterFailure();
        res.status(401).json({error: 'that is not the password'});
        return;
      }

      issueSession(res);
      res.json({ok: true});
    }),
  );

  api.post('/logout', (_req, res) => {
    clearSession(res);
    res.json({ok: true});
  });

  // ---- everything below needs a session ----------------------------------

  api.use(requireAuth);

  api.get(
    '/state',
    guard(async (_req, res) => {
      const [messages, profile, policies, mode, summary] = await Promise.all([
        getMessages(),
        getProfile(),
        getPolicies(),
        getMode(),
        getSummary(),
      ]);

      const state: GraceState = {
        messages,
        profile,
        policies,
        ready: isConfigured(),
        model: config.model,
        mode,
        summary,
        storage: {backend: getBackend().name, encrypted: Boolean(config.secret)},
      };
      res.json(state);
    }),
  );

  api.post(
    '/mode',
    guard(async (req, res) => {
      const requested = req.body?.mode;
      if (!isMode(requested)) {
        res.status(400).json({error: 'unknown mode'});
        return;
      }
      res.json(await setMode(requested));
    }),
  );

  api.post(
    '/chat',
    guard(async (req, res) => {
      const text = String(req.body?.text ?? '').trim();
      const via: InputMode = req.body?.via === 'voice' ? 'voice' : 'text';

      if (!text) {
        res.status(400).json({error: 'message was empty'});
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        // Stops proxies from buffering the stream into a single lump.
        'X-Accel-Buffering': 'no',
      });

      const send = (event: ChatEvent) => {
        if (!res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`);
      };

      if (!isConfigured()) {
        send({type: 'error', message: NO_KEY_MESSAGE});
        res.end();
        return;
      }

      const controller = new AbortController();
      res.on('close', () => controller.abort());

      await record('user', text, via);

      const [profile, summary, policies, turns] = await Promise.all([
        getProfile(),
        getSummary(),
        getPolicies(),
        recentTurns(),
      ]);

      const system = buildSystemPrompt({
        profile,
        summary,
        policies,
        via,
        now: new Date(),
        mode: (await getMode()).mode,
        briefing: await buildBriefing().catch(() => null),
      });

      let reply = '';

      try {
        for await (const delta of getProvider().stream({
          system,
          turns,
          signal: controller.signal,
          temperature: 0.7,
          fast: true,
          search: true,
        })) {
          reply += delta;
          send({type: 'delta', text: delta});
        }
      } catch (error) {
        const message = (error as Error).message ?? 'unknown error';
        console.error('[grace] generation failed:', message);

        // A half-finished reply is still worth keeping; the user heard it.
        if (reply.trim()) await record('grace', reply, via);
        send({
          type: 'error',
          message: `I couldn't finish that thought — ${message}`,
        });
        res.end();
        return;
      }

      if (!reply.trim()) {
        send({type: 'error', message: 'I drew a blank there. Try me again.'});
        res.end();
        return;
      }

      send({type: 'done', message: await record('grace', reply, via)});
      res.end();
    }),
  );

  /**
   * Profile extraction and compaction, as their own request.
   *
   * These used to run inside /chat, which was fine for a long-lived process but
   * pushes a serverless invocation towards its time limit for work the user is
   * not waiting on. The client calls this once a reply has landed.
   */
  api.post(
    '/reflect',
    guard(async (_req, res) => {
      if (!isConfigured()) {
        res.json({learned: [], compacted: false});
        return;
      }

      const log = await getMessages();
      const graceAt = log.findLastIndex((message) => message.speaker === 'grace');
      const userAt = log
        .slice(0, Math.max(graceAt, 0))
        .findLastIndex((message) => message.speaker === 'user');

      const learned =
        graceAt >= 0 && userAt >= 0
          ? await learnFrom(log[userAt].text, log[graceAt].text)
          : [];

      // If this times out the condition persists, so the next reflect retries.
      const compacted = await compactIfNeeded();
      res.json({learned, compacted});
    }),
  );

  /**
   * Spoken audio in, text out.
   *
   * The browser records; the transcription happens here. That is the whole
   * point: it works in browsers with no speech recognition of their own, and a
   * failure produces an error we can actually read rather than silence.
   */
  api.post(
    '/transcribe',
    guard(async (req, res) => {
      if (!isConfigured()) {
        res.status(503).json({error: 'No Gemini API key is configured.'});
        return;
      }

      const audio = String(req.body?.audio ?? '');
      const mimeType = String(req.body?.mimeType ?? 'audio/wav');

      if (!audio) {
        res.status(400).json({error: 'no audio was sent'});
        return;
      }

      try {
        const text = await getProvider().transcribe({audio, mimeType});
        res.json({text});
      } catch (error) {
        // Providers return a wall of JSON. Keep it in the log and say
        // something the person holding the microphone can act on.
        const detail = (error as Error).message ?? 'unknown error';
        console.error('[grace] transcription failed:', detail);

        const explained = /API[_ ]?KEY|not valid|UNAUTHENTICATED/i.test(detail)
          ? 'My API key was rejected. Check GEMINI_API_KEY where I am running.'
          : /quota|RESOURCE_EXHAUSTED|rate/i.test(detail)
            ? 'I have hit the daily limit on my free allowance. It resets tomorrow.'
            : 'I could not make out that recording. Try again, a little closer to the microphone.';

        res.status(502).json({error: explained});
      }
    }),
  );

  // ---- Google -----------------------------------------------------------
  api.get('/google/status', guard(async (_req, res) => {
    const saved = await connection();
    res.json({
      configured: googleConfigured(),
      connected: Boolean(saved && !saved.brokenReason),
      email: saved?.email ?? null,
      problem: saved?.brokenReason ?? null,
      redirectUri: redirectUri(),
    });
  }));

  api.get('/google/start', (req, res) => {
    if (!googleConfigured()) {
      res.status(503).json({
        error: 'Google is not set up yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
      });
      return;
    }
    void req;
    res.redirect(authorizeUrl());
  });

  // Google sends the browser here, so it answers in HTML rather than JSON.
  api.get('/google/callback', guard(async (req, res) => {
    const finish = (message: string) =>
      res.status(200).send(
        `<!doctype html><meta charset="utf-8"><title>Grace</title>` +
          `<body style="background:#07090c;color:#e2e8f0;font-family:system-ui;` +
          `display:grid;place-items:center;height:100vh;margin:0;text-align:center">` +
          `<div><p style="max-width:32rem;line-height:1.6">${message}</p>` +
          `<a href="/" style="color:#7dd3fc">Back to Grace</a></div>`,
      );

    if (req.query.error) {
      finish(`Google declined: ${String(req.query.error)}.`);
      return;
    }

    try {
      const {email} = await completeSignIn(
        String(req.query.code ?? ''),
        String(req.query.state ?? ''),
      );
      finish(`Connected as ${email || 'your Google account'}. You can close this.`);
    } catch (error) {
      finish(`Could not connect: ${(error as Error).message}`);
    }
  }));

  api.post('/google/disconnect', guard(async (_req, res) => {
    await disconnect();
    res.json({ok: true});
  }));

  api.get('/google/mail', guard(async (req, res) => {
    try {
      res.json({
        messages: await recentMail(String(req.query.q ?? 'in:inbox'), 10),
      });
    } catch (error) {
      const failure = error as GoogleError;
      res.status(failure.needsReconnect ? 409 : 502).json({error: failure.message});
    }
  }));

  api.get('/google/diary', guard(async (_req, res) => {
    try {
      res.json({events: await upcoming(24)});
    } catch (error) {
      const failure = error as GoogleError;
      res.status(failure.needsReconnect ? 409 : 502).json({error: failure.message});
    }
  }));

  api.post(
    '/speak',
    guard(async (req, res) => {
      if (!isConfigured()) {
        res.status(503).json({error: 'No Gemini API key is configured.'});
        return;
      }

      // Long enough for a paragraph, short enough that a runaway reply can't
      // spend the day's speech allowance in one go.
      const text = String(req.body?.text ?? '').slice(0, 2000).trim();
      if (!text) {
        res.status(400).json({error: 'nothing to say'});
        return;
      }

      try {
        res.json(await getProvider().speak({text}));
      } catch (error) {
        const detail = (error as Error).message ?? 'unknown error';
        console.error('[grace] speech failed:', detail);

        const explained = /API[_ ]?KEY|not valid|UNAUTHENTICATED/i.test(detail)
          ? 'My API key was rejected. Check GEMINI_API_KEY where I am running.'
          : /quota|RESOURCE_EXHAUSTED|rate/i.test(detail)
            ? 'I have used up my speech allowance for now. It resets shortly.'
            : 'I could not put that into words out loud.';

        // The raw provider message goes back too. This is the user's own
        // server behind their own password, and without it every diagnosis of
        // a silent assistant is guesswork.
        res.status(502).json({error: explained, detail: detail.slice(0, 500)});
      }
    }),
  );

  api.post(
    '/profile/address',
    guard(async (req, res) => {
      const raw = req.body?.addressAs;
      const addressAs =
        typeof raw === 'string' && raw.trim() ? raw.trim().slice(0, 40) : null;
      res.json(await setAddressAs(addressAs));
    }),
  );

  api.delete(
    '/profile/:id',
    guard(async (req, res) => {
      res.json(await forget(req.params.id));
    }),
  );

  api.post(
    '/policies',
    guard(async (req, res) => {
      const category = req.body?.category as ActionCategory;
      const policy = req.body?.policy as ConfirmationPolicy;

      if (!['always', 'high-risk', 'never'].includes(policy)) {
        res.status(400).json({error: 'unknown confirmation policy'});
        return;
      }

      const result = await setPolicy(category, policy);
      if (!result.ok) {
        res.status(409).json({error: result.reason});
        return;
      }

      res.json(await getPolicies());
    }),
  );

  api.post(
    '/conversation/clear',
    guard(async (_req, res) => {
      await clearConversation();
      res.json({ok: true});
    }),
  );

  return api;
}
