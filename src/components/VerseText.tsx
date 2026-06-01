import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface VerseTextProps {
  verse: string;
  reference: string;
  delay?: number;
  holdDuration?: number;
}

const VerseText: React.FC<VerseTextProps> = ({
  verse,
  reference,
  delay = 0,
  holdDuration = 120,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;

  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 200, stiffness: 60, mass: 1.2},
  });

  const fadeOut = interpolate(
    localFrame,
    [holdDuration, holdDuration + 25],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const opacity = Math.min(progress, fadeOut);
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  if (localFrame < 0) return null;

  // Split verse into words for staggered reveal
  const words = verse.split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120,
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        textAlign: 'center',
        opacity,
        zIndex: 60,
        maxWidth: '900px',
        width: '100%',
        padding: '32px 48px',
        background: 'rgba(5, 3, 20, 0.6)',
        backdropFilter: 'blur(2px)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 0 40px rgba(212, 175, 55, 0.08), inset 0 0 40px rgba(0,0,0,0.3)',
      }}
    >
      {/* Corner accents */}
      <div style={cornerStyle('top', 'left')} />
      <div style={cornerStyle('top', 'right')} />
      <div style={cornerStyle('bottom', 'left')} />
      <div style={cornerStyle('bottom', 'right')} />

      <div
        style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: 32,
          fontStyle: 'italic',
          color: '#F0E8D8',
          lineHeight: 1.6,
          letterSpacing: '0.01em',
          textShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
          marginBottom: 16,
        }}
      >
        {words.map((word, i) => {
          const wordDelay = i * 3;
          const wordProgress = spring({
            frame: localFrame - wordDelay,
            fps,
            config: {damping: 300, stiffness: 200},
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: Math.min(wordProgress, 1),
                marginRight: '0.3em',
                transform: `translateY(${interpolate(wordProgress, [0, 1], [8, 0])}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div
        style={{
          fontFamily: '"Arial", "Helvetica", sans-serif',
          fontSize: 18,
          color: '#D4AF37',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: interpolate(progress, [0, 0.7, 1], [0, 0, 1]),
        }}
      >
        — {reference}
      </div>
    </div>
  );
};

const cornerStyle = (v: 'top' | 'bottom', h: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  [v]: 8,
  [h]: 8,
  width: 16,
  height: 16,
  borderTop: v === 'top' ? '1px solid #D4AF37' : undefined,
  borderBottom: v === 'bottom' ? '1px solid #D4AF37' : undefined,
  borderLeft: h === 'left' ? '1px solid #D4AF37' : undefined,
  borderRight: h === 'right' ? '1px solid #D4AF37' : undefined,
  opacity: 0.7,
});

export default VerseText;
