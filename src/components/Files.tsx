import {FileUp, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {Panel} from './Panels';

/**
 * Documents she keeps.
 *
 * The reading happens here, in the browser, and only the text is sent — so a
 * PDF's bulk and PDF-parsing both stay off the server. Text formats (notes,
 * markdown, CSV, code) read cleanly with FileReader; anything binary she
 * cannot read, and the honest thing is to say so and ask for the text rather
 * than store gibberish.
 */

interface FileRow {
  id: string;
  name: string;
  chars: number;
}

const TEXTUAL = /\.(txt|md|markdown|csv|tsv|json|log|rtf|html?|xml|ya?ml|[jt]sx?|py|rb|go|rs|java|c|cpp|sh|css)$/i;

export function Files() {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch('/api/files')
      .then((response) => (response.ok ? response.json() : null))
      .then((body: {files?: FileRow[]} | null) => body?.files && setFiles(body.files))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const take = async (file: File) => {
    setNotice(null);
    if (!TEXTUAL.test(file.name)) {
      setNotice(
        `${file.name} isn't a text file I can read here. Paste its text into the chat and I'll keep that.`,
      );
      return;
    }

    setBusy(true);
    try {
      const text = await file.text();
      const response = await fetch('/api/file-add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: file.name, text}),
      });
      const body = (await response.json()) as {error?: string};
      if (!response.ok) throw new Error(body.error ?? 'could not keep that');
      await load();
    } catch (cause) {
      setNotice((cause as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const archive = async (id: string) => {
    await fetch('/api/file-archive', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id}),
    }).catch(() => {});
    load();
  };

  return (
    <Panel title="Documents">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void take(file);
          event.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-edge px-3 py-2 text-xs text-mist/70 transition hover:border-ice/40 hover:text-slate-200 disabled:opacity-50">
        <FileUp size={13} />
        {busy ? 'Reading…' : 'Give her a document'}
      </button>

      {notice && <p className="mt-2 text-[0.65rem] leading-relaxed text-ember/80">{notice}</p>}

      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((file) => (
            <li
              key={file.id}
              className="group flex items-center gap-2 rounded-lg border border-edge/60 bg-surface/30 px-2.5 py-1.5">
              <span className="min-w-0 flex-1 truncate text-xs text-slate-300">{file.name}</span>
              <span className="text-[0.6rem] text-mist/40">
                {(file.chars / 1000).toFixed(0)}k
              </span>
              <button
                type="button"
                onClick={() => void archive(file.id)}
                aria-label="Remove"
                className="text-mist/40 opacity-0 transition hover:text-rose-300 group-hover:opacity-100">
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1.5 text-[0.6rem] leading-relaxed text-mist/40">
        Text is read here and kept; the file itself never leaves your device.
        Ask her about it any time.
      </p>
    </Panel>
  );
}
