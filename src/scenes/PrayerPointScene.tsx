import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import PrayerScene from '../three/PrayerScene';
import CinematicTitle from '../components/CinematicTitle';
import VerseText from '../components/VerseText';
import ChapterCard from '../components/ChapterCard';
import FilmGrain from '../components/FilmGrain';
import Vignette from '../components/Vignette';
import NarratorText from '../components/NarratorText';

// ── Glowing particle halo for prayer intensity ────────────────────────────
const PrayerGlow: React.FC<{frame: number}> = ({frame}) => {
  const pulse = 0.4 + 0.08 * Math.sin(frame * 0.07);
  const pulse2 = 0.2 + 0.05 * Math.sin(frame * 0.11 + 1);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '28%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 300,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at 50% 100%,
          rgba(212, 175, 55, ${pulse}) 0%,
          rgba(180, 120, 20, ${pulse2}) 40%,
          transparent 75%
        )`,
        pointerEvents: 'none',
        zIndex: 10,
        filter: 'blur(20px)',
      }}
    />
  );
};

const PrayerPointScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{background: '#04030e', opacity: sceneOpacity}}>
      {/* 3D prayer scene with slow push-in */}
      <PrayerScene />

      {/* Chapter card intro — first 100 frames */}
      {frame < 110 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(4, 3, 14, 0.65)',
          }}
        />
      )}
      <ChapterCard
        number="1"
        title="Prayer, Not Performance"
        subtitle="The secret place over the public stage"
        delay={10}
        holdDuration={95}
        accentColor="#D4AF37"
      />

      {/* Scene visible after card transition */}
      {frame > 80 && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(4, 3, 14, 0.3)',
            }}
          />

          <PrayerGlow frame={frame} />

          {/* Main teaching text */}
          <NarratorText
            lines={[
              'When the world sleeps,',
              'Jesus chose to pray.',
              'Not from a stage. Not for an audience.',
              'But face-down in the dirt...',
              'bearing the weight of every human soul.',
            ]}
            delay={110}
            lineDuration={62}
            position="bottom"
            style="callout"
          />

          {/* Matthew 26:39 verse */}
          <VerseText
            verse='"My Father, if it is possible, may this cup be taken from me. Yet not as I will, but as you will."'
            reference="Matthew 26:39"
            delay={440}
            holdDuration={140}
          />
        </>
      )}

      <Vignette intensity={0.8} />
      <FilmGrain opacity={0.07} />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

export default PrayerPointScene;
