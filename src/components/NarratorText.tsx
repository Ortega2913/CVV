import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface NarratorTextProps {
  lines: string[];
  delay?: number;
  lineDuration?: number;
  position?: 'bottom' | 'center' | 'top';
  style?: 'subtitle' | 'callout';
}

const NarratorText: React.FC<NarratorTextProps> = ({
  lines,
  delay = 0,
  lineDuration = 70,
  position = 'bottom',
  style = 'subtitle',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;

  if (localFrame < 0) return null;

  const posMap = {
    bottom: {bottom: 60, left: '50%', transform: 'translateX(-50%)'},
    center: {top: '55%', left: '50%', transform: 'translate(-50%, -50%)'},
    top: {top: 60, left: '50%', transform: 'translateX(-50%)'},
  };

  return (
    <div style={{position: 'absolute', zIndex: 55, ...posMap[position], textAlign: 'center', maxWidth: '1200px'}}>
      {lines.map((line, lineIdx) => {
        const lineStart = lineIdx * lineDuration;
        const lineEnd = lineStart + lineDuration;
        const lineFrame = localFrame - lineStart;

        const fadeIn = spring({
          frame: lineFrame,
          fps,
          config: {damping: 200, stiffness: 120},
        });
        const fadeOut = interpolate(
          localFrame,
          [lineEnd - 15, lineEnd],
          [1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        );

        if (localFrame < lineStart || localFrame > lineEnd + 5) return null;

        const opacity = Math.min(fadeIn, fadeOut);

        return (
          <div
            key={lineIdx}
            style={{
              fontFamily: style === 'callout'
                ? '"Georgia", serif'
                : '"Arial", "Helvetica", sans-serif',
              fontSize: style === 'callout' ? 48 : 28,
              fontWeight: style === 'callout' ? 700 : 400,
              color: style === 'callout' ? '#F0E8D8' : 'rgba(240,232,216,0.9)',
              textShadow: style === 'callout'
                ? '0 0 40px rgba(212,175,55,0.5), 0 2px 8px rgba(0,0,0,0.9)'
                : '0 1px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)',
              lineHeight: 1.5,
              letterSpacing: style === 'callout' ? '0.02em' : '0.01em',
              opacity,
              transform: `translateY(${interpolate(fadeIn, [0, 1], [12, 0])}px)`,
              padding: '8px 24px',
              background: style === 'subtitle'
                ? 'rgba(0,0,0,0.45)'
                : 'transparent',
              borderRadius: style === 'subtitle' ? 4 : 0,
              marginBottom: 8,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

export default NarratorText;
