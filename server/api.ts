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
import {bridgeStatus, bridgeToken, claim, report} from './bridge';
import {monthlyCap, spend} from './budget';
import {config, isConfigured} from './config';
import {keyStatus, loadKeys, setKey} from './keys';
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
import {recentDeeds} from './journal';
import {getProvider} from './llm/index';
import {playstation, psnConfigured, PsnError, recentlyPlayed} from './ps5';
import {pulse} from './pulse';
import {devices, notify, publicKey, subscribe} from './push';
import {outstanding} from './tools/reminders';
import {allTools, auditTools, declarations, runTool} from './tools/index';
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

/**
 * What she already knows, condensed into a hint for the transcriber.
 *
 * Recognising a name is the difference between "tell Yusuf I'll be late" and
 * "tell you soon I'll be late", and a model that has seen the name once gets
 * it right. Rebuilt at most every half minute, so it costs nothing per
 * recording.
 */
let contextCache: {text: string; until: number} | null = null;

async function listeningContext(): Promise<string> {
  if (contextCache && contextCache.until > Date.now()) return contextCache.text;

  const [profile, turns] = await Promise.all([getProfile(), recentTurns()]);

  const known = profile.entries
    .slice(-25)
    .map((entry) => entry.text)
    .join('; ');

  // The last few turns carry the names and topic currently in play.
  const recent = turns
    .slice(-4)
    .map((turn) => `${turn.role === 'assistant' ? 'Grace' : 'They'}: ${turn.text}`)
    .join('\n');

  const text = [
    known && `Things known about the speaker: ${known}`,
    recent && `The conversation so far:\n${recent}`,
  ]
    .filter(Boolean)
    .join('\n\n')
    .slice(0, 4000);

  contextCache = {text, until: Date.now() + 30_000};
  return text;
}

const NO_KEY_MESSAGE =
  'No Gemini API key is configured, so I have no voice to think with. ' +
  'Add GEMINI_API_KEY and restart me.';

/**
 * A full express app rather than a bare Router: Vite's dev middleware hands over
 * a plain Node response, and it is express itself — not Router — that adds
 * res.json and friends. Mounting the app works in dev, production and serverless.
 */
/**
 * Every route below is a single path segment, and must stay that way.
 *
 * Vercel routes `/api/anything` to the catch-all function but answers
 * `/api/anything/else` with a 404 that never reaches this code at all. That
 * silently broke forgetting a fact and clearing the conversation on the
 * deployed app while both worked perfectly on a local machine. The self-test
 * fails if a nested route is ever added.
 */
export function createApi(): Express {
  const api = express();
  // Recorded speech arrives as base64 in a JSON body, so the default 100kb
  // ceiling would reject anything longer than a sentence or two.
  api.use(express.json({limit: '25mb'}));

  // ---- open endpoints ----------------------------------------------------

  api.get(
    '/health',
    guard(async (_req, res) => {
      // Keys are loaded here explicitly. This route sits in front of the
      // middleware that loads them, so it was reporting whatever the instance
      // happened to have cached — which made it report "no Google credentials"
      // about credentials that were stored and working.
      await loadKeys().catch(() => {});
      res.json({
        ok: true,
        configured: isConfigured(),
        model: config.model,
        storage: getBackend().name,
        encrypted: Boolean(config.secret),
        // Named here so a server-side deploy can actually be verified. A change
        // behind the API leaves the frontend bundle identical, so there was
        // previously no way to tell a live server from a stale one — which is
        // how "it's deployed" got said about something that wasn't.
        tools: allTools().map((tool) => tool.name),
        google: googleConfigured(),
        playstation: psnConfigured(),
        cap: monthlyCap(),
      });
    }),
  );

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

  /**
   * The laptop on the user's home network, checking in.
   *
   * Deliberately outside the password wall: the bridge is a program, not a
   * person, and it carries its own token instead. It is also the only route
   * here that anything on the open internet can reach without signing in, so
   * the token is compared in constant time and a wrong one is told nothing at
   * all beyond "no".
   */
  api.post(
    '/bridge',
    guard(async (req, res) => {
      await loadKeys().catch(() => {});
      const token = String(req.body?.token ?? '');

      const results = Array.isArray(req.body?.results) ? req.body.results : [];
      if (results.length > 0 && !(await report(token, results))) {
        res.status(401).json({error: 'no'});
        return;
      }

      const state = req.body?.state ?? null;
      const claimed = await claim(token, state);
      if (!claimed.ok) {
        res.status(401).json({error: 'no'});
        return;
      }

      res.json({commands: claimed.commands});
    }),
  );

  // ---- everything below needs a session ----------------------------------

  api.use(requireAuth);

  // Stored keys are read before any route that might need one, so a key pasted
  // into Grace takes effect on the very next request. A failure here must not
  // block the request: she falls back to the environment.
  api.use((_req, _res, next) => {
    loadKeys().then(
      () => next(),
      () => next(),
    );
  });

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

      const money = await spend();
      const state: GraceState = {
        messages,
        profile,
        policies,
        ready: isConfigured(),
        model: config.model,
        mode,
        summary,
        storage: {backend: getBackend().name, encrypted: Boolean(config.secret)},
        spend: {
          dollars: Math.round(money.dollars * 100) / 100,
          cap: monthlyCap(),
          requests: money.requests,
        },
      };
      res.json(state);
    }),
  );

  api.get(
    '/keys',
    guard(async (_req, res) => {
      res.json(await keyStatus());
    }),
  );

  api.post(
    '/keys',
    guard(async (req, res) => {
      const allowed = [
        'gemini',
        'govee',
        'googleClientId',
        'googleClientSecret',
        'ownerEmail',
        'psn',
      ] as const;
      const name = String(req.body?.name ?? '') as (typeof allowed)[number];
      if (!allowed.includes(name)) {
        res.status(400).json({error: 'unknown key'});
        return;
      }
      await setKey(name, String(req.body?.value ?? ''));
      // Never echoed back — the status says whether one is set, not what it is.
      res.json(await keyStatus());
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
      let grounded = false;

      try {
        for await (const delta of getProvider().stream({
          system,
          turns,
          signal: controller.signal,
          temperature: 0.7,
          fast: true,
          onGrounded: () => {
            if (!grounded) {
              grounded = true;
              send({type: 'searched'});
            }
          },
          onSearchFailed: (reason) => send({type: 'search-failed', reason}),
          tools: declarations(),
          onToolCall: async (name, args) => (await runTool({name, args})).result,
          onToolUsed: (name, summary) => {
            // Searching is an action like any other, but reads better as
            // "checked the web" than as a line of results.
            if (name === 'search_web') {
              if (!grounded) {
                grounded = true;
                send({type: 'searched'});
              }
              return;
            }
            send({type: 'acted', name, summary});
          },
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
      // The conversation has moved on, so the hint the transcriber works from
      // has to move with it — a stale one misses the name just mentioned.
      contextCache = null;
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
        const text = await getProvider().transcribe({
          audio,
          mimeType,
          context: await listeningContext(),
        });
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
  api.get('/google-status', guard(async (_req, res) => {
    const saved = await connection();
    res.json({
      configured: googleConfigured(),
      connected: Boolean(saved && !saved.brokenReason),
      email: saved?.email ?? null,
      problem: saved?.brokenReason ?? null,
      redirectUri: redirectUri(),
    });
  }));

  api.get('/google-start', (req, res) => {
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
  api.get('/google-callback', guard(async (req, res) => {
    // Everything on this page is escaped. The session cookie is SameSite=Lax,
    // so a top-level navigation carries it, which would make a reflected
    // parameter here enough to run script on Grace's own origin against a
    // signed-in user and read the entire conversation.
    const escape = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (character) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[character] as string,
      );

    const finish = (message: string) =>
      res.status(200).send(
        `<!doctype html><meta charset="utf-8"><title>Grace</title>` +
          `<body style="background:#07090c;color:#e2e8f0;font-family:system-ui;` +
          `display:grid;place-items:center;height:100vh;margin:0;text-align:center">` +
          `<div><p style="max-width:32rem;line-height:1.6">${escape(message)}</p>` +
          `<a href="/" style="color:#7dd3fc">Back to Grace</a></div>`,
      );

    if (req.query.error) {
      console.error('[grace] google declined:', String(req.query.error));
      finish('Google declined the connection. Nothing has changed.');
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

  api.post('/google-disconnect', guard(async (_req, res) => {
    await disconnect();
    res.json({ok: true});
  }));

  api.get('/google-mail', guard(async (req, res) => {
    try {
      res.json({
        messages: await recentMail(String(req.query.q ?? 'in:inbox'), 10),
      });
    } catch (error) {
      const failure = error as GoogleError;
      res.status(failure.needsReconnect ? 409 : 502).json({error: failure.message});
    }
  }));

  api.get('/google-diary', guard(async (_req, res) => {
    try {
      res.json({events: await upcoming(24)});
    } catch (error) {
      const failure = error as GoogleError;
      res.status(failure.needsReconnect ? 409 : 502).json({error: failure.message});
    }
  }));

  /** The token the laptop needs, and whether it has been heard from. */
  api.get(
    '/bridge-status',
    guard(async (_req, res) => {
      res.json({token: await bridgeToken(), ...(await bridgeStatus())});
    }),
  );

  // ---- the PlayStation ---------------------------------------------------

  /**
   * What the console is doing.
   *
   * Reading only, and not by choice: Sony's app API shows the console, it does
   * not operate it. Switching a PS5 on happens over the local network, which
   * is somewhere a server in a data centre cannot reach.
   */
  api.get(
    '/ps5',
    guard(async (_req, res) => {
      if (!psnConfigured()) {
        res.json({configured: false});
        return;
      }
      try {
        const [state, games] = await Promise.all([
          playstation(),
          recentlyPlayed(5).catch(() => []),
        ]);
        res.json({configured: true, ...state, recent: games});
      } catch (error) {
        const failure = error as PsnError;
        res.status(failure.needsToken ? 409 : 502).json({
          configured: true,
          error: failure.message,
        });
      }
    }),
  );

  // ---- reaching the phone ------------------------------------------------

  api.get(
    '/push-key',
    guard(async (_req, res) => {
      res.json({key: await publicKey(), devices: await devices()});
    }),
  );

  api.post(
    '/push-subscribe',
    guard(async (req, res) => {
      const result = await subscribe(req.body?.subscription);
      if (!result.ok) {
        res.status(400).json(result);
        return;
      }
      res.json({ok: true, devices: await devices()});
    }),
  );

  /** Proves the whole chain, which is the only way anyone trusts it. */
  api.post(
    '/push-test',
    guard(async (_req, res) => {
      const sent = await notify('Grace', 'That reached you. Everything is working.');
      res.json({sent});
    }),
  );

  // ---- her own initiative ------------------------------------------------

  /**
   * One look around, unprompted.
   *
   * The client calls this every few minutes while it is open. It costs nothing
   * when nothing has changed — the language model is only reached for when
   * there is genuinely something new to say — so it can run all day on a
   * ten-dollar budget.
   */
  api.post(
    '/pulse',
    guard(async (_req, res) => {
      if (!isConfigured()) {
        res.json({concerns: [], say: null, held: null});
        return;
      }
      res.json(await pulse());
    }),
  );

  /**
   * The three questions the dashboard exists to answer: what does my day look
   * like, what needs me, and what has she been doing.
   */
  api.get(
    '/day',
    guard(async (_req, res) => {
      const google = await connection().catch(() => null);
      const connected = Boolean(google && !google.brokenReason);

      const [events, mail, list, deeds, console_] = await Promise.all([
        connected ? upcoming(24, 8).catch(() => []) : Promise.resolve([]),
        connected
          ? recentMail('in:inbox is:unread category:primary newer_than:2d', 6).catch(
              () => [],
            )
          : Promise.resolve([]),
        outstanding().catch(() => []),
        recentDeeds(20).catch(() => []),
        psnConfigured() ? playstation().catch(() => null) : Promise.resolve(null),
      ]);

      res.json({
        google: connected,
        events,
        mail,
        // Only what is actually wanted soon. A list of everything outstanding
        // is a list; the point of this panel is the shortlist.
        reminders: list.slice(0, 8),
        deeds,
        playstation: console_?.presence ?? null,
      });
    }),
  );

  /**
   * Does the web actually work, and does she actually reach for it?
   *
   * Two different failures look identical from the outside: grounding being
   * refused, and the model simply never choosing to search. This runs both
   * halves separately and reports each in the provider's own words, because
   * guessing between them has already cost days.
   */
  api.post(
    '/web-check',
    guard(async (_req, res) => {
      const report: Record<string, unknown> = {model: config.model};

      // Half one: can this key ground at all?
      try {
        const answer = await getProvider().complete({
          system: 'Answer in one short sentence.',
          turns: [{role: 'user', text: 'What is today\'s date and one news headline?'}],
          search: true,
          temperature: 0,
        });
        report.grounding = 'ok';
        report.groundedAnswer = answer.slice(0, 300);
      } catch (error) {
        report.grounding = 'failed';
        report.groundingError = (error as Error).message.slice(0, 500);
      }

      // Half two: given the tool, does she pick it up?
      const called: string[] = [];
      try {
        let reply = '';
        for await (const delta of getProvider().stream({
          system:
            'You are a helpful assistant with tools. Use them when they apply.',
          turns: [{role: 'user', text: 'What is the weather in London right now?'}],
          tools: declarations(),
          onToolCall: async (name, args) => {
            called.push(name);
            return (await runTool({name, args})).result;
          },
        })) {
          reply += delta;
        }
        report.toolsOffered = declarations().map((tool) => tool.name);
        report.toolsCalled = called;
        report.reachedForTheWeb = called.includes('search_web');
        report.reply = reply.slice(0, 300);
      } catch (error) {
        report.toolCalling = 'failed';
        report.toolError = (error as Error).message.slice(0, 500);
      }

      res.json(report);
    }),
  );

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
    '/profile-address',
    guard(async (req, res) => {
      const raw = req.body?.addressAs;
      const addressAs =
        typeof raw === 'string' && raw.trim() ? raw.trim().slice(0, 40) : null;
      res.json(await setAddressAs(addressAs));
    }),
  );

  // The id travels in the body rather than the path: every route here is a
  // single segment on purpose. See the note above the route table.
  api.post(
    '/profile-forget',
    guard(async (req, res) => {
      const id = String(req.body?.id ?? '');
      if (!id) {
        res.status(400).json({error: 'which one?'});
        return;
      }
      res.json(await forget(id));
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
    '/conversation-clear',
    guard(async (_req, res) => {
      await clearConversation();
      res.json({ok: true});
    }),
  );

  return api;
}
