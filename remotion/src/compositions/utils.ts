import { interpolate, spring, SpringConfig } from "remotion";

const fastSpring: SpringConfig = { damping: 18, stiffness: 160, mass: 1, overshootClamping: false };
const bouncySpring: SpringConfig = { damping: 12, stiffness: 200, mass: 0.8, overshootClamping: false };

export function fadeIn(frame: number, from: number, duration = 20): number {
  return interpolate(frame, [from, from + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function slideUp(frame: number, from: number, fps: number, distance = 40): number {
  const progress = spring({ frame: frame - from, fps, config: fastSpring });
  return interpolate(progress, [0, 1], [distance, 0]);
}

export function slideLeft(frame: number, from: number, fps: number, distance = 60): number {
  const progress = spring({ frame: frame - from, fps, config: fastSpring });
  return interpolate(progress, [0, 1], [distance, 0]);
}

export function scaleIn(frame: number, from: number, fps: number): number {
  return spring({ frame: frame - from, fps, config: bouncySpring });
}

export function progressBar(frame: number, from: number, fps: number, targetFill: number): number {
  const progress = spring({ frame: frame - from, fps, config: { damping: 20, stiffness: 100, mass: 1 } });
  return interpolate(progress, [0, 1], [0, targetFill]);
}
