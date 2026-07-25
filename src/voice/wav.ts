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

export async function toWav(recording: Blob): Promise<EncodedAudio> {
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await recording.arrayBuffer());
    const samples = resample(toMono(decoded), decoded.sampleRate, TARGET_RATE);
    return {
      base64: toBase64(encodeWav(samples, TARGET_RATE)),
      mimeType: 'audio/wav',
      seconds: samples.length / TARGET_RATE,
    };
  } finally {
    await context.close();
  }
}
