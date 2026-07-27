import {googleFetch} from './oauth';

const BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

export interface MailSummary {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  unread: boolean;
  /**
   * Bulk mail: newsletters, marketing, automated notices.
   *
   * Worked out from the List-Unsubscribe header, which every legitimate bulk
   * sender is obliged to set and no person writing to you ever does. That is a
   * far better signal than guessing from the address — plenty of real
   * correspondence comes from a company, and "noreply@" catches some of the
   * junk and none of the rest.
   */
  bulk: boolean;
}

interface Part {
  mimeType?: string;
  filename?: string;
  headers?: {name: string; value: string}[];
  body?: {data?: string; size?: number};
  parts?: Part[];
}

function headerMap(headers: {name: string; value: string}[] | undefined) {
  return Object.fromEntries(
    (headers ?? []).map((header) => [header.name.toLowerCase(), header.value]),
  ) as Record<string, string>;
}

/**
 * Walk the MIME tree for the readable body.
 *
 * A message is anything from a single text/plain part to text nested three
 * deep inside multipart/mixed wrapping multipart/related wrapping
 * multipart/alternative. Reaching for parts[0] works on the simplest case and
 * nothing else.
 */
function findText(part: Part | undefined): string {
  if (!part) return '';

  if (part.mimeType === 'text/plain' && !part.filename && part.body?.data) {
    return Buffer.from(part.body.data, 'base64url').toString('utf8');
  }

  for (const child of part.parts ?? []) {
    const found = findText(child);
    if (found) return found;
  }

  // Only fall back to HTML once no plain part exists anywhere in the tree.
  if (part.mimeType === 'text/html' && !part.filename && part.body?.data) {
    return Buffer.from(part.body.data, 'base64url')
      .toString('utf8')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return '';
}

export async function recentMail(query = 'in:inbox', limit = 10): Promise<MailSummary[]> {
  const list = (await googleFetch(
    `${BASE}/messages?maxResults=${limit}&q=${encodeURIComponent(query)}`,
  )) as {messages?: {id: string; threadId: string}[]};

  const ids = (list.messages ?? []).slice(0, limit);
  if (ids.length === 0) return [];

  // Metadata only: headers and a snippet, without pulling every body down.
  const messages = await Promise.all(
    ids.map((message) =>
      googleFetch(
        `${BASE}/messages/${message.id}?format=metadata` +
          '&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date' +
          '&metadataHeaders=List-Unsubscribe&metadataHeaders=Precedence',
      ).catch(() => null),
    ),
  );

  return messages.filter(Boolean).map((raw) => {
    const message = raw as {
      id: string;
      threadId: string;
      snippet?: string;
      labelIds?: string[];
      internalDate?: string;
      payload?: Part;
    };
    const headers = headerMap(message.payload?.headers);
    return {
      id: message.id,
      threadId: message.threadId,
      from: headers.from ?? 'unknown sender',
      subject: headers.subject ?? '(no subject)',
      // Server-authoritative and trivially sortable, unlike the Date header.
      date: new Date(Number(message.internalDate ?? 0)).toISOString(),
      snippet: message.snippet ?? '',
      unread: (message.labelIds ?? []).includes('UNREAD'),
      bulk:
        Boolean(headers['list-unsubscribe']) ||
        /^(bulk|list|auto_reply)$/i.test(headers.precedence ?? '') ||
        (message.labelIds ?? []).some((id) =>
          ['CATEGORY_PROMOTIONS', 'CATEGORY_SOCIAL', 'CATEGORY_FORUMS'].includes(id),
        ),
    };
  });
}

export async function readMail(id: string): Promise<MailSummary & {body: string}> {
  const message = (await googleFetch(`${BASE}/messages/${id}?format=full`)) as {
    id: string;
    threadId: string;
    snippet?: string;
    labelIds?: string[];
    internalDate?: string;
    payload?: Part;
  };

  const headers = headerMap(message.payload?.headers);
  return {
    id: message.id,
    threadId: message.threadId,
    from: headers.from ?? 'unknown sender',
    subject: headers.subject ?? '(no subject)',
    date: new Date(Number(message.internalDate ?? 0)).toISOString(),
    snippet: message.snippet ?? '',
    unread: (message.labelIds ?? []).includes('UNREAD'),
    // Opening one deliberately means it is wanted regardless of what it is.
    bulk: false,
    body: findText(message.payload) || (message.snippet ?? ''),
  };
}

/**
 * Labels she is not allowed to apply, at any cost, by any route.
 *
 * TRASH is Gmail's bin, and SPAM is a bin with the sender's reputation attached.
 * Both are reversible for thirty days and then not, which makes them the
 * closest thing to erasure this file can reach — so the one function that
 * changes labels refuses them outright rather than trusting every caller above
 * it to remember. The self-test asserts this list, and that nothing here calls
 * messages.trash or messages.delete.
 */
const FORBIDDEN = ['TRASH', 'SPAM'];

/**
 * The single seam through which mail is changed.
 *
 * Everything below goes through here, so there is exactly one place to read to
 * know what she can do to a mailbox: add labels, remove labels, and nothing
 * else. No endpoint that destroys is reachable from this file.
 */
async function modify(
  id: string,
  change: {add?: string[]; remove?: string[]},
): Promise<void> {
  const addLabelIds = change.add ?? [];
  const removeLabelIds = change.remove ?? [];

  const banned = [...addLabelIds, ...removeLabelIds].find((label) =>
    FORBIDDEN.includes(label.toUpperCase()),
  );
  if (banned) throw new Error(`${banned} is not hers to touch`);

  await googleFetch(`${BASE}/messages/${id}/modify`, {
    method: 'POST',
    body: JSON.stringify({addLabelIds, removeLabelIds}),
  });
}

/**
 * File a message out of the inbox.
 *
 * This is Gmail's archive, and it is worth being precise about what it is: the
 * INBOX label comes off and nothing else changes. The message keeps every word,
 * stays in All Mail, stays searchable, and comes back the moment anyone replies.
 * It is the tidying gesture, not the destroying one.
 */
export async function fileMail(id: string): Promise<void> {
  await modify(id, {remove: ['INBOX']});
}

export async function markRead(id: string): Promise<void> {
  await modify(id, {remove: ['UNREAD']});
}

/** Back to the top of the inbox, unread, because it wants attention again. */
export async function markUnread(id: string): Promise<void> {
  await modify(id, {add: ['UNREAD', 'INBOX']});
}

export async function star(id: string): Promise<void> {
  await modify(id, {add: ['STARRED']});
}

/**
 * Apply a label by name, making it if it does not exist.
 *
 * Gmail's modify endpoint speaks label ids, not names, and a person says
 * "file that under taxes" — so the name is resolved, and created on first use,
 * which is how a filing system starts existing without anyone setting it up.
 */
export async function labelMail(id: string, name: string): Promise<string> {
  const wanted = name.trim();
  if (!wanted) throw new Error('a label needs a name');
  if (FORBIDDEN.includes(wanted.toUpperCase())) {
    throw new Error(`${wanted} is not hers to touch`);
  }

  const existing = (await googleFetch(`${BASE}/labels`)) as {
    labels?: {id: string; name: string}[];
  };
  const found = (existing.labels ?? []).find(
    (label) => label.name.toLowerCase() === wanted.toLowerCase(),
  );

  const labelId =
    found?.id ??
    (
      (await googleFetch(`${BASE}/labels`, {
        method: 'POST',
        body: JSON.stringify({
          name: wanted,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
        }),
      })) as {id: string}
    ).id;

  await modify(id, {add: [labelId]});
  return found ? wanted : `${wanted} (new label)`;
}

/**
 * Write a draft. Never send it.
 *
 * This is the whole of Grace's outbound mail capability, and it stops here on
 * purpose: the user's first hard limit is that nothing goes out without their
 * say-so. Google offers no draft-only scope, so the restraint has to live
 * here. There is no send function in this file, and there must never be one —
 * the draft lands in Gmail and the user presses send themselves.
 */
export async function draftReply(options: {
  to: string;
  subject: string;
  body: string;
  threadId?: string;
}): Promise<{id: string}> {
  const mime = [
    `To: ${options.to}`,
    `Subject: ${encodeHeader(options.subject)}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    options.body,
  ].join('\r\n');

  const draft = (await googleFetch(`${BASE}/drafts`, {
    method: 'POST',
    body: JSON.stringify({
      message: {
        raw: Buffer.from(mime, 'utf8').toString('base64url'),
        ...(options.threadId ? {threadId: options.threadId} : {}),
      },
    }),
  })) as {id: string};

  return {id: draft.id};
}

/** Non-ASCII subjects need RFC 2047 encoded-word form or they arrive mangled. */
function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;
}
