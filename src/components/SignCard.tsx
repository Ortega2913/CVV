import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {COLORS, FONTS} from '../constants';

interface SignCardProps {
  number: number;
  title: string;
  subtitle: string;
  accentColor: string;
  glowColor: string;
  delay?: number;
}

// Big animated sign number card with 3D CSS perspective orbit
export const SignCard: React.FC<SignCardProps> = ({
  number,
  title,
  subtitle,
  accentColor,
  glowColor,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  // Number slam-in
  const numberScale = spring({
    fps,
    frame: localFrame,
    config: {damping: 8, stiffness: 200, mass: 1.5},
    from: 0,
    to: 1,
  });

  // Orbit: number appears to rotate into position
  const orbitAngle = interpolate(localFrame, [0, 45], [-35, 0], {extrapolateRight: 'clamp'});
  const orbitDepth = interpolate(localFrame, [0, 45], [-300, 0], {extrapolateRight: 'clamp'});

  // Title entrance
  const titleOpacity = spring({
    fps,
    frame: Math.max(0, localFrame - 20),
    config: {damping: 200, stiffness: 100},
    from: 0,
    to: 1,
  });
  const titleX = spring({
    fps,
    frame: Math.max(0, localFrame - 20),
    config: {damping: 100, stiffness: 200, mass: 0.8},
    from: 80,
    to: 0,
  });

  // Subtitle entrance
  const subtitleOpacity = spring({
    fps,
    frame: Math.max(0, localFrame - 35),
    config: {damping: 200, stiffness: 100},
    from: 0,
    to: 1,
  });

  // Pulsing glow on number
  const glowSize = 60 + Math.sin((frame / 30) * Math.PI) * 20;

  // Breathing scale
  const breathe = 1 + Math.sin((frame / 90) * Math.PI) * 0.012;

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 50, perspective: '1200px'}}>
      {/* Big 3D number */}
      <div
        style={{
          transform: `scale(${numberScale * breathe}) rotateY(${orbitAngle}deg) translateZ(${orbitDepth}px)`,
          transformOrigin: 'center center',
          position: 'relative',
        }}
      >
        {/* Number glow */}
        <div
          style={{
            position: 'absolute',
            inset: -30,
            background: `radial-gradient(circle, ${glowColor}55 0%, transparent 70%)`,
            filter: `blur(${glowSize}px)`,
            pointerEvents: 'none',
          }}
        />

        {/* Decorative ring */}
        <div
          style={{
            position: 'absolute',
            inset: -8,
            border: `3px solid ${accentColor}44`,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${glowColor}33, inset 0 0 20px ${glowColor}11`,
          }}
        />

        {/* The number itself */}
        <div
          style={{
            fontFamily: FONTS.number,
            fontSize: 260,
            fontWeight: 900,
            lineHeight: 1,
            width: 280,
            height: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'transparent',
            backgroundImage: `linear-gradient(160deg, ${COLORS.white} 0%, ${accentColor} 40%, ${glowColor} 60%, ${COLORS.goldLight} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: `drop-shadow(0 0 ${glowSize * 0.5}px ${glowColor}88)`,
          }}
        >
          {number}
        </div>
      </div>

      {/* Title block */}
      <div style={{maxWidth: 600}}>
        {/* Sign label */}
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 16,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 12,
            opacity: titleOpacity,
          }}
        >
          Sign #{number}
        </div>

        {/* Main title */}
        <div
          style={{
            fontFamily: FONTS.hook,
            fontSize: 80,
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1,
            color: COLORS.white,
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
            textShadow: `0 0 60px ${glowColor}44`,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: FONTS.hook,
            fontSize: 60,
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1.1,
            color: accentColor,
            opacity: subtitleOpacity,
            marginTop: 8,
          }}
        >
          {subtitle}
        </div>

        {/* Decorative underline */}
        <div
          style={{
            height: 3,
            width: interpolate(localFrame, [40, 80], [0, 400], {extrapolateRight: 'clamp'}),
            background: `linear-gradient(90deg, ${glowColor}, ${accentColor}, transparent)`,
            borderRadius: 2,
            marginTop: 20,
            boxShadow: `0 0 12px ${glowColor}88`,
          }}
        />
      </div>
    </div>
  );
};
