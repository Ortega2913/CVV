import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

interface LightLeakProps {
  duration?: number;
  color?: string;
}

// Film burn / light leak transition overlay
const LightLeak: React.FC<LightLeakProps> = ({duration = 30, color = '#FF8C32'}) => {
  const frame = useCurrentFrame();

  const peakFrame = duration * 0.4;
  const opacity = interpolate(
    frame,
    [0, peakFrame, duration],
    [0, 0.85, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const scaleX = interpolate(frame, [0, duration], [0.3, 1.4]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 200,
        overflow: 'hidden',
        opacity,
      }}
    >
      {/* Primary burn streak */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '120%',
          height: '70%',
          background: `radial-gradient(ellipse at 60% 30%, ${color}CC 0%, ${color}44 40%, transparent 70%)`,
          transform: `scaleX(${scaleX}) rotate(-8deg)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* Secondary streak */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '80%',
          height: '50%',
          background: `radial-gradient(ellipse at 40% 70%, #FF6B0066 0%, transparent 60%)`,
          transform: `scaleX(${scaleX * 0.7}) rotate(5deg)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* White core flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'white',
          opacity: interpolate(frame, [0, peakFrame * 0.5, peakFrame, duration], [0, 0.15, 0, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

export default LightLeak;
