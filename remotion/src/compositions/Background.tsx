import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "./constants";

function Particle({ x, y, size, speed, frame }: { x: number; y: number; size: number; speed: number; frame: number }) {
  const yOffset = ((frame * speed) % (HEIGHT + 60)) - 30;
  const opacity = interpolate(size, [1, 4], [0.15, 0.45]);
  return (
    <circle
      cx={x}
      cy={y - yOffset}
      r={size}
      fill={Math.random() > 0.5 ? COLORS.accent : COLORS.accentAlt}
      opacity={opacity}
    />
  );
}

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % WIDTH,
  y: (i * 197.3) % HEIGHT,
  size: 1 + (i % 3),
  speed: 0.2 + (i % 5) * 0.08,
}));

export function Background() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pulse = interpolate(Math.sin(frame * 0.015), [-1, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 30% 40%, ${COLORS.bgGrad1} 0%, ${COLORS.bg} 55%, ${COLORS.bgGrad2} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Animated grid */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={COLORS.accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glowing orbs */}
      <div
        style={{
          position: "absolute",
          left: -150,
          top: -150,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(108,99,255,${0.08 * pulse}) 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -100,
          bottom: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,229,255,${0.06 * pulse}) 0%, transparent 70%)`,
        }}
      />

      {/* Floating particles */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        {PARTICLES.map((p) => (
          <Particle key={p.id} {...p} frame={frame} />
        ))}
      </svg>

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}88, ${COLORS.accentAlt}88, transparent)`,
          top: `${((frame * 1.2) % (HEIGHT + 20)) - 10}px`,
          opacity: 0.4,
        }}
      />
    </div>
  );
}
