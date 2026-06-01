import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import PrayerScene from '../three/PrayerScene';
import CinematicTitle from '../components/CinematicTitle';
import FilmGrain from '../components/FilmGrain';
import Vignette from '../components/Vignette';
import NarratorText from '../components/NarratorText';

// ── Sleeping disciples in the background ─────────────────────────────────
const SleepingDisciplesOverlay: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const progress = spring({
    frame: frame - 60,
    fps,
    config: {damping: 200, stiffness: 50},
  });

  if (frame < 60) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '25%',
        right: 80,
        opacity: Math.min(progress, 0.75),
        zIndex: 30,
        textAlign: 'right',
      }}
    >
      {/* Three sleeping disciple silhouettes */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            display: 'inline-block',
            width: 40 + i * 8,
            height: 18 + i * 4,
            background: 'rgba(15, 10, 5, 0.7)',
            borderRadius: '50% 50% 0 0',
            marginLeft: 12,
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            transform: `rotate(${-8 + i * 5}deg)`,
          }}
        />
      ))}
      <div
        style={{
          fontFamily: '"Arial", sans-serif',
          fontSize: 12,
          letterSpacing: '0.25em',
          color: 'rgba(240,232,216,0.35)',
          textTransform: 'uppercase',
          marginTop: 10,
          opacity: interpolate(progress, [0, 0.5, 1], [0, 0, 1]),
        }}
      >
        Three times He returned to sleeping disciples
      </div>
    </div>
  );
};

// ── Emotional highlight quote ─────────────────────────────────────────────
const EmotionalQuote: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 140, stiffness: 55, mass: 1.5},
  });
  const fadeOut = interpolate(localFrame, [180, 210], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(progress, fadeOut);

  const words = "Jesus didn't run to safety. He walked into the storm — for you.".split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        textAlign: 'center',
        opacity,
        zIndex: 70,
        maxWidth: 900,
        padding: '0 60px',
      }}
    >
      <div
        style={{
          fontFamily: '"Georgia", serif',
          fontSize: 52,
          fontWeight: 700,
          color: '#F0E8D8',
          lineHeight: 1.35,
          textShadow: '0 0 60px rgba(212,175,55,0.35), 0 3px 12px rgba(0,0,0,0.95)',
          letterSpacing: '0.01em',
        }}
      >
        {words.map((word, i) => {
          const {fps} = useVideoConfig();
          const wordProgress = spring({
            frame: localFrame - i * 4,
            fps,
            config: {damping: 250, stiffness: 150},
          });
          const isHighlight = word === 'you.' || word === 'storm';
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: '0.28em',
                opacity: Math.min(wordProgress, 1),
                transform: `translateY(${interpolate(wordProgress, [0, 1], [14, 0])}px)`,
                color: isHighlight ? '#D4AF37' : '#F0E8D8',
                textShadow: isHighlight ? '0 0 30px rgba(212,175,55,0.6)' : undefined,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const EmotionalCloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{background: '#040210', opacity: sceneOpacity}}>
      {/* Close-up prayer scene */}
      <PrayerScene phase={0.8} />

      <div style={{position: 'absolute', inset: 0, background: 'rgba(4, 2, 16, 0.4)'}} />

      {/* Opening lines */}
      <NarratorText
        lines={[
          'He prayed until His sweat became blood.',
          'He returned to His friends three times...',
          '...and found them sleeping.',
          'Three times He prayed the same prayer.',
          'Three times He surrendered His will.',
        ]}
        delay={30}
        lineDuration={60}
        position="bottom"
        style="callout"
      />

      <SleepingDisciplesOverlay frame={frame} />

      {/* Main emotional quote */}
      <EmotionalQuote delay={340} />

      {/* Final sub-quote */}
      <CinematicTitle
        text="He was willing to be abandoned so you would never be."
        delay={600}
        holdDuration={120}
        fontSize={40}
        centered
        bottom={160}
        glowColor="#8060C0"
      />

      <Vignette intensity={0.85} />
      <FilmGrain opacity={0.07} />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

export default EmotionalCloseScene;
