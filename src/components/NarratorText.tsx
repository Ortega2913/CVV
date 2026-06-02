import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {COLORS, FONTS} from '../constants';

interface NarratorLine {
  text: string;
  startFrame: number;
  durationFrames?: number;
  highlight?: string[]; // words to emphasize in gold
}

interface NarratorTextProps {
  lines: NarratorLine[];
  fontSize?: number;
  position?: 'lower-third' | 'center';
}

const HighlightedLine: React.FC<{
  text: string;
  highlight: string[];
  fontSize: number;
  opacity: number;
  translateY: number;
}> = ({text, highlight, fontSize, opacity, translateY}) => {
  const words = text.split(' ');
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: FONTS.body,
        fontSize,
        fontWeight: 500,
        lineHeight: 1.4,
        textAlign: 'center',
        letterSpacing: '0.01em',
      }}
    >
      {words.map((word, i) => {
        const clean = word.toLowerCase().replace(/[^a-z]/g, '');
        const isHighlighted = highlight.some((h) => clean.includes(h.toLowerCase()));
        return (
          <span
            key={i}
            style={{
              color: isHighlighted ? COLORS.goldBright : COLORS.white,
              textShadow: isHighlighted
                ? `0 0 20px ${COLORS.gold}, 0 0 40px ${COLORS.gold}66`
                : '0 2px 8px rgba(0,0,0,0.9)',
              fontWeight: isHighlighted ? 700 : 500,
              marginRight: i < words.length - 1 ? '0.3em' : 0,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Cinematic lower-third narrator text — appears line by line with elegant animations
export const NarratorText: React.FC<NarratorTextProps> = ({
  lines,
  fontSize = 38,
  position = 'lower-third',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Find the currently active line
  const activeLine = lines.reduce<NarratorLine | null>((active, line) => {
    const end = line.startFrame + (line.durationFrames ?? 80);
    if (frame >= line.startFrame && frame < end) return line;
    return active;
  }, null);

  if (!activeLine) return null;

  const localFrame = frame - activeLine.startFrame;
  const duration = activeLine.durationFrames ?? 80;

  const opacity = spring({
    fps,
    frame: localFrame,
    config: {damping: 200, stiffness: 200},
    from: 0,
    to: 1,
  });

  const exitOpacity = interpolate(
    localFrame,
    [duration - 12, duration],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const translateY = spring({
    fps,
    frame: localFrame,
    config: {damping: 100, stiffness: 200, mass: 0.8},
    from: 20,
    to: 0,
  });

  const finalOpacity = localFrame < duration - 12 ? opacity : exitOpacity;

  const containerStyle: React.CSSProperties =
    position === 'lower-third'
      ? {
          position: 'absolute',
          bottom: '8%',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 10%',
        }
      : {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 15%',
        };

  return (
    <div style={{...containerStyle, pointerEvents: 'none'}}>
      {/* Subtle backdrop pill */}
      <div
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.65) 20%, rgba(0,0,0,0.65) 80%, transparent)',
          borderRadius: 4,
          padding: '12px 40px',
          opacity: finalOpacity,
        }}
      >
        {/* Active line */}
        <HighlightedLine
          text={activeLine.text}
          highlight={activeLine.highlight ?? []}
          fontSize={fontSize}
          opacity={finalOpacity}
          translateY={translateY}
        />

        {/* Cursor/indicator dot */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 8,
            gap: 5,
          }}
        >
          {lines.map((line, i) => {
            const isActive = line === activeLine;
            return (
              <div
                key={i}
                style={{
                  width: isActive ? 20 : 5,
                  height: 3,
                  borderRadius: 2,
                  background: isActive ? COLORS.gold : 'rgba(255,255,255,0.25)',
                  transition: 'width 0.3s',
                  opacity: finalOpacity,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
