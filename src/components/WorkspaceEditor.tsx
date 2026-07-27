import {EyeOff, Plus} from 'lucide-react';
import {useEffect, useState} from 'react';
import type {Workspace} from '../../shared/types';
import * as api from '../lib/api';

/**
 * Making your own rooms, without me.
 *
 * A room is data — a name, a colour, the panels it shows, the pages it opens,
 * the line she says on arrival — so this is a form over that data, nothing
 * cleverer. The point the user asked for: add a room here and it appears in
 * the rail and the command palette at once, no deploy.
 *
 * Hidden, never deleted, so the four built-in rooms can always come back.
 */

const ACCENTS: Workspace['accent'][] = ['ice', 'amber', 'violet', 'rose'];
const ICONS = ['sparkles', 'house', 'briefcase', 'gamepad'];
const PANELS =
  'day, needs, weather, notes, situations, activity, connections, spend, ' +
  'github, workflows, deeds, faculties, attention';

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.6rem] uppercase tracking-wider text-mist/50">
        {label}
      </span>
      {children}
    </label>
  );
}

const box =
  'w-full rounded-lg border border-edge bg-void px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-mist/40 focus:border-ice/40 focus:outline-none';

function Row({
  room,
  onSave,
  onHide,
}: {
  room: Partial<Workspace>;
  onSave: (patch: Partial<Workspace>) => void;
  onHide?: () => void;
}) {
  const [draft, setDraft] = useState(room);
  const set = (patch: Partial<Workspace>) => setDraft((current) => ({...current, ...patch}));

  return (
    <div className="space-y-2 rounded-lg border border-edge/60 bg-surface/40 p-3">
      <div className="flex gap-2">
        <input
          value={draft.name ?? ''}
          onChange={(event) => set({name: event.target.value})}
          placeholder="Room name"
          className={box}
        />
        <select
          value={draft.accent ?? 'ice'}
          onChange={(event) => set({accent: event.target.value as Workspace['accent']})}
          className={`${box} w-24`}>
          {ACCENTS.map((accent) => (
            <option key={accent} value={accent}>
              {accent}
            </option>
          ))}
        </select>
      </div>

      <Field label="Icon">
        <select
          value={draft.icon ?? 'sparkles'}
          onChange={(event) => set({icon: event.target.value})}
          className={box}>
          {ICONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Panels (comma-separated)">
        <input
          value={(draft.panels ?? []).join(', ')}
          onChange={(event) =>
            set({panels: event.target.value.split(',').map((p) => p.trim()).filter(Boolean)})
          }
          placeholder={PANELS}
          className={box}
        />
      </Field>

      <Field label="Opens these pages (one per line)">
        <textarea
          value={(draft.opens ?? []).join('\n')}
          onChange={(event) =>
            set({opens: event.target.value.split('\n').map((u) => u.trim()).filter(Boolean)})
          }
          rows={2}
          placeholder="https://mail.google.com"
          className={`${box} resize-y`}
        />
      </Field>

      <Field label="She says on arrival (optional)">
        <input
          value={draft.brief ?? ''}
          onChange={(event) => set({brief: event.target.value})}
          placeholder="Brief me on anything failing."
          className={box}
        />
      </Field>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="flex-1 rounded-lg border border-ice/40 bg-ice/15 px-3 py-1.5 text-xs text-ice transition hover:bg-ice/25">
          Save
        </button>
        {onHide && (
          <button
            type="button"
            onClick={onHide}
            aria-label="Hide this room"
            className="rounded-lg border border-edge px-3 py-1.5 text-mist/60 transition hover:text-rose-300">
            <EyeOff size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export function WorkspaceEditor() {
  const [rooms, setRooms] = useState<Workspace[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.fetchWorkspaces().then(setRooms).catch(() => {});
  }, []);

  const save = async (patch: Partial<Workspace>) => {
    if (!patch.name?.trim()) return;
    setRooms(await api.saveWorkspace(patch).catch(() => rooms));
    setAdding(false);
  };

  return (
    <div className="space-y-2.5">
      {rooms.map((room) => (
        <Row
          key={room.id}
          room={room}
          onSave={save}
          onHide={
            // The Grace room is her home; hiding it would leave nowhere to land.
            room.id === 'grace'
              ? undefined
              : async () => setRooms(await api.hideWorkspace(room.id).catch(() => rooms))
          }
        />
      ))}

      {adding ? (
        <Row room={{accent: 'violet', icon: 'sparkles', panels: [], opens: []}} onSave={save} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-edge px-3 py-2 text-xs text-mist/60 transition hover:border-ice/40 hover:text-slate-200">
          <Plus size={13} /> New room
        </button>
      )}
      <p className="text-[0.6rem] leading-relaxed text-mist/40">
        A new room shows up in the rail and the command palette at once. Hidden
        rooms are filed, never deleted — reload to see built-in ones return.
      </p>
    </div>
  );
}
