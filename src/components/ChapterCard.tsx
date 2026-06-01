import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface ChapterCardProps {
  number: string;
  title: string;
  subtitle: string;
  delay?: number;
  holdDuration?: number;
  accentColor?: string;
}

const ChapterCard: React.FC<ChapterCardProps> = ({
  number,
  title,
  subtitle,
  delay = 0,
  holdDuration = 80,
  accentColor = '#D4AF37',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;

  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 140, stiffness: 70, mass: 1},
  });

  const fadeOut = interpolate(
    localFrame,
    [holdDuration, holdDuration + 25],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const opacity = Math.min(progress, fadeOut);
  const scaleX = interpolate(progress, [0, 1], [0, 1]);

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: '50%',
        transform: `translateY(-50%)`,
        opacity,
        zIndex: 70,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: 4,
          background: accentColor,
          height: 120,
          position: 'absolute',
          left: 0,
          top: 0,
          boxShadow: `0 0 20px ${accentColor}88`,
          transform: `scaleY(${progress})`,
          transformOrigin: 'top',
        }}
      />

      <div style={{paddingLeft: 24}}>
        {/* Chapter number */}
        <div
          style={{
            fontFamily: '"Arial", sans-serif',
            fontSize: 13,
            letterSpacing: '0.35em',
            color: accentColor,
            textTransform: 'uppercase',
            marginBottom: 10,
            opacity: interpolate(progress, [0, 0.5, 1], [0, 0, 1]),
          }}
        >
          Point {number}
        </div>

        {/* Chapter title */}
        <div
          style={{
            fontFamily: '"Georgia", serif',
            fontSize: 56,
            fontWeight: 700,
            color: '#F0E8D8',
            lineHeight: 1.15,
            textShadow: `0 0 40px ${accentColor}44, 0 2px 8px rgba(0,0,0,0.8)`,
            transform: `translateX(${interpolate(progress, [0, 1], [-30, 0])}px)`,
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </div>

        {/* Divider */}
        <div
          style={{
            width: `${interpolate(progress, [0, 1], [0, 200])}px`,
            height: 1,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            margin: '14px 0',
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontFamily: '"Arial", sans-serif',
            fontSize: 22,
            color: 'rgba(240,232,216,0.7)',
            letterSpacing: '0.08em',
            opacity: interpolate(progress, [0, 0.6, 1], [0, 0, 1]),
            transform: `translateX(${interpolate(progress, [0, 1], [-20, 0])}px)`,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
