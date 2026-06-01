import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EASE } from "../theme";

/**
 * Elegant cinematic title: scale + fade + slight 3D tilt entrance, optional
 * exit fade, with a soft glow and drop shadow for high mobile contrast.
 *
 * `appearAt` / `disappearAt` are in frames RELATIVE to the parent Sequence.
 */
export const CinematicText: React.FC<{
  children: React.ReactNode;
  appearAt?: number;
  disappearAt?: number;
  fontSize?: number;
  weight?: number;
  color?: string;
  glow?: string;
  letterSpacing?: number;
  maxWidth?: number;
  top?: string; // vertical anchor, e.g. "38%"
  /** Subtle continuous pulse (used for the CTA). */
  pulse?: boolean;
  italic?: boolean;
}> = ({
  children,
  appearAt = 0,
  disappearAt,
  fontSize = 84,
  weight = 800,
  color = "#fdf6e8",
  glow = "rgba(255,200,120,0.55)",
  letterSpacing = -1,
  maxWidth = 880,
  top = "50%",
  pulse = false,
  italic = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt;

  // Spring-driven entrance for buttery, slightly overshooting motion.
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 200, stiffness: 90, mass: 1.1 },
  });

  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const scale = interpolate(enter, [0, 1], [0.86, 1]);
  const translateY = interpolate(enter, [0, 1], [38, 0]);
  const tiltX = interpolate(enter, [0, 1], [22, 0]); // 3D tilt settling flat
  const blur = interpolate(enter, [0, 1], [10, 0]);

  // Optional exit fade.
  let exit = 1;
  if (disappearAt !== undefined) {
    exit = interpolate(
      frame,
      [disappearAt, disappearAt + 18],
      [1, 0],
      { easing: EASE.soft, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  const pulseScale = pulse
    ? 1 + Math.sin((frame / fps) * Math.PI * 2 * 0.7) * 0.025
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: `translate(-50%, -50%) perspective(1000px) rotateX(${tiltX}deg) scale(${
          scale * pulseScale
        })`,
        opacity: opacity * exit,
        filter: `blur(${blur}px)`,
        width: maxWidth,
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily:
            "'Playfair Display', 'Georgia', 'Times New Roman', serif",
          fontWeight: weight,
          fontStyle: italic ? "italic" : "normal",
          fontSize,
          lineHeight: 1.08,
          letterSpacing,
          color,
          textShadow: `0 2px 22px ${glow}, 0 1px 3px rgba(0,0,0,0.85), 0 0 60px ${glow}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
