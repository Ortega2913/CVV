import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import CrossSunriseScene from '../three/CrossSunriseScene';
import TombScene from '../three/TombScene';
import VerseText from '../components/VerseText';
import CinematicTitle from '../components/CinematicTitle';
import FilmGrain from '../components/FilmGrain';
import Vignette from '../components/Vignette';
import LightLeak from '../components/LightLeak';

// ── Cross segment (first 450 frames) ─────────────────────────────────────
const CrossSegment: React.FC<{frame: number; totalFrames: number}> = ({frame, totalFrames}) => {
  const {fps} = useVideoConfig();

  const opacity = Math.min(
    interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [420, 450], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <CrossSunriseScene />

      {/* Lens flare from rising sun */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 20% 25% at 50% 45%,
            rgba(255, 200, 80, ${0.12 + 0.04 * Math.sin(frame * 0.08)}) 0%,
            transparent 70%
          )`,
          pointerEvents: 'none',
          zIndex: 20,
          mixBlendMode: 'screen',
        }}
      />

      {/* Opening text */}
      <CinematicTitle
        text="Not my will, but Yours be done."
        subtitle="The most courageous prayer ever prayed"
        delay={60}
        holdDuration={140}
        fontSize={58}
        centered
        top="38%"
        glowColor="#D4AF37"
      />

      <CinematicTitle
        text="He surrendered everything."
        delay={220}
        holdDuration={100}
        fontSize={50}
        centered
        top="42%"
        glowColor="#C87030"
      />
    </div>
  );
};

// ── Tomb segment (last 450 frames) ───────────────────────────────────────
const TombSegment: React.FC<{frame: number; segmentStart: number}> = ({frame, segmentStart}) => {
  const localFrame = frame - segmentStart;
  if (localFrame < -5) return null;

  const opacity = Math.min(
    interpolate(localFrame, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(localFrame, [410, 450], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <TombScene />

      {/* White bloom from tomb light */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 25% 30% at 50% 45%,
            rgba(255, 255, 230, ${0.08 + 0.03 * Math.sin(localFrame * 0.06)}) 0%,
            transparent 65%
          )`,
          zIndex: 20,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

// ── Final verse with maximum reverence ───────────────────────────────────
const FinalVerse: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const progress = spring({
    frame: localFrame,
    fps,
    config: {damping: 300, stiffness: 30, mass: 2.5},
  });

  const words = '"Not my will, but Yours be done."'.split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        textAlign: 'center',
        opacity: interpolate(progress, [0, 1], [0, 1]),
        zIndex: 80,
        maxWidth: 900,
        padding: '0 60px',
      }}
    >
      {/* Large quote */}
      <div
        style={{
          fontFamily: '"Georgia", serif',
          fontSize: 62,
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#F0E8D8',
          lineHeight: 1.3,
          textShadow: '0 0 80px rgba(212,175,55,0.45), 0 3px 12px rgba(0,0,0,0.95)',
          letterSpacing: '0.015em',
          marginBottom: 28,
        }}
      >
        {words.map((word, i) => {
          const wordProgress = spring({
            frame: localFrame - i * 5,
            fps,
            config: {damping: 250, stiffness: 100},
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: '0.28em',
                opacity: Math.min(wordProgress, 1),
                transform: `translateY(${interpolate(wordProgress, [0, 1], [16, 0])}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Reference */}
      <div
        style={{
          fontFamily: '"Arial", sans-serif',
          fontSize: 18,
          letterSpacing: '0.3em',
          color: '#D4AF37',
          textTransform: 'uppercase',
          opacity: interpolate(progress, [0, 0.5, 1], [0, 0, 1]),
          textShadow: '0 0 20px rgba(212,175,55,0.4)',
        }}
      >
        — Luke 22:42
      </div>

      {/* Horizontal rule */}
      <div
        style={{
          width: `${interpolate(progress, [0, 1], [0, 200])}px`,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          margin: '24px auto 0',
          opacity: 0.6,
        }}
      />
    </div>
  );
};

const FinalShotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const CROSS_DURATION = Math.floor(durationInFrames * 0.5);
  const TOMB_START = Math.floor(durationInFrames * 0.48);

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{background: '#04030a', opacity: sceneOpacity}}>
      {/* Cross sunrise (first half) */}
      <CrossSegment frame={frame} totalFrames={durationInFrames} />

      {/* Tomb (second half — cross-dissolve) */}
      {frame >= TOMB_START - 10 && (
        <TombSegment frame={frame} segmentStart={TOMB_START} />
      )}

      {/* Light leak transition between cross & tomb */}
      {frame >= TOMB_START - 5 && frame <= TOMB_START + 30 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 200}}>
          <LightLeak duration={35} color="#FFF0A0" />
        </div>
      )}

      {/* Dark overlay */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(4, 3, 10, 0.25)', zIndex: 5}} />

      {/* Final verse reveals in tomb section */}
      <FinalVerse delay={TOMB_START + 80} />

      {/* Closing studio tag */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 90,
          opacity: interpolate(frame, [durationInFrames - 150, durationInFrames - 60], [0, 0.7], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            fontFamily: '"Arial", sans-serif',
            fontSize: 12,
            letterSpacing: '0.45em',
            color: 'rgba(240,232,216,0.6)',
            textTransform: 'uppercase',
          }}
        >
          Follow for more
        </div>
      </div>

      <Vignette intensity={0.6} />
      <FilmGrain opacity={0.06} />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

export default FinalShotScene;
