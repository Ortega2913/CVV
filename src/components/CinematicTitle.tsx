import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface CinematicTitleProps {
  text: string;
  subtitle?: string;
  delay?: number;
  holdDuration?: number;
  fontSize?: number;
  color?: string;
  glowColor?: string;
  centered?: boolean;
  bottom?: number | string;
  top?: number | string;
}

const CinematicTitle: React.FC<CinematicTitleProps> = ({
  text,
  subtitle,
  delay = 0,
  holdDuration = 90,
  fontSize = 72,
  color = '#F0E8D8',
  glowColor = '#D4AF37',
  centered = true,
  bottom,
  top,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const localFrame = frame - delay;

  const fadeInProgress = spring({
    frame: localFrame,
    fps,
    config: {damping: 160, stiffness: 80, mass: 0.8},
  });

  const fadeOutStart = holdDuration;
  const fadeOutOpacity = interpolate(
    localFrame,
    [fadeOutStart, fadeOutStart + 30],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const opacity = Math.min(fadeInProgress, fadeOutOpacity);
  const translateY = interpolate(fadeInProgress, [0, 1], [28, 0]);
  const scale = interpolate(fadeInProgress, [0, 1], [0.92, 1]);

  if (localFrame < 0) return null;

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: centered ? '50%' : undefined,
    transform: centered
      ? `translateX(-50%) translateY(${translateY}px) scale(${scale})`
      : `translateY(${translateY}px) scale(${scale})`,
    textAlign: centered ? 'center' : 'left',
    ...(bottom !== undefined ? {bottom} : {}),
    ...(top !== undefined ? {top} : {}),
    ...(bottom === undefined && top === undefined ? {top: '50%', marginTop: '-60px'} : {}),
  };

  return (
    <div
      style={{
        ...positionStyle,
        opacity,
        zIndex: 50,
        padding: '0 80px',
        maxWidth: '1400px',
        width: centered ? undefined : '100%',
      }}
    >
      {/* Subtle separator line above */}
      <div
        style={{
          width: centered ? '60px' : '80px',
          height: '1px',
          background: glowColor,
          margin: centered ? '0 auto 18px' : '0 0 18px',
          opacity: 0.8,
          boxShadow: `0 0 8px ${glowColor}`,
        }}
      />

      <div
        style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize,
          fontWeight: 700,
          color,
          lineHeight: 1.2,
          letterSpacing: '0.02em',
          textShadow: `
            0 0 40px ${glowColor}88,
            0 0 80px ${glowColor}44,
            0 2px 4px rgba(0,0,0,0.8)
          `,
          wordBreak: 'break-word',
        }}
      >
        {text}
      </div>

      {subtitle && (
        <div
          style={{
            fontFamily: '"Arial", "Helvetica", sans-serif',
            fontSize: fontSize * 0.38,
            color: glowColor,
            marginTop: 14,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textShadow: `0 0 20px ${glowColor}66`,
            opacity: 0.9,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Subtle separator line below */}
      <div
        style={{
          width: centered ? '60px' : '80px',
          height: '1px',
          background: glowColor,
          margin: centered ? '18px auto 0' : '18px 0 0',
          opacity: 0.8,
          boxShadow: `0 0 8px ${glowColor}`,
        }}
      />
    </div>
  );
};

export default CinematicTitle;
