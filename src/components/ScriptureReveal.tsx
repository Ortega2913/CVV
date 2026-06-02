import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {COLORS, FONTS} from '../constants';

interface ScriptureRevealProps {
  verse: string;
  reference: string;
  delay?: number; // frames before reveal begins
  duration?: number; // how long verse stays visible
  position?: 'center' | 'lower-third' | 'upper-third';
}

// Elegant gold scripture text with cinematic mask-reveal animation
export const ScriptureReveal: React.FC<ScriptureRevealProps> = ({
  verse,
  reference,
  delay = 0,
  duration = 150,
  position = 'center',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);
  const exitFrame = Math.max(0, localFrame - (duration - 30));

  // Entrance
  const opacity = spring({
    fps,
    frame: localFrame,
    config: {damping: 200, stiffness: 80},
    from: 0,
    to: 1,
  });

  // Exit fade
  const exitOpacity = interpolate(exitFrame, [0, 30], [1, 0], {
    extrapolateRight: 'clamp',
  });

  const finalOpacity = localFrame < duration - 30 ? opacity : opacity * exitOpacity;

  // Verse reveal: left-to-right clip-path wipe
  const clipPercent = interpolate(localFrame, [0, 40], [0, 100], {
    extrapolateRight: 'clamp',
  });

  // Decorative line scale
  const lineScale = interpolate(localFrame, [5, 35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Scale slight zoom-in
  const scale = interpolate(localFrame, [0, 60], [0.96, 1], {
    extrapolateRight: 'clamp',
  });

  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    'lower-third': {
      position: 'absolute',
      bottom: '10%',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
    },
    'upper-third': {
      position: 'absolute',
      top: '10%',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
    },
  };

  return (
    <div style={{...positionStyles[position], pointerEvents: 'none'}}>
      <div
        style={{
          opacity: finalOpacity,
          transform: `scale(${scale})`,
          maxWidth: '75%',
          textAlign: 'center',
          padding: '40px 60px',
          background: 'linear-gradient(135deg, rgba(10,8,20,0.92) 0%, rgba(26,10,46,0.88) 100%)',
          borderRadius: 4,
          border: `1px solid ${COLORS.gold}33`,
          boxShadow: `0 0 60px rgba(245,158,11,0.15), 0 0 120px rgba(245,158,11,0.08), inset 0 0 30px rgba(245,158,11,0.05)`,
        }}
      >
        {/* Top decorative line */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            transform: `scaleX(${lineScale})`,
            marginBottom: 24,
          }}
        />

        {/* Quote marks */}
        <div
          style={{
            fontFamily: FONTS.scripture,
            fontSize: 80,
            color: COLORS.gold,
            lineHeight: 0.3,
            marginBottom: 8,
            opacity: 0.6,
          }}
        >
          "
        </div>

        {/* Scripture verse text with clip-path wipe reveal */}
        <div style={{overflow: 'hidden'}}>
          <div
            style={{
              fontFamily: FONTS.scripture,
              fontSize: 36,
              fontStyle: 'italic',
              fontWeight: 400,
              color: COLORS.offWhite,
              lineHeight: 1.55,
              letterSpacing: '0.01em',
              clipPath: `inset(0 ${100 - clipPercent}% 0 0)`,
            }}
          >
            {verse}
          </div>
        </div>

        {/* Reference */}
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.gold,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: 20,
            opacity: interpolate(localFrame, [30, 50], [0, 1], {extrapolateRight: 'clamp'}),
          }}
        >
          — {reference}
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            transform: `scaleX(${lineScale})`,
            marginTop: 24,
          }}
        />
      </div>
    </div>
  );
};
