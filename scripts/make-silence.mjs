/**
 * Generates a silent WAV file and copies it to all required audio slots.
 * Run with: node scripts/make-silence.mjs
 */
import { writeFileSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";

const AUDIO_DIR = "public/audio";
mkdirSync(AUDIO_DIR, { recursive: true });

/** Build a PCM WAV Buffer of pure silence */
function silentWav(durationSec, sampleRate = 44100, channels = 1, bitsPerSample = 16) {
  const numSamples = Math.ceil(durationSec * sampleRate) * channels;
  const dataSize   = numSamples * (bitsPerSample / 8);
  const buf        = Buffer.alloc(44 + dataSize, 0);

  // RIFF header
  buf.write("RIFF",    0, "ascii");
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE",    8, "ascii");

  // fmt  chunk
  buf.write("fmt ",   12, "ascii");
  buf.writeUInt32LE(16,                                    16); // chunk size
  buf.writeUInt16LE(1,                                     20); // PCM
  buf.writeUInt16LE(channels,                              22);
  buf.writeUInt32LE(sampleRate,                            24);
  buf.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 28); // byte rate
  buf.writeUInt16LE(channels * bitsPerSample / 8,          32); // block align
  buf.writeUInt16LE(bitsPerSample,                         34);

  // data chunk
  buf.write("data",   36, "ascii");
  buf.writeUInt32LE(dataSize,                              40);

  return buf;
}

// One long silence file covers background music (306 s total)
const bgMusic = silentWav(310);
writeFileSync(join(AUDIO_DIR, "background-music.mp3"), bgMusic);
console.log("✓ background-music.mp3 (310 s silence, ~26 MB)");

// Scene-specific narrator durations (in seconds)
const narrators = {
  "narrator-01": 30,
  "narrator-03": 24,
  "narrator-04": 27,
  "narrator-05": 14,
  "narrator-06": 12,
  "narrator-07": 16,
  "narrator-08": 21,
  "narrator-09": 13,
  "narrator-10": 21,
  "narrator-11": 14,
  "narrator-12": 18,
  "narrator-13": 15,
  "narrator-14":  8,
  "narrator-15": 23,
  "narrator-16": 10,
  "narrator-17": 15,
};

for (const [name, sec] of Object.entries(narrators)) {
  const path = join(AUDIO_DIR, `${name}.mp3`);
  writeFileSync(path, silentWav(sec));
  console.log(`✓ ${name}.mp3 (${sec} s)`);
}

console.log("\nAll silent placeholder audio files created.");
console.log("Replace them with real narration + music before your final render.");
