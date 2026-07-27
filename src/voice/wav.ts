/**
 * Recorded audio, converted to something Gemini will definitely accept.
 *
 * Browsers each record in their own container — Chrome gives WebM/Opus, Safari
 * gives MP4/AAC — and not all of those are accepted for transcription. Rather
 * than negotiate formats per browser and hope, everything is decoded and
 * re-encoded as 16 kHz mono WAV, which is both universally accepted and about
 * the smallest sensible representation of speech.
 */

const TARGET_RATE = 16_000;

/** Average the channels down to one. Speech gains nothing from stereo. */
function toMono(buffer: AudioBuffer): Float32Array {
  const {numberOfChannels, length} = buffer;
  if (numberOfChannels === 1) return buffer.getChannelData(0).slice();

  const mono = new Float32Array(length);
  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) mono[i] += data[i] / numberOfChannels;
  }
  return mono;
}

/** Linear interpolation is plenty for voice at these rates. */
function resample(input: Float32Array, from: number, to: number): Float32Array {
  if (from === to) return input;

  const ratio = from / to;
  const output = new Float32Array(Math.floor(input.length / ratio));

  for (let i = 0; i < output.length; i += 1) {
    const position = i * ratio;
    const left = Math.floor(position);
    const right = Math.min(left + 1, input.length - 1);
    const drift = position - left;
    output[i] = input[left] * (1 - drift) + input[right] * drift;
  }

  return output;
}

function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const bytes = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(bytes);

  const writeText = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM header length
  view.setUint16(20, 1, true); // uncompressed
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // bytes per second
  view.setUint16(32, 2, true); // bytes per sample
  view.setUint16(34, 16, true); // bits per sample
  writeText(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, clamped * 0x7fff, true);
  }

  return bytes;
}

/** Chunked so a long recording can't blow the call stack. */
function toBase64(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes);
  let binary = '';
  for (let i = 0; i < view.length; i += 0x8000) {
    binary += String.fromCharCode(...view.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export interface EncodedAudio {
  base64: string;
  mimeType: 'audio/wav';
  seconds: number;
}

/**
 * Samples straight to WAV, with no container in the middle.
 *
 * The ambient path captures raw audio off the audio thread rather than through
 * MediaRecorder, so there is nothing to decode: no codec, no container, and no
 * waiting for a recorder to stop before the words can be looked at. It also
 * sidesteps the trap that makes pre-roll almost impossible with MediaRecorder —
 * only its first chunk carries the stream header, so a buffer of later chunks
 * on its own is undecodable.
 */
/**
 * Bring a quiet recording up to a workable level.
 *
 * The half of "I have to shout at her" that no threshold fixes. Detecting
 * distant speech is one problem; handing a transcriber a recording at a
 * twentieth of full scale is a different one, and it fails in the way that
 * looks like mishearing — words come back wrong or not at all, so you repeat
 * yourself louder, and louder works, which makes it look like she needs volume
 * when she needed level.
 *
 * Peak normalisation rather than compression: it changes nothing about the
 * recording except how loud it is, so nothing is introduced that was not said.
 * The gain is capped, because the one thing worse than quiet speech is a room
 * of quiet nothing amplified twenty times into something that sounds like
 * speech to a transcriber willing to oblige.
 */
function normalise(samples: Float32Array): Float32Array {
  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));

  /*
   * Below this, whatever it is, it is not being amplified.
   *
   * Set from experience rather than theory: at 0.0015 this was lifting room
   * tone twelve-fold into something a transcriber would confidently put words
   * to, and it did — "I created", from an empty room. A real voice from across
   * a room peaks an order of magnitude above this even on a poor microphone,
   * so the quiet speech this exists for is untouched by the change.
   */
  if (peak < 0.012 || peak >= 0.7) return samples;

  // Eight rather than twelve, for the same reason: the top of that range was
  // only ever reached by material too quiet to be speech in the first place.
  const gain = Math.min(8, 0.85 / peak);
  const lifted = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i += 1) lifted[i] = samples[i] * gain;
  return lifted;
}

export function wavFromSamples(samples: Float32Array, rate: number): EncodedAudio {
  const resampled = resample(normalise(samples), rate, TARGET_RATE);
  return {
    base64: toBase64(encodeWav(resampled, TARGET_RATE)),
    mimeType: 'audio/wav',
    seconds: resampled.length / TARGET_RATE,
  };
}

export async function toWav(recording: Blob): Promise<EncodedAudio> {
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await recording.arrayBuffer());
    // Levelled the same way, so press-to-talk from across a room transcribes
    // as well as always-listening does.
    const samples = resample(
      normalise(toMono(decoded)),
      decoded.sampleRate,
      TARGET_RATE,
    );
    return {
      base64: toBase64(encodeWav(samples, TARGET_RATE)),
      mimeType: 'audio/wav',
      seconds: samples.length / TARGET_RATE,
    };
  } finally {
    await context.close();
  }
}
