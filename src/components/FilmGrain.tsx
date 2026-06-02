import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

interface FilmGrainProps {
  /** Opacity of grain layer (0–1). Default 0.055 */
  opacity?: number;
  /** How fast the grain seed cycles (frames). Default 2 for slight flicker. */
  cycleFrames?: number;
}

/**
 * SVG fractal-noise film grain overlay.
 * Uses feTurbulence seed cycling to simulate analog film grain flicker.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({
  opacity = 0.055,
  cycleFrames = 2,
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / cycleFrames) % 64;
  const id = `fg-${seed}`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, zIndex: 1000 }}>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          <filter id={id} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              seed={seed}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="gray"
            />
            <feBlend in="SourceGraphic" in2="gray" mode="overlay" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter={`url(#${id})`}
          opacity="0.9"
        />
      </svg>
    </AbsoluteFill>
  );
};
