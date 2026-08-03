/**
 * Reading the open web, safely.
 *
 * The gap this closes: he could be told "use an HTTP Request node" and still
 * not know the API. He may not invent an endpoint, so without a way to LOOK
 * ONE UP the only honest move left was to stop and ask — which is exactly what
 * he did, and what looked like refusing to build.
 *
 * The danger this creates, and why most of this file is a guard rather than a
 * fetch: a URL-fetching tool running on a server that holds an n8n API key is
 * a way to read things that server can reach and nobody else can. Cloud
 * metadata at 169.254.169.254 hands out credentials to anything that asks.
 * A private address reaches whatever is on the other side of the firewall.
 * And the instruction to fetch one can arrive inside a page he is reading, or
 * inside a workflow someone else wrote.
 *
 * So: http(s) only, public addresses only, checked AFTER resolving the name
 * rather than before — a hostname that resolves to 127.0.0.1 is the oldest
 * trick there is — and re-checked on every redirect, because a public URL that
 * 302s to a private one passes any check made only at the start.
 */

import dns from 'node:dns/promises';
import net from 'node:net';

export class BlockedUrlError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BlockedUrlError';
  }
}

/** Ranges that are never a public API, whatever the name in front of them. */
function isPrivateAddress(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    if (a === 10) return true; // private
    if (a === 127) return true; // loopback
    if (a === 0) return true; // "this host"
    if (a === 169 && b === 254) return true; // link-local — cloud metadata lives here
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 168) return true; // private
    if (a === 100 && b >= 64 && b <= 127) return true; // carrier NAT
    if (a >= 224) return true; // multicast and reserved
    return false;
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === '::1' || v === '::') return true;
    if (v.startsWith('fe80')) return true; // link-local
    if (v.startsWith('fc') || v.startsWith('fd')) return true; // unique local
    // ::ffff:127.0.0.1 and friends — an IPv4 address wearing a hat.
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateAddress(mapped[1]);
    return false;
  }
  return true; // unrecognised is not proven safe
}

/**
 * Throws unless this URL is somewhere on the public internet.
 * @param {string} raw
 * @param {(host:string)=>Promise<{address:string}[]>} [resolve] injectable for tests
 */
export async function assertPublicUrl(raw, resolve = (host) => dns.lookup(host, { all: true })) {
  let url;
  try {
    url = new URL(String(raw));
  } catch {
    throw new BlockedUrlError(`"${String(raw).slice(0, 80)}" is not a URL.`);
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BlockedUrlError(`I only read http and https. "${url.protocol}" could reach files or services that are none of my business.`);
  }

  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) {
    throw new BlockedUrlError(`${host} is a local name, not a public API. I will not read from inside the machine I am running on.`);
  }

  // A literal address needs no lookup and must be checked as given.
  if (net.isIP(host)) {
    if (isPrivateAddress(host)) {
      throw new BlockedUrlError(`${host} is a private or link-local address. That is inside a network, not on the internet, and reading it is not something I should be doing on your behalf.`);
    }
    return url;
  }

  let addresses;
  try {
    addresses = await resolve(host);
  } catch (err) {
    throw new BlockedUrlError(`I could not resolve ${host}: ${err.message}`);
  }

  const list = (Array.isArray(addresses) ? addresses : [addresses]).map((a) => a.address ?? a);
  if (!list.length) throw new BlockedUrlError(`${host} does not resolve to anything.`);

  const blocked = list.find((ip) => isPrivateAddress(ip));
  if (blocked) {
    throw new BlockedUrlError(
      `${host} resolves to ${blocked}, which is a private address. A public name pointing inward is how a fetch gets turned into a way of reading the server's own network, so I stop here.`,
    );
  }
  return url;
}

/** Tags out, entities decoded, whitespace collapsed. Docs pages, not markup. */
export function readableText(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

const MAX_BYTES = 400_000;

/**
 * Fetch a public URL and return something readable.
 *
 * Redirects are followed by hand, one at a time, so every hop is checked
 * again. `fetch` with redirect: 'follow' would check the first URL and then go
 * wherever it was sent.
 */
export async function fetchPublicUrl(
  rawUrl,
  { method = 'GET', headers = {}, body = null, timeoutMs = 12_000, fetchImpl = globalThis.fetch, resolve, maxHops = 4 } = {},
) {
  let url = await assertPublicUrl(rawUrl, resolve);
  const hops = [];

  for (let hop = 0; hop <= maxHops; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res;
    try {
      res = await fetchImpl(url.toString(), {
        method,
        headers: { Accept: 'application/json, text/html;q=0.9, */*;q=0.5', 'User-Agent': 'jason-n8n-assistant', ...headers },
        body: body === null || body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
        redirect: 'manual',
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      throw new Error(`Could not reach ${url.hostname}: ${err.name === 'AbortError' ? `no answer within ${Math.round(timeoutMs / 1000)}s` : err.message}`);
    }
    clearTimeout(timer);

    const location = res.headers?.get?.('location');
    if (res.status >= 300 && res.status < 400 && location) {
      hops.push(url.toString());
      url = await assertPublicUrl(new URL(location, url).toString(), resolve);
      continue;
    }

    const contentType = res.headers?.get?.('content-type') ?? '';
    const raw = await res.text();
    const clipped = raw.length > MAX_BYTES;
    const text = raw.slice(0, MAX_BYTES);

    let json = null;
    if (/json/i.test(contentType)) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }

    return {
      url: url.toString(),
      status: res.status,
      contentType,
      redirectedThrough: hops,
      json,
      text: json ? null : /html/i.test(contentType) ? readableText(text) : text,
      truncated: clipped,
    };
  }

  throw new Error(`${rawUrl} redirected more than ${maxHops} times; I stopped rather than following it around.`);
}
