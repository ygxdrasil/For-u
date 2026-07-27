import {Check, FileText, Layers, Pencil} from 'lucide-react';
import {useEffect, useState} from 'react';
import type {Note, Situation} from '../lib/api';
import * as api from '../lib/api';
import {Panel} from './Panels';

/**
 * The two things she keeps beyond bare facts, shown and editable.
 *
 * Notes she can be corrected on — the whole reason to show a note the user can
 * see is so they can fix what she wrote. Situations are read-only here: their
 * history is a record, and editing a record is the one thing she does not do.
 */

export function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    api.fetchNotes().then(setNotes).catch(() => {});
  }, []);

  const save = async (note: Note) => {
    setNotes(await api.saveNote(note.id, note.title, draft).catch(() => notes));
    setEditing(null);
  };

  if (notes.length === 0) {
    return (
      <Panel title="Notes">
        <p className="text-xs text-mist/50">
          No project notes yet. Tell her where something has got to and she keeps
          a page on it.
        </p>
      </Panel>
    );
  }

  return (
    <Panel title="Notes">
      <div className="space-y-2.5">
        {notes.map((note) => (
          <div key={note.id} className="rounded-lg border border-edge/60 bg-surface/30 px-3 py-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                <FileText size={11} className="accent" />
                {note.title}
              </span>
              {editing === note.id ? (
                <button
                  type="button"
                  onClick={() => void save(note)}
                  className="text-mist/60 transition hover:text-ice">
                  <Check size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(note.id);
                    setDraft(note.body);
                  }}
                  className="text-mist/40 transition hover:text-slate-200">
                  <Pencil size={12} />
                </button>
              )}
            </div>
            {editing === note.id ? (
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={6}
                className="w-full resize-y rounded border border-edge bg-surface px-2 py-1.5 text-xs leading-relaxed text-slate-200 focus:border-ice/40 focus:outline-none"
              />
            ) : (
              <p className="whitespace-pre-wrap text-[0.72rem] leading-relaxed text-mist/80">
                {note.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ago(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

export function SituationsPanel() {
  const [situations, setSituations] = useState<Situation[]>([]);

  useEffect(() => {
    api.fetchSituations().then(setSituations).catch(() => {});
  }, []);

  const open = situations.filter((one) => one.status === 'open');
  if (open.length === 0) return null;

  return (
    <Panel title="In progress">
      <div className="space-y-2.5">
        {open.map((one) => {
          const last = one.updates[one.updates.length - 1];
          return (
            <div key={one.id} className="rounded-lg border border-edge/60 bg-surface/30 px-3 py-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                <Layers size={11} className="accent" />
                {one.title}
              </span>
              {last && (
                <p className="mt-1 text-[0.72rem] leading-relaxed text-mist/80">
                  {last.text}
                  <span className="ml-1.5 text-[0.6rem] text-mist/40">{ago(last.at)}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
