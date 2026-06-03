import { spring, interpolate } from "remotion";

export interface CameraState {
  x: number;       // world-space pan (px)
  y: number;       // world-space tilt (px)
  z: number;       // world-space push (px) — positive = deeper into scene
  rotY: number;    // yaw (deg)
  rotX: number;    // pitch (deg)
  fov: number;     // CSS perspective (px) — lower = wider FOV
}

/**
 * Null camera controller — mirrors After Effects workflow:
 *   1. A "null" object holds position in world space.
 *   2. The scene is inverse-transformed by the null's position.
 *   3. Multiple independent springs drive each axis so each
 *      channel eases separately, just like AE graph editor curves.
 *
 * Animation: camera holds on foreground warrior (frames 0-30),
 * then pushes forward and pans to settle on background sage (30-150),
 * then holds (150-180).
 */
export function useNullCamera(frame: number, fps: number): CameraState {
  // ── Z-axis: camera pushes INTO the scene ─────────────────────────
  // Starts at z=0, pushes to z=700 (past the FG char, toward the BG char)
  const zSpring = spring({
    frame: frame - 30,          // delay 30 frames before moving
    fps,
    config: {
      damping: 18,
      stiffness: 65,
      mass: 2.2,
      overshootClamping: false, // slight overshoot = natural camera feel
    },
    durationInFrames: 110,
  });

  // ── X-axis: pan from FG position (left) to BG position (right) ───
  const xSpring = spring({
    frame: frame - 40,          // slight delay after z starts
    fps,
    config: {
      damping: 14,
      stiffness: 52,
      mass: 2.8,
    },
    durationInFrames: 105,
  });

  // ── Y-axis: slight upward reframe to BG character's eyeline ──────
  const ySpring = spring({
    frame: frame - 40,
    fps,
    config: {
      damping: 16,
      stiffness: 58,
      mass: 2.0,
    },
    durationInFrames: 100,
  });

  // ── Rotation: subtle yaw tracking the pan, pitch on push-in ──────
  const rotSpring = spring({
    frame: frame - 38,
    fps,
    config: {
      damping: 22,
      stiffness: 45,
      mass: 3.5,          // heavy = very slow rotation lag
    },
    durationInFrames: 115,
  });

  // Very subtle breathing/handheld drift on the null
  const drift = {
    x: Math.sin(frame * 0.025) * 2.5,
    y: Math.cos(frame * 0.018) * 1.8,
  };

  return {
    z:    interpolate(zSpring,   [0, 1], [0,    720]),
    x:    interpolate(xSpring,   [0, 1], [-90,  160]) + drift.x,
    y:    interpolate(ySpring,   [0, 1], [30,   -50]) + drift.y,
    rotY: interpolate(rotSpring, [0, 1], [2,    -5]),   // yaw follows pan
    rotX: interpolate(rotSpring, [0, 1], [0,     2]),   // pitch up slightly
    fov:  880,
  };
}
