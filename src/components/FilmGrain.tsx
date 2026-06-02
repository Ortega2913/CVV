import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

interface FilmGrainProps {
  opacity?: number;
}

/**
 * Lightweight film grain using a CSS repeating-gradient noise pattern.
 * Cycles through 6 phase offsets every frame — far cheaper than SVG feTurbulence.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  // 6 phase offsets so grain visibly shifts each frame
  const phase = (frame % 6) * 17;
  const phase2 = (frame % 6) * 13;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        zIndex: 1000,
        backgroundImage: [
          `repeating-linear-gradient(${phase}deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 3px)`,
          `repeating-linear-gradient(${phase + 90}deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 4px)`,
          `repeating-linear-gradient(${phase2 + 45}deg, rgba(255,255,200,0.02) 0px, transparent 2px, transparent 5px)`,
        ].join(", "),
      }}
    />
  );
};
