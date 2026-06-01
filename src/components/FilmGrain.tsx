import React from 'react';
import {useCurrentFrame} from 'remotion';

const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const frame = useCurrentFrame();
  // Shift noise seed each frame for organic grain flicker
  const freqX = 0.75 + ((frame * 13) % 7) * 0.01;
  const freqY = 0.75 + ((frame * 7) % 5) * 0.01;

  return (
    <>
      <svg style={{position: 'absolute', width: 0, height: 0, overflow: 'hidden'}}>
        <defs>
          <filter id={`grain-${frame % 8}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${freqX} ${freqY}`}
              numOctaves="4"
              seed={frame % 256}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" result="gray" />
            <feBlend in="SourceGraphic" in2="gray" mode="overlay" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 100,
          opacity,
          background: 'white',
          filter: `url(#grain-${frame % 8})`,
          mixBlendMode: 'overlay',
        }}
      />
    </>
  );
};

export default FilmGrain;
