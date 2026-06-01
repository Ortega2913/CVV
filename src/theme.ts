import { Easing } from "remotion";

/**
 * Global video constants. The whole piece is exactly 30s @ 30fps.
 */
export const FPS = 30;
export const DURATION_IN_FRAMES = 30 * FPS; // 900 frames = 30.000s

// Vertical short-form canvas (1080p). Render at --scale=2 for 4K.
export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * Scene timeline (in frames). Scenes slightly overlap so the
 * light-leak transitions can cross-fade like After Effects.
 */
export const SCENES = {
  hook: { start: 0, duration: 5 * FPS }, // 0s  -> 5s
  cross: { start: 5 * FPS, duration: 17 * FPS }, // 5s  -> 22s
  closing: { start: 22 * FPS, duration: 8 * FPS }, // 22s -> 30s
} as const;

// Length (in frames) of the cross-fade transition overlays.
export const TRANSITION = Math.round(1.2 * FPS); // ~1.2s, < 1.5s spec max

/**
 * Cinematic colour palette — warm golden highlights vs. cool blue shadows.
 */
export const COLORS = {
  deepShadow: "#05060a",
  nightBlue: "#0b1733",
  stormBlue: "#1b2b4a",
  steel: "#3c4b66",
  gold: "#f6c66b",
  warmGold: "#ffb24d",
  amber: "#ff8a3d",
  sunrise: "#ffd9a0",
  paperWhite: "#fdf6e8",
  bloodMoon: "#7a2f2f",
} as const;

/**
 * Reusable cinematic easings (After-Effects-style bezier curves).
 */
export const EASE = {
  // Smooth, slightly heavy ease-in-out — for camera & big moves.
  cinematic: Easing.bezier(0.65, 0, 0.35, 1),
  // Snappy entrance with a soft landing — for text impact.
  impact: Easing.bezier(0.16, 1, 0.3, 1),
  // Gentle ease-out — for fades and glows.
  soft: Easing.bezier(0.25, 0.1, 0.25, 1),
  // Slow majestic ease — for the final crane-up.
  majestic: Easing.bezier(0.45, 0, 0.1, 1),
} as const;

/**
 * Set to `true` after you drop the audio files into /public.
 * Kept off by default so the project renders out-of-the-box.
 *  - public/audio/music.mp3      (emotional piano + orchestral swell)
 *  - public/audio/voiceover.mp3  (deep male voiceover, full 30s)
 *  - public/audio/ambience.mp3   (wind/thunder -> birds at sunrise)
 */
export const ENABLE_AUDIO = false;
