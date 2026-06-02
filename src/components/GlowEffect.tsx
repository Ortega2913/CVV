import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

interface GlowEffectProps {
  color: string;
  intensity?: number;
  blur?: number;
  pulsing?: boolean;
  x?: string;
  y?: string;
}

// Radial glow bloom — mimics After Effects' glow effect
export const GlowEffect: React.FC<GlowEffectProps> = ({
  color,
  intensity = 0.5,
  blur = 80,
  pulsing = true,
  x = '50%',
  y = '50%',
}) => {
  const frame = useCurrentFrame();
  const breathe = pulsing
    ? intensity * (0.85 + Math.sin((frame / 45) * Math.PI) * 0.15)
    : intensity;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: breathe,
          filter: `blur(${blur}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
