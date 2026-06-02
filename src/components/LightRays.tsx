import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

interface LightRaysProps {
  color?: string;
  intensity?: number;
  numRays?: number;
  originX?: number; // 0-100 percent
  originY?: number;
  animated?: boolean;
}

// Divine light rays radiating from a point — iconic cinematic spiritual effect
export const LightRays: React.FC<LightRaysProps> = ({
  color = '#f59e0b',
  intensity = 0.4,
  numRays = 12,
  originX = 50,
  originY = 50,
  animated = true,
}) => {
  const frame = useCurrentFrame();
  const rotation = animated ? (frame / 300) * 360 : 0;

  const rays = Array.from({length: numRays}, (_, i) => {
    const angle = (360 / numRays) * i + rotation;
    const width = 3 + (i % 3) * 2; // varying ray widths
    const rayOpacity = (0.5 + (i % 3) * 0.2) * intensity;
    return {angle, width, opacity: rayOpacity};
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {rays.map((ray, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${originX}%`,
            top: `${originY}%`,
            width: '120%',
            height: `${ray.width}px`,
            background: `linear-gradient(90deg, ${color} 0%, transparent 80%)`,
            opacity: ray.opacity,
            transformOrigin: '0 50%',
            transform: `rotate(${ray.angle}deg)`,
            filter: `blur(${ray.width * 2}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
