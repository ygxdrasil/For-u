import {useEffect, useState} from 'react';
import {fetchKeys, saveKey, type KeyStatus} from '../lib/api';

const FIELDS = [
  {
    name: 'gemini' as const,
    label: 'Gemini',
    blurb: 'What she thinks, listens and speaks with. From aistudio.google.com.',
  },
  {
    name: 'govee' as const,
    label: 'Govee',
    blurb: 'Her lights. From the Govee app: Settings → Apply for API Key.',
  },
];

/**
 * Keys, pasted straight into her.
 *
 * The alternative is the hosting dashboard, which means finding the right
 * project and the right variable and then waiting out a redeploy. This takes
 * ten seconds and works from a phone. Nothing typed here is ever sent back —
 * only whether a key is present, and its last four characters.
 */
export function Keys() {
  const [status, setStatus] = useState<KeyStatus | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys().then(setStatus).catch(() => {});
  }, []);

  const save = async (name: 'gemini' | 'govee') => {
    setSaving(name);
    setError(null);
    try {
      setStatus(await saveKey(name, drafts[name] ?? ''));
      setDrafts((current) => ({...current, [name]: ''}));
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-3">
      {FIELDS.map((field) => {
        const state = status?.[field.name];
        return (
          <div key={field.name}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-xs text-slate-300">{field.label}</span>
              <span
                className={`text-[0.62rem] ${state?.set ? 'text-ice/80' : 'text-mist/50'}`}>
                {state?.set ? (state.hint ?? 'set') : 'not set'}
              </span>
            </div>
            <p className="mb-1.5 text-[0.62rem] leading-relaxed text-mist/50">
              {field.blurb}
            </p>
            <div className="flex gap-1.5">
              <input
                type="password"
                autoComplete="off"
                value={drafts[field.name] ?? ''}
                onChange={(event) =>
                  setDrafts((current) => ({...current, [field.name]: event.target.value}))
                }
                placeholder="Paste a key"
                className="min-w-0 flex-1 rounded-lg border border-edge bg-surface px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-mist/40 focus:border-ice/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void save(field.name)}
                disabled={saving === field.name}
                className="shrink-0 rounded-lg border border-ice/40 bg-ice/15 px-2.5 py-1.5 text-xs text-ice transition hover:bg-ice/25 disabled:opacity-40">
                {saving === field.name ? '…' : 'Save'}
              </button>
            </div>
          </div>
        );
      })}
      {error && <p className="text-xs text-rose-300">{error}</p>}
      <p className="text-[0.6rem] leading-relaxed text-mist/40">
        Stored encrypted, and never sent back to this page. Leave a box empty and
        save to clear a key and fall back to the hosting environment.
      </p>
    </div>
  );
}
