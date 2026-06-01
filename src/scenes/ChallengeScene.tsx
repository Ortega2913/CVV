import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import GardenNightScene from '../three/GardenNightScene';
import CinematicTitle from '../components/CinematicTitle';
import FilmGrain from '../components/FilmGrain';
import Vignette from '../components/Vignette';

// ── Direct-to-camera dark background ─────────────────────────────────────
const SpeakerBackground: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const progress = spring({frame, fps, config: {damping: 200, stiffness: 60}});

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 60% 80% at 50% 60%,
            rgba(20, 10, 40, ${interpolate(progress, [0, 1], [0, 0.7])}) 0%,
            rgba(5, 3, 18, 0.95) 70%
          )
        `,
        zIndex: 5,
      }}
    />
  );
};

// ── Animated challenge question ───────────────────────────────────────────
const ChallengeQuestion: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const questions = [
    'Where do you go when life crushes you?',
    'To performance... or to prayer?',
    'To the crowd... or to the garden?',
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 70,
        width: '80%',
        maxWidth: 1100,
      }}
    >
      {questions.map((q, i) => {
        const qDelay = i * 65;
        const qFrame = localFrame - qDelay;
        const qProgress = spring({
          frame: qFrame,
          fps,
          config: {damping: 180, stiffness: 80},
        });
        const fadeOut = interpolate(
          localFrame,
          [qDelay + 140, qDelay + 165],
          [1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        );

        return (
          <div
            key={i}
            style={{
              fontFamily: i === 0 ? '"Georgia", serif' : '"Arial", sans-serif',
              fontSize: i === 0 ? 58 : 42,
              fontWeight: i === 0 ? 700 : 400,
              color: i === 0 ? '#F0E8D8' : i === 1 ? '#D4AF37' : 'rgba(240,232,216,0.75)',
              lineHeight: 1.4,
              textShadow: `0 0 40px rgba(212,175,55,${0.3 - i * 0.08}), 0 2px 8px rgba(0,0,0,0.9)`,
              opacity: Math.min(qProgress, fadeOut),
              transform: `translateY(${interpolate(qProgress, [0, 1], [18, 0])}px)`,
              marginBottom: 16,
              letterSpacing: i === 0 ? '0.02em' : '0.06em',
              textTransform: i > 0 ? 'uppercase' : 'none',
            }}
          >
            {q}
          </div>
        );
      })}
    </div>
  );
};

// ── Pulsing circle CTA ────────────────────────────────────────────────────
const PulsingCTA: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const progress = spring({frame: localFrame, fps, config: {damping: 200, stiffness: 70}});
  const pulse = 1 + 0.04 * Math.sin(frame * 0.12);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 130,
        left: '50%',
        transform: `translateX(-50%) scale(${pulse})`,
        opacity: Math.min(progress, 1),
        zIndex: 70,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: '"Arial", sans-serif',
          fontSize: 14,
          letterSpacing: '0.35em',
          color: '#D4AF37',
          textTransform: 'uppercase',
          marginBottom: 14,
          textShadow: '0 0 20px rgba(212,175,55,0.5)',
        }}
      >
        Share this if it moved you
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {['♥  Like', '↗  Share', '✦  Save'].map((label, i) => (
          <div
            key={i}
            style={{
              fontFamily: '"Arial", sans-serif',
              fontSize: 18,
              color: 'rgba(240,232,216,0.7)',
              letterSpacing: '0.08em',
              padding: '8px 20px',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: 2,
              opacity: interpolate(progress, [0, 0.4 + i * 0.2, 1], [0, 0, 1]),
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const ChallengeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{background: '#04030e', opacity: sceneOpacity}}>
      {/* Garden blurred in bg */}
      <GardenNightScene cameraMode="static" showFigures={false} torchCount={1} />

      {/* Heavy dark overlay for direct-to-camera feel */}
      <SpeakerBackground frame={frame} />

      <ChallengeQuestion delay={30} />

      <PulsingCTA delay={340} />

      <Vignette intensity={0.9} />
      <FilmGrain opacity={0.06} />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

export default ChallengeScene;
