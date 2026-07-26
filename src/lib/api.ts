import type {
  ActionCategory,
  AttentionMode,
  ChatEvent,
  DayView,
  GoogleStatus,
  ModeState,
  ConfirmationPolicy,
  GraceState,
  InputMode,
  Profile,
  ProfileEntry,
  PulseResult,
} from '../../shared/types.ts';

export type SessionStatus = 'open' | 'ok' | 'required' | 'misconfigured';

/** Thrown when the session has lapsed, so the UI can show the lock screen. */
export class NeedsPassword extends Error {
  constructor() {
    super('password required');
    this.name = 'NeedsPassword';
  }
}

async function expectOk(response: Response): Promise<Response> {
  if (response.status === 401) throw new NeedsPassword();
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {error?: string} | null;
    throw new Error(body?.error ?? `request failed (${response.status})`);
  }
  return response;
}

export async function fetchSession(): Promise<SessionStatus> {
  const response = await fetch('/api/session');
  const body = (await response.json()) as {status: SessionStatus};
  return body.status;
}

export async function login(password: string): Promise<void> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({password}),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {error?: string} | null;
    throw new Error(body?.error ?? 'could not sign in');
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/logout', {method: 'POST'});
}

export async function fetchState(): Promise<GraceState> {
  const response = await expectOk(await fetch('/api/state'));
  return response.json();
}

/**
 * Streams a reply. EventSource can't POST, so the SSE framing is parsed by hand
 * off the fetch body.
 */
export async function* streamChat(
  text: string,
  via: InputMode,
  signal?: AbortSignal,
): AsyncGenerator<ChatEvent> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text, via}),
    signal,
  });

  await expectOk(response);
  if (!response.body) throw new Error('no response body to read');

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';

  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;

      buffer += value;
      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? '';

      for (const frame of frames) {
        const line = frame.trim();
        if (!line.startsWith('data:')) continue;
        yield JSON.parse(line.slice(5).trim()) as ChatEvent;
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}

/**
 * Asks Grace to think over what was just said — updating what she knows and
 * folding old turns into her summary. Runs after the reply so neither sits in
 * front of it.
 */
export async function reflect(): Promise<ProfileEntry[]> {
  const response = await fetch('/api/reflect', {method: 'POST'});
  if (!response.ok) return [];
  const body = (await response.json()) as {learned?: ProfileEntry[]};
  return body.learned ?? [];
}

/**
 * Send recorded speech to be turned into text.
 *
 * Done on the server so hearing works in browsers that have no speech
 * recognition of their own, and so a failure comes back as a readable message.
 */
export async function transcribe(
  audio: string,
  mimeType: string,
): Promise<string> {
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({audio, mimeType}),
  });

  if (response.status === 401) throw new NeedsPassword();

  const body = (await response.json().catch(() => null)) as
    | {text?: string; error?: string}
    | null;

  if (!response.ok) throw new Error(body?.error ?? 'transcription failed');
  return (body?.text ?? '').trim();
}

/**
 * Ask for a line of speech back as audio.
 *
 * Generated on the server so Grace has one voice everywhere, rather than
 * whatever the browser happens to ship — or, on several of them, nothing.
 */
export async function speak(
  text: string,
  signal?: AbortSignal,
): Promise<{audio: string; mimeType: string}> {
  const response = await fetch('/api/speak', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text}),
    signal,
  });

  if (response.status === 401) throw new NeedsPassword();

  const body = (await response.json().catch(() => null)) as
    | {audio?: string; mimeType?: string; error?: string; detail?: string}
    | null;

  if (!response.ok || !body?.audio) {
    const failure = new Error(body?.error ?? 'speech failed');
    // Kept apart from the readable message so a diagnostic can show the
    // provider's own words without them leaking into ordinary notices.
    (failure as Error & {detail?: string}).detail = body?.detail;
    throw failure;
  }
  return {audio: body.audio, mimeType: body.mimeType ?? 'audio/wav'};
}

export async function webCheck(): Promise<Record<string, unknown>> {
  const response = await expectOk(await fetch('/api/web-check', {method: 'POST'}));
  return response.json();
}

/**
 * One unprompted look around.
 *
 * Costs nothing when nothing has changed, which is why the client can afford
 * to ask every few minutes for as long as it is open.
 */
export async function pulse(): Promise<PulseResult> {
  const response = await fetch('/api/pulse', {method: 'POST'});
  if (!response.ok) return {concerns: [], say: null, held: null};
  return response.json();
}

export async function fetchDay(): Promise<DayView | null> {
  const response = await fetch('/api/day');
  if (!response.ok) return null;
  return response.json();
}

export type KeyName =
  | 'gemini'
  | 'govee'
  | 'googleClientId'
  | 'googleClientSecret'
  | 'ownerEmail'
  | 'psn';

export type KeyStatus = Record<
  KeyName,
  {set: boolean; pasted: boolean; hint: string | null}
>;

export async function fetchKeys(): Promise<KeyStatus> {
  const response = await expectOk(await fetch('/api/keys'));
  return response.json();
}

export async function saveKey(name: KeyName, value: string): Promise<KeyStatus> {
  const response = await expectOk(
    await fetch('/api/keys', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, value}),
    }),
  );
  return response.json();
}

export async function googleStatus(): Promise<GoogleStatus | null> {
  const response = await fetch('/api/google-status');
  if (!response.ok) return null;
  return response.json();
}

export async function disconnectGoogle(): Promise<void> {
  await fetch('/api/google-disconnect', {method: 'POST'});
}

export async function setAttentionMode(mode: AttentionMode): Promise<ModeState> {
  const response = await expectOk(
    await fetch('/api/mode', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({mode}),
    }),
  );
  return response.json();
}

export async function setAddressAs(addressAs: string | null): Promise<Profile> {
  const response = await expectOk(
    await fetch('/api/profile-address', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({addressAs}),
    }),
  );
  return response.json();
}

export async function forgetEntry(id: string): Promise<Profile> {
  const response = await expectOk(
    await fetch('/api/profile-forget', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id}),
    }),
  );
  return response.json();
}

export async function updatePolicy(
  category: ActionCategory,
  policy: ConfirmationPolicy,
): Promise<{error?: string}> {
  const response = await fetch('/api/policies', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({category, policy}),
  });
  return response.json();
}

export async function clearConversation(): Promise<void> {
  await fetch('/api/conversation-clear', {method: 'POST'});
}
