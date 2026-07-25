import type {
  ActionCategory,
  ChatEvent,
  ConfirmationPolicy,
  GraceState,
  InputMode,
  Profile,
} from '../../shared/types.ts';

export async function fetchState(): Promise<GraceState> {
  const response = await fetch('/api/state');
  if (!response.ok) throw new Error(`state request failed (${response.status})`);
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

  if (!response.ok || !response.body) {
    throw new Error(`chat request failed (${response.status})`);
  }

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

export async function setAddressAs(addressAs: string | null): Promise<Profile> {
  const response = await fetch('/api/profile/address', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({addressAs}),
  });
  return response.json();
}

export async function forgetEntry(id: string): Promise<Profile> {
  const response = await fetch(`/api/profile/${id}`, {method: 'DELETE'});
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
  await fetch('/api/conversation/clear', {method: 'POST'});
}
