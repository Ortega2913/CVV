import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Animated film grain via an SVG turbulence filter. The seed advances every
 * frame so the grain shimmers like real film stock. Blended on "overlay" at low
 * opacity so it textures the image without washing it out.
 */
export const FilmGrain: React.FC<{ opacity?: number }> = ({
  opacity = 0.09,
}) => {
  const frame = useCurrentFrame();
  const seed = frame % 100;

  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            stitchTiles="stitch"
            seed={seed}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
