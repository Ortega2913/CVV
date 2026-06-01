import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import GardenNightScene from '../three/GardenNightScene';
import LightLeak from '../components/LightLeak';
import FilmGrain from '../components/FilmGrain';
import Vignette from '../components/Vignette';
import NarratorText from '../components/NarratorText';

const ReenactmentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Film burn entry (first 30 frames)
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
    <AbsoluteFill style={{background: '#03020c', opacity: sceneOpacity}}>
      {/* Light leak burn transition */}
      {frame < 32 && <LightLeak duration={32} color="#E8721C" />}

      {/* 3D tracking shot — more torches, disciples following */}
      <GardenNightScene cameraMode="track" showFigures torchCount={3} />

      {/* Darken for mood */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(3, 2, 12, 0.35)',
        }}
      />

      {/* Narrator lines */}
      <NarratorText
        lines={[
          'On the night He was betrayed...',
          'Jesus crossed the Kidron Valley',
          'to a garden called Gethsemane.',
          'Eleven of His disciples followed.',
        ]}
        delay={20}
        lineDuration={50}
        position="bottom"
        style="subtitle"
      />

      <Vignette intensity={0.75} />
      <FilmGrain opacity={0.08} />

      {/* Letterbox */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

export default ReenactmentScene;
