import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

interface FilmGrainProps {
  opacity?: number;
  blendMode?: React.CSSProperties['mixBlendMode'];
}

// Animated film grain using SVG feTurbulence — seed changes each frame for organic noise
export const FilmGrain: React.FC<FilmGrainProps> = ({
  opacity = 0.035,
  blendMode = 'overlay',
}) => {
  const frame = useCurrentFrame();
  const seed = frame % 100; // Cycle through 100 noise patterns

  const filterId = `grain-${seed}`;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 100}}>
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity,
          mixBlendMode: blendMode,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              seed={seed}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="grayNoise"
            />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter={`url(#${filterId})`}
          fill="white"
        />
      </svg>
    </AbsoluteFill>
  );
};
