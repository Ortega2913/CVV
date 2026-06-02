import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

interface VignetteProps {
  intensity?: number; // 0–1
  color?: string;
  pulsing?: boolean;
}

// Classic cinematic vignette — darkens edges to draw focus to center
export const Vignette: React.FC<VignetteProps> = ({
  intensity = 0.7,
  color = '#000000',
  pulsing = false,
}) => {
  const frame = useCurrentFrame();

  const breathe = pulsing
    ? 1 + Math.sin((frame / 60) * Math.PI) * 0.08
    : 1;

  const alpha = Math.round(intensity * breathe * 255)
    .toString(16)
    .padStart(2, '0');

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 99,
        background: `radial-gradient(
          ellipse 80% 70% at 50% 50%,
          transparent 40%,
          ${color}55 70%,
          ${color}${alpha} 100%
        )`,
      }}
    />
  );
};
