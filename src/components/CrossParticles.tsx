import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';

interface Particle {
  id: number;
  baseX: number;       // 0-100 percent
  speed: number;       // vertical rise speed
  driftFreq: number;   // horizontal drift frequency
  driftAmp: number;    // horizontal drift amplitude (percent)
  size: number;        // px
  opacity: number;     // max opacity
  phaseOffset: number; // frame offset for stagger
  color: string;
}

const CrossShape: React.FC<{size: number; color: string; opacity: number}> = ({
  size,
  color,
  opacity,
}) => (
  <div
    style={{
      position: 'relative',
      width: size,
      height: size,
      opacity,
      filter: `drop-shadow(0 0 ${size * 1.5}px ${color})`,
    }}
  >
    {/* Vertical bar */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: Math.max(1, size * 0.18),
        height: size,
        background: color,
        transform: 'translateX(-50%)',
        borderRadius: 1,
      }}
    />
    {/* Horizontal bar */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: '32%',
        width: size,
        height: Math.max(1, size * 0.18),
        background: color,
        borderRadius: 1,
      }}
    />
  </div>
);

const PARTICLE_COLORS = [
  `${COLORS.gold}`,
  `${COLORS.goldLight}`,
  `${COLORS.white}`,
  `${COLORS.gloryYellow}`,
];

// Floating cross particles — persistent spiritual atmosphere across all scenes
export const CrossParticles: React.FC<{count?: number; baseOpacity?: number}> = ({
  count = 45,
  baseOpacity = 0.18,
}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();

  // Deterministic particle generation (no randomness per frame)
  const particles: Particle[] = useMemo(
    () =>
      Array.from({length: count}, (_, i) => ({
        id: i,
        baseX: ((i * 137.508) % 100), // golden ratio distribution
        speed: 0.08 + (i % 8) * 0.015,
        driftFreq: 0.003 + (i % 5) * 0.001,
        driftAmp: 2 + (i % 4) * 1.5,
        size: 4 + (i % 6) * 3,
        opacity: baseOpacity * (0.4 + (i % 5) * 0.12),
        phaseOffset: (i * 97) % 600,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      })),
    [count, baseOpacity]
  );

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {particles.map((p) => {
        // Y position: rises from bottom, resets when off top (looping)
        const totalCycleFrames = (height * 1.2) / p.speed;
        const offsetFrame = (frame + p.phaseOffset) % totalCycleFrames;
        const yPercent = 110 - (offsetFrame / totalCycleFrames) * 120;

        // Horizontal sway
        const xOffset = Math.sin((frame + p.phaseOffset) * p.driftFreq * 2 * Math.PI) * p.driftAmp;
        const x = p.baseX + xOffset;

        // Twinkle
        const twinkle = 0.6 + Math.sin((frame + p.phaseOffset * 0.7) * 0.05) * 0.4;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${yPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CrossShape size={p.size} color={p.color} opacity={p.opacity * twinkle} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
