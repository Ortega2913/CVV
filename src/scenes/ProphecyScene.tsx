import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import GardenNightScene from '../three/GardenNightScene';
import ChapterCard from '../components/ChapterCard';
import VerseText from '../components/VerseText';
import CinematicTitle from '../components/CinematicTitle';
import FilmGrain from '../components/FilmGrain';
import Vignette from '../components/Vignette';
import NarratorText from '../components/NarratorText';
import LightLeak from '../components/LightLeak';

// ── Approaching torchlight in distance ───────────────────────────────────
const DistantTorches: React.FC<{frame: number}> = ({frame}) => {
  const localFrame = frame - 350;
  if (localFrame < 0) return null;

  const {fps} = useVideoConfig();
  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 300, stiffness: 20, mass: 2},
  });

  // Flicker for the approaching torches
  const flicker = 0.7 + 0.3 * Math.sin(frame * 0.4);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '35%',
        left: '50%',
        transform: `translateX(-50%) scale(${interpolate(progress, [0, 1], [0.3, 1])})`,
        opacity: interpolate(progress, [0, 0.2, 1], [0, 1, 1]) * flicker,
        zIndex: 15,
        display: 'flex',
        gap: 16,
        filter: 'blur(3px)',
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 6 + i % 3 * 2,
            height: 6 + i % 3 * 2,
            borderRadius: '50%',
            background: '#FF8C32',
            boxShadow: `0 0 ${12 + i * 2}px #FF8C32, 0 0 ${25 + i * 3}px #FF6020`,
            opacity: 0.7 + 0.3 * Math.sin(frame * 0.38 + i * 0.8),
          }}
        />
      ))}
    </div>
  );
};

// ── Prophecy scripture scroll ─────────────────────────────────────────────
const ProphecyScroll: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 180, stiffness: 70},
  });
  const fadeOut = interpolate(localFrame, [100, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(progress, fadeOut);

  const prophecies = [
    {ref: 'Psalm 22:1', text: '"My God, my God, why have you forsaken me?"'},
    {ref: 'Isaiah 53:3', text: '"He was despised and rejected..."'},
    {ref: 'Zechariah 11:12–13', text: '"Thirty pieces of silver..."'},
  ];

  return (
    <div
      style={{
        position: 'absolute',
        right: 80,
        top: '50%',
        transform: `translateY(-50%) translateX(${interpolate(progress, [0, 1], [40, 0])}px)`,
        opacity,
        zIndex: 65,
        maxWidth: 480,
      }}
    >
      {prophecies.map((p, i) => {
        const itemProgress = spring({
          frame: localFrame - i * 18,
          fps,
          config: {damping: 200, stiffness: 100},
        });
        return (
          <div
            key={i}
            style={{
              opacity: Math.min(itemProgress, 1),
              transform: `translateX(${interpolate(itemProgress, [0, 1], [20, 0])}px)`,
              marginBottom: 24,
              paddingLeft: 16,
              borderLeft: '2px solid rgba(212,175,55,0.4)',
            }}
          >
            <div
              style={{
                fontFamily: '"Arial", sans-serif',
                fontSize: 12,
                letterSpacing: '0.25em',
                color: '#D4AF37',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              {p.ref}
            </div>
            <div
              style={{
                fontFamily: '"Georgia", serif',
                fontSize: 18,
                fontStyle: 'italic',
                color: 'rgba(240,232,216,0.85)',
                lineHeight: 1.5,
              }}
            >
              {p.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProphecyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fadeIn = interpolate(frame, [28, 50], [0, 1], {
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
    <AbsoluteFill style={{background: '#04030c', opacity: sceneOpacity}}>
      {frame < 32 && <LightLeak duration={32} color="#D4AF37" />}

      <GardenNightScene cameraMode="orbit" showFigures torchCount={2} />

      <div style={{position: 'absolute', inset: 0, background: 'rgba(4, 3, 12, 0.4)'}} />

      <ChapterCard
        number="3"
        title="Fulfilled Prophecy"
        subtitle="Everything was written. Everything was chosen."
        delay={8}
        holdDuration={90}
        accentColor="#A0784C"
      />

      {/* Narrator */}
      <NarratorText
        lines={[
          'He did not stumble into this garden.',
          'Every step was written before time began.',
          'The Psalms foretold His abandonment.',
          'Isaiah foretold His suffering.',
          'And Zechariah foretold His betrayal.',
          'This was not tragedy.',
          'This was purpose.',
        ]}
        delay={110}
        lineDuration={65}
        position="bottom"
        style="callout"
      />

      <ProphecyScroll delay={580} />

      {/* Approaching soldiers moment */}
      <DistantTorches frame={frame} />

      {frame > 340 && (
        <CinematicTitle
          text="They came with torches and weapons."
          subtitle="John 18:3"
          delay={350}
          holdDuration={80}
          fontSize={52}
          centered
          bottom={180}
          glowColor="#C8720C"
        />
      )}

      <VerseText
        verse='"Rise! Let us go! Here comes my betrayer!"'
        reference="Matthew 26:46"
        delay={860}
        holdDuration={140}
      />

      <Vignette intensity={0.78} />
      <FilmGrain opacity={0.07} />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

export default ProphecyScene;
