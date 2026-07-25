import express, {type Express, type Request, type Response} from 'express';
import type {
  ActionCategory,
  ChatEvent,
  ConfirmationPolicy,
  GraceState,
  InputMode,
} from '../shared/types.ts';
import {getPolicies, setPolicy} from './actions.ts';
import {config, isConfigured} from './config.ts';
import {learnFrom} from './learn.ts';
import {getProvider} from './llm/index.ts';
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
} from './memory.ts';
import {buildSystemPrompt} from './persona.ts';

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
  'Add GEMINI_API_KEY to .env.local and restart me.';

/**
 * A full express app rather than a bare Router: Vite's dev middleware hands over
 * a plain Node response, and it is express itself — not Router — that adds
 * res.json and friends. Mounting the app works in both dev and production.
 */
export function createApi(): Express {
  const api = express();
  api.use(express.json({limit: '1mb'}));

  api.get('/health', (_req, res) => {
    res.json({ok: true, configured: isConfigured(), model: config.model});
  });

  api.get('/state', (_req, res) => {
    const state: GraceState = {
      messages: getMessages(),
      profile: getProfile(),
      policies: getPolicies(),
      ready: isConfigured(),
      model: config.model,
    };
    res.json(state);
  });

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

      record('user', text, via);

      const system = buildSystemPrompt({
        profile: getProfile(),
        summary: getSummary(),
        policies: getPolicies(),
        via,
        now: new Date(),
      });

      let reply = '';

      try {
        const stream = getProvider().stream({
          system,
          turns: recentTurns(),
          signal: controller.signal,
          temperature: 0.7,
          fast: true,
        });

        for await (const delta of stream) {
          reply += delta;
          send({type: 'delta', text: delta});
        }
      } catch (error) {
        const message = (error as Error).message ?? 'unknown error';
        console.error('[grace] generation failed:', message);

        // A half-finished reply is still worth keeping; the user heard it.
        if (reply.trim()) record('grace', reply, via);
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

      send({type: 'done', message: record('grace', reply, via)});

      // Held open a moment longer so the profile panel can update in place.
      const learned = await learnFrom(text, reply);
      if (learned.length > 0) send({type: 'learned', entries: learned});
      res.end();

      void compactIfNeeded();
    }),
  );

  api.post('/profile/address', (req, res) => {
    const raw = req.body?.addressAs;
    const addressAs =
      typeof raw === 'string' && raw.trim() ? raw.trim().slice(0, 40) : null;
    res.json(setAddressAs(addressAs));
  });

  api.delete('/profile/:id', (req, res) => {
    res.json(forget(req.params.id));
  });

  api.post('/policies', (req, res) => {
    const category = req.body?.category as ActionCategory;
    const policy = req.body?.policy as ConfirmationPolicy;

    if (!['always', 'high-risk', 'never'].includes(policy)) {
      res.status(400).json({error: 'unknown confirmation policy'});
      return;
    }

    const result = setPolicy(category, policy);
    if (!result.ok) {
      res.status(409).json({error: result.reason});
      return;
    }

    res.json(getPolicies());
  });

  api.post('/conversation/clear', (_req, res) => {
    clearConversation();
    res.json({ok: true});
  });

  return api;
}
