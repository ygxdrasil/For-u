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
      // Save first, so the sample is generated in the voice being auditioned.
      await saveKey('voice', name);
      setChosen(name);
      const {audio, mimeType} = await speak(SAMPLE);
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

  return (
    <div className="space-y-1.5">
      <p className="mb-1 text-[0.62rem] leading-relaxed text-mist/50">
        Tap to hear each. The one with a tick is hers now.
      </p>
      {VOICES.map((voice) => (
        <button
          key={voice.name}
          type="button"
          onClick={() => void preview(voice.name)}
          className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition ${
            chosen === voice.name
              ? 'border-ice/40 bg-ice/10'
              : 'border-edge bg-surface/40 hover:border-ice/30'
          }`}>
          {playing === voice.name ? (
            <Loader2 size={13} className="animate-spin text-ice" />
          ) : chosen === voice.name ? (
            <Check size={13} className="text-ice" />
          ) : (
            <Play size={12} className="text-mist/50" />
          )}
          <span className="flex-1 text-xs text-slate-200">{voice.name}</span>
          <span className="text-[0.6rem] text-mist/45">{voice.note}</span>
        </button>
      ))}
    </div>
  );
}
