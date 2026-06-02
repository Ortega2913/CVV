import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {COLORS, FONTS} from '../constants';

type AnimationStyle =
  | 'scale-reveal'
  | 'tracking-reveal'
  | 'glitch'
  | 'word-cascade'
  | 'slam-in'
  | 'glow-pulse'
  | 'fade-up';

interface DramaticTextProps {
  text: string;
  style?: AnimationStyle;
  delay?: number; // frames
  fontSize?: number;
  color?: string;
  glowColor?: string;
  fontFamily?: string;
  textAlign?: React.CSSProperties['textAlign'];
  maxWidth?: string;
  lineHeight?: number;
  highlightWords?: string[]; // words to color in gold
}

// Individual word with staggered animation for word-cascade style
const Word: React.FC<{
  word: string;
  index: number;
  frame: number;
  fps: number;
  delay: number;
  color: string;
  glowColor: string;
  isHighlighted: boolean;
}> = ({word, index, frame, fps, delay, color, glowColor, isHighlighted}) => {
  const wordDelay = delay + index * 3; // 3 frames stagger per word
  const localFrame = Math.max(0, frame - wordDelay);

  const opacity = spring({
    fps,
    frame: localFrame,
    config: {damping: 200, stiffness: 300, mass: 0.5},
    from: 0,
    to: 1,
  });

  const translateY = spring({
    fps,
    frame: localFrame,
    config: {damping: 50, stiffness: 200, mass: 0.8},
    from: 30,
    to: 0,
  });

  return (
    <span
      style={{
        display: 'inline-block',
        opacity,
        transform: `translateY(${translateY}px)`,
        color: isHighlighted ? COLORS.goldBright : color,
        textShadow: isHighlighted
          ? `0 0 30px ${COLORS.gold}, 0 0 60px ${COLORS.gold}55`
          : undefined,
        marginRight: '0.25em',
      }}
    >
      {word}
    </span>
  );
};

export const DramaticText: React.FC<DramaticTextProps> = ({
  text,
  style = 'scale-reveal',
  delay = 0,
  fontSize = 80,
  color = '#ffffff',
  glowColor = COLORS.gold,
  fontFamily = FONTS.hook,
  textAlign = 'center',
  maxWidth = '90%',
  lineHeight = 1.1,
  highlightWords = [],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  if (style === 'word-cascade') {
    const words = text.split(' ');
    return (
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 900,
          textAlign,
          maxWidth,
          lineHeight,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        {words.map((word, i) => (
          <Word
            key={i}
            word={word}
            index={i}
            frame={frame}
            fps={fps}
            delay={delay}
            color={color}
            glowColor={glowColor}
            isHighlighted={highlightWords.includes(word.toLowerCase())}
          />
        ))}
      </div>
    );
  }

  if (style === 'scale-reveal') {
    const scale = spring({
      fps,
      frame: localFrame,
      config: {damping: 200, stiffness: 80, mass: 0.5},
      from: 2.5,
      to: 1,
    });
    const opacity = interpolate(localFrame, [0, 8], [0, 1], {
      extrapolateRight: 'clamp',
    });
    return (
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 900,
          color,
          textAlign,
          maxWidth,
          lineHeight,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          opacity,
          transform: `scale(${scale})`,
          textShadow: `0 0 40px ${glowColor}88, 0 4px 20px rgba(0,0,0,0.8)`,
        }}
      >
        {text}
      </div>
    );
  }

  if (style === 'tracking-reveal') {
    // interpolate returns a number; convert to CSS em string
    const trackingValue = interpolate(localFrame, [0, 40], [-0.15, 0.08], {
      extrapolateRight: 'clamp',
    });
    const opacity = interpolate(localFrame, [0, 20], [0, 1], {
      extrapolateRight: 'clamp',
    });
    return (
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 900,
          color,
          textAlign,
          maxWidth,
          lineHeight,
          letterSpacing: `${trackingValue}em`,
          textTransform: 'uppercase',
          opacity,
          textShadow: `0 0 60px ${glowColor}66`,
        }}
      >
        {text}
      </div>
    );
  }

  if (style === 'glitch') {
    const glitchIntensity = Math.random() > 0.85 ? 1 : 0; // 15% chance each frame
    const offsetX = glitchIntensity * (Math.random() * 12 - 6);
    const offsetY = glitchIntensity * (Math.random() * 4 - 2);
    const opacity = interpolate(localFrame, [0, 5], [0, 1], {
      extrapolateRight: 'clamp',
    });

    return (
      <div style={{position: 'relative', display: 'inline-block', opacity}}>
        {/* Cyan channel offset */}
        <div
          style={{
            position: 'absolute',
            fontFamily,
            fontSize,
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight,
            color: '#00ffff',
            opacity: glitchIntensity * 0.7,
            transform: `translate(${-offsetX}px, ${-offsetY}px)`,
            mixBlendMode: 'screen',
          }}
        >
          {text}
        </div>
        {/* Magenta channel offset */}
        <div
          style={{
            position: 'absolute',
            fontFamily,
            fontSize,
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight,
            color: '#ff00ff',
            opacity: glitchIntensity * 0.7,
            transform: `translate(${offsetX * 1.5}px, ${offsetY}px)`,
            mixBlendMode: 'screen',
          }}
        >
          {text}
        </div>
        {/* Main text */}
        <div
          style={{
            fontFamily,
            fontSize,
            fontWeight: 900,
            color,
            textTransform: 'uppercase',
            lineHeight,
            textShadow: `0 0 30px ${glowColor}`,
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  if (style === 'slam-in') {
    const scale = spring({
      fps,
      frame: localFrame,
      config: {damping: 8, stiffness: 300, mass: 1.2},
      from: 4,
      to: 1,
    });
    const opacity = interpolate(localFrame, [0, 3], [0, 1], {
      extrapolateRight: 'clamp',
    });
    return (
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 900,
          color,
          textAlign,
          maxWidth,
          lineHeight,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          opacity,
          transform: `scale(${scale})`,
          textShadow: `0 0 80px ${glowColor}, 0 0 30px ${glowColor}88, 0 8px 30px rgba(0,0,0,0.9)`,
        }}
      >
        {text}
      </div>
    );
  }

  if (style === 'glow-pulse') {
    const pulseGlow = 20 + Math.sin((frame / 30) * Math.PI * 2) * 15;
    const opacity = interpolate(localFrame, [0, 20], [0, 1], {
      extrapolateRight: 'clamp',
    });
    return (
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 900,
          color,
          textAlign,
          maxWidth,
          lineHeight,
          opacity,
          textShadow: `0 0 ${pulseGlow}px ${glowColor}, 0 0 ${pulseGlow * 2}px ${glowColor}44`,
        }}
      >
        {text}
      </div>
    );
  }

  // fade-up (default fallback)
  const opacity = interpolate(localFrame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const translateY = interpolate(localFrame, [0, 20], [40, 0], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: 700,
        color,
        textAlign,
        maxWidth,
        lineHeight,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {text}
    </div>
  );
};
