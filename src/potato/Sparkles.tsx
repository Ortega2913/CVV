import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/** A small SVG heart, drawn (no emoji font dependency). */
const Heart: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path
      d="M16 28 C 16 28 2 19 2 10 C 2 5 6 2 10 2 C 13 2 15 4 16 6 C 17 4 19 2 22 2 C 26 2 30 5 30 10 C 30 19 16 28 16 28 Z"
      fill={color}
    />
  </svg>
);

/** A 4-point sparkle star. */
const Star: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path
      d="M16 0 C 18 11 21 14 32 16 C 21 18 18 21 16 32 C 14 21 11 18 0 16 C 11 14 14 11 16 0 Z"
      fill={color}
    />
  </svg>
);

type Particle = {
  x: number; // % of width
  spawn: number; // frame
  life: number; // frames
  drift: number; // horizontal drift px
  size: number;
  rot: number;
  type: "heart" | "star";
  color: string;
};

/**
 * Floating, looping particles (hearts + sparkles) that rise and fade — the
 * playful motion-graphics garnish. Fully deterministic from the frame so it
 * renders identically every pass.
 */
export const Sparkles: React.FC<{ count?: number }> = ({ count = 16 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, height } = useVideoConfig();

  const particles = useMemo<Particle[]>(() => {
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const colors = ["#ffd66b", "#ff9ecf", "#fff3c4", "#ffb3a0", "#fff"];
    return new Array(count).fill(0).map(() => ({
      x: 8 + rand() * 84,
      spawn: rand() * durationInFrames,
      life: 70 + rand() * 70,
      drift: (rand() - 0.5) * 120,
      size: 22 + rand() * 34,
      rot: (rand() - 0.5) * 1.4,
      type: rand() > 0.5 ? "heart" : "star",
      color: colors[Math.floor(rand() * colors.length)],
    }));
  }, [count, durationInFrames]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {particles.map((p, i) => {
        // Looping local time within the particle's lifetime.
        const local = ((frame - p.spawn) % (p.life + 40) + (p.life + 40)) % (p.life + 40);
        if (local > p.life) return null;
        const t = local / p.life;
        const y = interpolate(t, [0, 1], [height * 0.92, height * 0.35]);
        const x = p.drift * t;
        const opacity =
          interpolate(t, [0, 0.15, 0.7, 1], [0, 0.9, 0.8, 0]) *
          (p.type === "star" ? 1 : 0.95);
        const scale = interpolate(t, [0, 0.25, 1], [0.4, 1, 0.85]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: 0,
              transform: `translate(${x}px, ${y}px) rotate(${
                p.rot + t * 0.6
              }rad) scale(${scale})`,
              opacity,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
            }}
          >
            {p.type === "heart" ? (
              <Heart size={p.size} color={p.color} />
            ) : (
              <Star size={p.size} color={p.color} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
