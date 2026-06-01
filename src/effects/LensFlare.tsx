import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

/**
 * Anamorphic-style lens flare overlay rendered in 2D screen-space.
 * Position is given in % of the frame so it can be anchored to the in-scene
 * light source. Includes a hot core, a horizontal streak, and falloff glow.
 */
export const LensFlare: React.FC<{
  x?: number; // %
  y?: number; // %
  intensity?: number; // 0..1
  color?: string;
  streak?: boolean;
}> = ({ x = 28, y = 30, intensity = 1, color = "#ffd9a0", streak = true }) => {
  const a = interpolate(intensity, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {/* Outer atmospheric glow */}
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: "120vw",
          height: "120vw",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${color}${alpha(
            0.18 * a
          )} 0%, rgba(0,0,0,0) 55%)`,
        }}
      />
      {/* Hot core */}
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: 320,
          height: 320,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(255,255,255,${
            0.9 * a
          }) 0%, ${color}${alpha(0.6 * a)} 25%, rgba(0,0,0,0) 70%)`,
          filter: "blur(2px)",
        }}
      />
      {/* Horizontal anamorphic streak */}
      {streak && (
        <div
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: "160vw",
            height: 6,
            transform: "translate(-50%, -50%)",
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${color}${alpha(
              0.5 * a
            )} 50%, rgba(0,0,0,0) 100%)`,
            filter: "blur(2px)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// helper: float alpha -> 2-digit hex
function alpha(v: number) {
  const clamped = Math.max(0, Math.min(1, v));
  return Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");
}
