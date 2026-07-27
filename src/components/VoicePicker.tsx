import {Check, Loader2, Play} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {fetchKeys, saveKey, speak} from '../lib/api';

/**
 * Choosing her voice, by ear.
 *
 * Gemini ships a set of prebuilt voices, and a name on a list tells you
 * nothing about how one sounds. So each is a play button: it generates a
 * sample line in that voice and plays it, and the tick is the one currently
 * chosen. A curated few rather than all thirty — enough range without a wall.
 */

const VOICES: {name: string; note: string}[] = [
  {name: 'Kore', note: 'Composed, even — her default'},
  {name: 'Aoede', note: 'Warm, bright'},
  {name: 'Callirrhoe', note: 'Soft, easy'},
  {name: 'Leda', note: 'Youthful, light'},
  {name: 'Autonoe', note: 'Clear, assured'},
  {name: 'Zephyr', note: 'Airy, quick'},
  {name: 'Charon', note: 'Low, steady'},
  {name: 'Orus', note: 'Firm, grounded'},
];

const SAMPLE = 'Good evening. Everything is in order, and nothing needs you just now.';

export function VoicePicker() {
  const [chosen, setChosen] = useState<string>('Kore');
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchKeys()
      .then((keys) => {
        // The hint holds the stored value for the non-secret voice field.
        if (keys.voice?.hint) setChosen(keys.voice.hint);
      })
      .catch(() => {});
  }, []);

  const preview = async (name: string) => {
    setPlaying(name);
    try {
      // An audition, not a commitment. This used to save first so the sample
      // came out in the right voice, which meant browsing the list silently
      // re-chose her voice on every tap — whoever you heard last was who she
      // became. The sample now carries its own voice override instead.
      const {audio, mimeType} = await speak(SAMPLE, undefined, name);
      const element = audioRef.current ?? new Audio();
      audioRef.current = element;
      element.src = `data:${mimeType};base64,${audio}`;
      await element.play();
    } catch {
      // A voice that fails to generate is one to avoid; the notice elsewhere
      // covers a broken key.
    } finally {
      setPlaying(null);
    }
  };

  const choose = async (name: string) => {
    await saveKey('voice', name).catch(() => {});
    setChosen(name);
  };

  return (
    <div className="space-y-1.5">
      <p className="mb-1 text-[0.62rem] leading-relaxed text-mist/50">
        Tap a name to hear it — listening changes nothing. “Use” makes it hers.
      </p>
      {VOICES.map((voice) => (
        <div
          key={voice.name}
          className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 transition ${
            chosen === voice.name
              ? 'border-ice/40 bg-ice/10'
              : 'border-edge bg-surface/40 hover:border-ice/30'
          }`}>
          <button
            type="button"
            onClick={() => void preview(voice.name)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left">
            {playing === voice.name ? (
              <Loader2 size={13} className="animate-spin text-ice" />
            ) : (
              <Play size={12} className="text-mist/50" />
            )}
            <span className="flex-1 text-xs text-slate-200">{voice.name}</span>
            <span className="text-[0.6rem] text-mist/45">{voice.note}</span>
          </button>
          {chosen === voice.name ? (
            <Check size={13} className="shrink-0 text-ice" />
          ) : (
            <button
              type="button"
              onClick={() => void choose(voice.name)}
              className="shrink-0 rounded-md border border-ice/40 bg-ice/10 px-2 py-0.5 text-[0.62rem] text-ice transition hover:bg-ice/25">
              Use
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
