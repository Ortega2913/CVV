import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import OlivePressScene from '../three/OlivePressScene';
import ChapterCard from '../components/ChapterCard';
import VerseText from '../components/VerseText';
import FilmGrain from '../components/FilmGrain';
import Vignette from '../components/Vignette';
import NarratorText from '../components/NarratorText';
import LightLeak from '../components/LightLeak';

// ── The name etymology card ───────────────────────────────────────────────
const EtymologyCard: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 160, stiffness: 80},
  });
  const fadeOut = interpolate(localFrame, [80, 100], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = Math.min(progress, fadeOut);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
        textAlign: 'center',
        opacity,
        zIndex: 70,
        background: 'rgba(5, 3, 18, 0.85)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        padding: '40px 60px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          fontFamily: '"Georgia", serif',
          fontSize: 72,
          color: '#D4AF37',
          letterSpacing: '0.1em',
          textShadow: '0 0 50px rgba(212,175,55,0.5)',
          marginBottom: 8,
        }}
      >
        Gethsemane
      </div>
      <div
        style={{
          fontFamily: '"Arial", sans-serif',
          fontSize: 14,
          letterSpacing: '0.35em',
          color: 'rgba(240,232,216,0.6)',
          textTransform: 'uppercase',
          marginBottom: 18,
        }}
      >
        Hebrew · גַּת שְׁמָנִים
      </div>
      <div
        style={{
          fontFamily: '"Georgia", serif',
          fontSize: 36,
          fontStyle: 'italic',
          color: '#F0E8D8',
          opacity: 0.9,
        }}
      >
        "Oil Press"
      </div>
    </div>
  );
};

// ── Weight of sin visual metaphor ─────────────────────────────────────────
const WeightMeter: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const progress = spring({
    frame: frame - 200,
    fps,
    config: {damping: 200, stiffness: 30, mass: 2},
  });

  if (frame < 200) return null;

  const fillWidth = interpolate(progress, [0, 1], [0, 100]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 180,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 70,
        opacity: Math.min(progress * 2, interpolate(frame, [500, 540], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })),
      }}
    >
      <div
        style={{
          fontFamily: '"Arial", sans-serif',
          fontSize: 12,
          letterSpacing: '0.3em',
          color: 'rgba(212,175,55,0.7)',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        The weight He carried
      </div>
      <div
        style={{
          width: 400,
          height: 3,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${fillWidth}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #D4AF37, #FF6820)',
            boxShadow: '0 0 12px rgba(212,175,55,0.6)',
            transition: 'none',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: '"Georgia", serif',
          fontSize: 22,
          color: '#F0E8D8',
          marginTop: 14,
          fontStyle: 'italic',
          opacity: interpolate(progress, [0, 0.6, 1], [0, 0, 1]),
        }}
      >
        Every sin. Every soul. Every moment.
      </div>
    </div>
  );
};

const CrushedScene: React.FC = () => {
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
    <AbsoluteFill style={{background: '#040208', opacity: sceneOpacity}}>
      {frame < 32 && <LightLeak duration={32} color="#C8720C" />}

      {/* Olive press 3D scene */}
      <OlivePressScene />

      <div style={{position: 'absolute', inset: 0, background: 'rgba(4, 2, 8, 0.35)'}} />

      {/* Chapter card */}
      <ChapterCard
        number="2"
        title="Crushed Alone"
        subtitle="The oil of Gethsemane's name"
        delay={8}
        holdDuration={90}
        accentColor="#C8720C"
      />

      {/* Etymology reveal */}
      <EtymologyCard delay={110} />

      {/* Narrator teaching */}
      <NarratorText
        lines={[
          '"Gethsemane" means oil press.',
          'To extract olive oil, the olives must be crushed.',
          'Jesus — the Anointed One — was pressed.',
          'Not by wood and stone...',
          'but by the sin of all humanity.',
          'His sweat became like drops of blood.',
        ]}
        delay={220}
        lineDuration={68}
        position="bottom"
        style="callout"
      />

      <WeightMeter frame={frame} />

      <VerseText
        verse='"And being in anguish, He prayed more earnestly, and His sweat was like drops of blood falling to the ground."'
        reference="Luke 22:44"
        delay={680}
        holdDuration={160}
      />

      <Vignette intensity={0.82} />
      <FilmGrain opacity={0.08} />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

export default CrushedScene;
