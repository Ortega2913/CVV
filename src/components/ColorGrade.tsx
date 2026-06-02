import React from 'react';
import {AbsoluteFill} from 'remotion';

type GradePreset = 'cinematic-dark' | 'golden-hour' | 'divine-light' | 'cold-night' | 'neutral';

interface ColorGradeProps {
  preset?: GradePreset;
  intensity?: number; // 0-1 blend toward preset
}

const PRESETS: Record<GradePreset, React.CSSProperties> = {
  'cinematic-dark': {
    filter: 'contrast(1.15) saturate(0.85) brightness(0.9)',
  },
  'golden-hour': {
    filter: 'contrast(1.1) saturate(1.3) brightness(1.05) sepia(0.15)',
  },
  'divine-light': {
    filter: 'contrast(1.05) saturate(1.1) brightness(1.2)',
  },
  'cold-night': {
    filter: 'contrast(1.2) saturate(0.7) brightness(0.85) hue-rotate(200deg)',
  },
  'neutral': {
    filter: 'none',
  },
};

// CSS-based color grade layer — apply as overlay on scenes for cinematic look
export const ColorGrade: React.FC<ColorGradeProps> = ({
  preset = 'cinematic-dark',
  intensity = 1,
}) => {
  const styles = PRESETS[preset];

  // Teal/orange split-tone overlay (classic film look)
  const splitToneStyle: React.CSSProperties =
    preset === 'cinematic-dark'
      ? {
          background:
            'linear-gradient(180deg, rgba(0,30,60,0.12) 0%, transparent 40%, transparent 60%, rgba(80,40,0,0.12) 100%)',
        }
      : preset === 'golden-hour'
      ? {
          background:
            'linear-gradient(180deg, rgba(255,220,100,0.06) 0%, transparent 50%, rgba(180,80,0,0.08) 100%)',
        }
      : {background: 'none'};

  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: intensity, ...styles}}>
      <div style={{position: 'absolute', inset: 0, ...splitToneStyle}} />
    </AbsoluteFill>
  );
};
