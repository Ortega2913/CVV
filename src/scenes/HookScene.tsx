import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import GardenNightScene from '../three/GardenNightScene';
import CinematicTitle from '../components/CinematicTitle';
import FilmGrain from '../components/FilmGrain';
import Vignette from '../components/Vignette';

// ── Speaker silhouette overlay (CSS) ─────────────────────────────────────
const SpeakerOverlay: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  // Speaker fades in from darkness
  const opacity = spring({frame, fps, config: {damping: 200, stiffness: 50, mass: 1.5}});

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 35% 80% at 50% 95%,
            rgba(20, 12, 5, 0.3) 0%,
            rgba(5, 3, 20, 0.0) 100%
          )
        `,
        opacity,
      }}
    />
  );
};

// ── Lower-third Jerusalem label ───────────────────────────────────────────
const LocationTag: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 200, stiffness: 120},
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 100,
        left: 80,
        opacity: Math.min(progress, 1),
        transform: `translateX(${interpolate(progress, [0, 1], [-20, 0])}px)`,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 3,
          height: 36,
          background: '#D4AF37',
          boxShadow: '0 0 12px #D4AF37',
        }}
      />
      <div>
        <div
          style={{
            fontFamily: '"Arial", sans-serif',
            fontSize: 12,
            letterSpacing: '0.3em',
            color: '#D4AF37',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          Garden of Gethsemane
        </div>
        <div
          style={{
            fontFamily: '"Georgia", serif',
            fontSize: 20,
            color: '#F0E8D8',
            letterSpacing: '0.06em',
          }}
        >
          Jerusalem · 32 AD
        </div>
      </div>
    </div>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Cinematic fade-in from black
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const sceneOpacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{background: '#05030e', opacity: sceneOpacity}}>
      {/* 3D garden at night */}
      <GardenNightScene cameraMode="orbit" showFigures torchCount={2} />

      {/* Dark overlay to ground the scene */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 3, 20, 0.45)',
        }}
      />

      <SpeakerOverlay frame={frame} />

      {/* Main hook question — reveals at 1.5s */}
      <CinematicTitle
        text="Why did Jesus go to Gethsemane instead of the Temple?"
        subtitle="A garden of surrender"
        delay={45}
        holdDuration={240}
        fontSize={62}
        color="#F0E8D8"
        glowColor="#D4AF37"
        centered
        top="50%"
      />

      <LocationTag delay={30} />

      <Vignette intensity={0.7} />
      <FilmGrain opacity={0.07} />

      {/* Letterbox bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'rgba(0,0,0,0.85)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'rgba(0,0,0,0.85)',
        }}
      />
    </AbsoluteFill>
  );
};

export default HookScene;
