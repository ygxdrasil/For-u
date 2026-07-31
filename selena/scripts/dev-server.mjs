#!/usr/bin/env node
/**
 * A local stand-in for Vercel's function runtime.
 *
 * `vercel dev` needs a CLI shim, and .cmd/.bat are blocked by group policy on
 * the target machine — so this mounts the same api/*.js handlers on a plain
 * Node server instead. Same modules, same code paths, no CLI.
 *
 * It deliberately mirrors Vercel's routing rule: /api/x maps to api/x.js, and
 * /api/x/y is a 404, exactly as it would be in production. Discovering that
 * difference locally is the whole point.
 *
 *   node scripts/dev-server.mjs           API on 3101
 *   node scripts/dev-server.mjs --port 8080 --static dist    API plus the built HUD
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const PORT = Number(argOf('--port', 3101));
const STATIC_DIR = argOf('--static', null);

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

const handlers = new Map();
async function handlerFor(name) {
  if (!handlers.has(name)) {
    const file = path.join(ROOT, 'api', `${name}.js`);
    if (!fs.existsSync(file)) return null;
    const mod = await import(pathToFileURL(file).href);
    handlers.set(name, mod.default);
  }
  return handlers.get(name);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname.startsWith('/api/')) {
    const rest = url.pathname.slice('/api/'.length);
    // The production rule, reproduced: one segment only.
    if (rest.includes('/')) {
      res.statusCode = 404;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ ok: false, error: `Vercel serves /api/x but 404s /api/x/y. "${url.pathname}" is nested and would never run in production.` }));
    }
    const handler = await handlerFor(rest);
    if (!handler) {
      res.statusCode = 404;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ ok: false, error: `No route api/${rest}.js` }));
    }
    try {
      return await handler(req, res);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ ok: false, error: err.message, stack: err.stack?.split('\n').slice(0, 4) }));
    }
  }

  if (STATIC_DIR) {
    const base = path.resolve(ROOT, STATIC_DIR);
    let file = path.join(base, url.pathname === '/' ? 'index.html' : url.pathname);
    // Never serve outside the static root, however the path is written.
    if (!path.resolve(file).startsWith(base)) file = path.join(base, 'index.html');
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(base, 'index.html');
    if (fs.existsSync(file)) {
      res.setHeader('content-type', MIME[path.extname(file)] ?? 'application/octet-stream');
      return res.end(fs.readFileSync(file));
    }
  }

  res.statusCode = 404;
  res.end('not found');
});

server.listen(PORT, () => {
  console.log(`Selena API on http://localhost:${PORT}/api/health`);
  if (STATIC_DIR) console.log(`HUD on http://localhost:${PORT}/`);
});
