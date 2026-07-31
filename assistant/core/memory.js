/**
 * What Jason knows about you.
 *
 * Facts he has picked up or been told: which Slack channel is the real one,
 * that the sales sheet is the one with the date in the tab name, that you do
 * not want email sent from anything. They go into every prompt, so he stops
 * asking the same question twice.
 *
 * Nothing is ever deleted. Correcting a fact supersedes it — the old text stays
 * on the record with a pointer to what replaced it, so you can always see what
 * he used to believe and when it changed.
 */

const KEY = 'memory:facts';
const MAX_ACTIVE = 60;
const MAX_LEN = 300;

export async function loadMemory(store) {
  const raw = (await store.getKv(KEY)) ?? [];
  return Array.isArray(raw) ? raw : [];
}

export async function activeFacts(store) {
  return (await loadMemory(store)).filter((f) => !f.supersededBy);
}

/**
 * @param {object} store
 * @param {string} text
 * @param {object} [opts]
 * @param {string} [opts.source] 'told' when you said it, 'learned' when he inferred it
 * @param {string} [opts.supersedes] id of the fact this replaces
 */
export async function remember(store, text, { source = 'learned', supersedes = null } = {}) {
  const clean = String(text ?? '').trim().slice(0, MAX_LEN);
  if (!clean) throw new Error('A memory needs some text.');

  const all = await loadMemory(store);
  const active = all.filter((f) => !f.supersededBy);

  // Near-duplicates are the failure mode here: the same fact restated slightly
  // differently every session, until the prompt is thirty variations of one
  // thing. Refuse rather than accumulate.
  const normalised = clean.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
  const duplicate = active.find(
    (f) => f.text.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ') === normalised,
  );
  if (duplicate) return { fact: duplicate, added: false, reason: 'Already remembered.' };

  const fact = {
    id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    text: clean,
    source,
    at: new Date().toISOString(),
    supersededBy: null,
  };

  const next = all.map((f) => (supersedes && f.id === supersedes ? { ...f, supersededBy: fact.id } : f));
  next.push(fact);

  // Bound what reaches the prompt. The oldest active facts retire first, and
  // retiring is still supersession — the text stays on the record.
  const stillActive = next.filter((f) => !f.supersededBy);
  if (stillActive.length > MAX_ACTIVE) {
    const overflow = stillActive.slice(0, stillActive.length - MAX_ACTIVE).map((f) => f.id);
    for (const f of next) if (overflow.includes(f.id)) f.supersededBy = 'retired:capacity';
  }

  await store.setKv(KEY, next);
  return { fact, added: true };
}

export async function correct(store, id, newText) {
  const all = await loadMemory(store);
  if (!all.some((f) => f.id === id)) throw new Error(`No memory with id ${id}.`);
  return remember(store, newText, { source: 'told', supersedes: id });
}

/** Retire a fact without replacing it. The record is kept. */
export async function retire(store, id) {
  const all = await loadMemory(store);
  const found = all.find((f) => f.id === id);
  if (!found) throw new Error(`No memory with id ${id}.`);
  await store.setKv(
    KEY,
    all.map((f) => (f.id === id ? { ...f, supersededBy: 'retired:by-you' } : f)),
  );
  return { retired: true, id };
}

/**
 * The block that goes into the system prompt. Kept after the never-changing
 * rules so the cacheable prefix stays byte-identical, and rendered compactly
 * because every line here is paid for on every single request.
 */
export async function memoryPrompt(store) {
  const facts = await activeFacts(store);
  if (!facts.length) return '';
  return ['WHAT YOU KNOW ABOUT THIS USER (do not ask about these again):', ...facts.map((f) => `- ${f.text}`)].join('\n');
}
