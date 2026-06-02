import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import {COLORS, FONTS, s} from '../../constants';
import {DramaticText} from '../DramaticText';
import {ScriptureReveal} from '../ScriptureReveal';
import {NarratorText} from '../NarratorText';
import {LightRays} from '../LightRays';
import {GlowEffect} from '../GlowEffect';
import {PlaylistVisual} from '../PlaylistVisual';
import {ThreeDScene} from '../three/ThreeDScene';

/*
  CONCLUSION & CTA — 90 seconds (2700 frames)
  Emotional resolution + call to action.

  Timeline:
  0:00 – 0:20  (f0–600)    Split screen: dark playlist fades into worship playlist
  0:20 – 0:40  (f600–1200) Sunrise visual + open Bible suggestion
  0:40 – 1:05  (f1200–1950) Final narrator monologue
  1:05 – 1:20  (f1950–2400) CTA text reveals with gold treatment
  1:20 – 1:30  (f2400–2700) Channel branding + fade to black

  Midjourney prompts for this section:
  Hero: "Cinematic sunrise over open Bible on grass, golden morning light, dew drops,
          photorealistic, 8k, warm color grading, shallow depth of field"
  Transformation: "Split composition: left dark headphones with screen, right worship music notes
                    in golden sunrise light, symbolic transformation, photorealistic"
*/

// Sunrise visual — radiant light breaking through
const SunriseVisual: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const sunRise = Math.min(1, frame / 300);
  const sunY = 60 - sunRise * 15;

  return (
    <div
      style={{
        position: 'relative', width: '100%', height: '100%',
        background: `linear-gradient(180deg,
          #050a10 0%,
          #0d1a30 ${100 - sunY - 10}%,
          #1a3a20 ${100 - sunY}%,
          #2d5a20 100%)`,
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* Horizon glow */}
      <div style={{
        position: 'absolute',
        bottom: `${100 - sunY - 5}%`,
        left: '10%',
        right: '10%',
        height: 3,
        background: `radial-gradient(ellipse, ${COLORS.dawn} 0%, transparent 70%)`,
        filter: 'blur(3px)',
      }} />

      {/* Sun */}
      <div style={{
        position: 'absolute',
        bottom: `${100 - sunY}%`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.gloryYellow} 0%, ${COLORS.dawn} 40%, transparent 70%)`,
        boxShadow: `0 0 80px ${COLORS.gold}, 0 0 200px ${COLORS.dawn}88`,
        filter: 'blur(2px)',
      }} />

      {/* Light rays from sun */}
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: `${100 - sunY + 5}%`,
          left: '50%',
          width: '90%',
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.goldLight}44, transparent)`,
          transformOrigin: '0 50%',
          transform: `translateX(-50%) rotate(${i * 18}deg)`,
          filter: 'blur(3px)',
          opacity: 0.5 + Math.sin(frame * 0.02 + i) * 0.3,
        }} />
      ))}

      {/* Bible silhouette on ground */}
      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 200,
        height: 14,
        background: `rgba(${sunRise > 0.5 ? '245,158,11,0.6' : '20,20,30,0.8'})`,
        borderRadius: '3px 3px 0 0',
        boxShadow: `0 -5px 20px ${sunRise > 0.5 ? COLORS.gold + '44' : 'transparent'}`,
      }} />

      {/* Stars fading out */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 137.508) % 100}%`,
          top: `${(i * 71) % 50}%`,
          width: 2, height: 2, borderRadius: '50%',
          background: 'white',
          opacity: Math.max(0, (0.4 - sunRise * 0.5) * (0.3 + (i % 4) * 0.1)),
        }} />
      ))}
    </div>
  );
};

// Animated obedience message
const ObedienceMessage: React.FC<{frame: number; delay: number}> = ({frame, delay}) => {
  const localFrame = Math.max(0, frame - delay);
  const {fps} = useVideoConfig();

  const lines = [
    {text: 'Obedience', fontSize: 130, color: COLORS.white, delay: 0},
    {text: 'brings', fontSize: 80, color: COLORS.offWhite, delay: 20},
    {text: 'breakthrough.', fontSize: 100, color: COLORS.goldBright, delay: 35},
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 5, textAlign: 'center',
    }}>
      {lines.map((line, i) => {
        const lf = Math.max(0, localFrame - line.delay);
        const scale = spring({fps, frame: lf, config: {damping: 200, stiffness: 80}, from: 0, to: 1});
        const opacity = interpolate(lf, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
        return (
          <div key={i} style={{
            fontFamily: FONTS.hook,
            fontSize: line.fontSize,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: line.color,
            lineHeight: 1,
            opacity,
            transform: `scale(${scale})`,
            textShadow: line.color === COLORS.goldBright
              ? `0 0 60px ${COLORS.gold}, 0 0 120px ${COLORS.gold}44`
              : '0 4px 30px rgba(0,0,0,0.8)',
          }}>
            {line.text}
          </div>
        );
      })}
    </div>
  );
};

// YouTube-style subscription CTA
const SubscribeCTA: React.FC<{frame: number; delay: number}> = ({frame, delay}) => {
  const localFrame = Math.max(0, frame - delay);
  const {fps} = useVideoConfig();

  const scale = spring({fps, frame: localFrame, config: {damping: 12, stiffness: 200, mass: 1}, from: 0, to: 1});
  const opacity = interpolate(localFrame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
    }}>
      <div style={{
        background: '#ff0000',
        color: '#fff',
        fontFamily: FONTS.body,
        fontSize: 28,
        fontWeight: 900,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '18px 50px',
        borderRadius: 8,
        boxShadow: '0 0 40px rgba(255,0,0,0.5), 0 8px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <span style={{fontSize: 32}}>▶</span>
        Subscribe For More
      </div>
      <div style={{
        fontFamily: FONTS.body,
        fontSize: 20,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.08em',
      }}>
        🔔 Turn on notifications • Comment your testimony below
      </div>
    </div>
  );
};

export const Conclusion: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ─── Phase timings ────────────────────────────────────────────────────────
  const PH = {
    splitScreen:  { in: 0,    out: 600  },  // 0–20s
    sunrise:      { in: 400,  out: 1200 },  // 13–40s
    narrator1:    { in: 600,  out: 1200 },  // 20–40s
    obedience:    { in: 1200, out: 1800 },  // 40–60s
    narrator2:    { in: 1500, out: 1950 },  // 50–65s
    finalScripture:{ in: 1800, out: 2400 }, // 60–80s
    cta:          { in: 2300, out: 2600 },  // 76–86s
    subscribe:    { in: 2450, out: 2650 },  // 81–88s
    fadeOut:      { in: 2550, out: 2700 },  // 85–90s
  };

  // ─── Background gradients ─────────────────────────────────────────────────
  const bgProgress = Math.min(1, frame / 1200);
  // Transitions from deep dark-purple → warm golden sunrise
  const r = Math.round(6 + bgProgress * 20);
  const g = Math.round(8 + bgProgress * 25);
  const b = Math.round(16 + bgProgress * 15);

  // ─── Opacities ────────────────────────────────────────────────────────────
  const splitOpacity = interpolate(
    frame,
    [PH.splitScreen.in, PH.splitScreen.in + 30, PH.splitScreen.out - 60, PH.splitScreen.out],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const sunriseOpacity = interpolate(
    frame,
    [PH.sunrise.in, PH.sunrise.in + 60, PH.obedience.in + 60, PH.obedience.in + 90],
    [0, 0.7, 0.7, 0.2],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const obedienceOpacity = interpolate(
    frame,
    [PH.obedience.in, PH.obedience.in + 20, PH.narrator2.in + 60, PH.narrator2.in + 90],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const raysOpacity = interpolate(
    frame,
    [PH.sunrise.in, PH.sunrise.in + 120, PH.cta.in, PH.cta.in + 60],
    [0, 0.5, 0.5, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const exitFade = interpolate(frame, [PH.fadeOut.in, PH.fadeOut.out], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ─── Narrator data ────────────────────────────────────────────────────────
  const narratorLines = [
    {text: 'You\'ve just heard 5 signs.', startFrame: PH.narrator1.in, durationFrames: 80, highlight: ['5']},
    {text: 'Signs that God is speaking...', startFrame: PH.narrator1.in + 85, durationFrames: 80, highlight: ['God']},
    {text: '...calling you to a higher standard.', startFrame: PH.narrator1.in + 170, durationFrames: 80, highlight: ['higher']},
    {text: 'Not to condemn you.', startFrame: PH.narrator1.in + 255, durationFrames: 80},
    {text: 'But to set you free.', startFrame: PH.narrator2.in, durationFrames: 80, highlight: ['free']},
    {text: 'What is God asking you to delete today?', startFrame: PH.narrator2.in + 90, durationFrames: 120, highlight: ['delete']},
  ];

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>

      {/* ── Animated background ─────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 80% at 50% 20%,
            rgba(${r * 3},${g * 2},${b * 2},1) 0%,
            rgba(${r},${g},${b},1) 40%,
            ${COLORS.darkBg} 100%)`,
        }}
      />

      {/* ── Sunrise visual background ────────────────────────────────────── */}
      {frame >= PH.sunrise.in && (
        <div style={{opacity: sunriseOpacity, position: 'absolute', inset: 0}}>
          <SunriseVisual frame={frame - PH.sunrise.in} opacity={1} />
        </div>
      )}

      {/* ── Light rays ──────────────────────────────────────────────────── */}
      {frame >= PH.sunrise.in && (
        <div style={{opacity: raysOpacity}}>
          <LightRays color={COLORS.gold} intensity={0.6} numRays={14} originX={50} originY={65} />
        </div>
      )}

      {/* ── Divine glow ────────────────────────────────────────────────── */}
      {frame >= PH.sunrise.in && (
        <div style={{opacity: raysOpacity * 0.8}}>
          <GlowEffect color={COLORS.dawn} intensity={0.5} blur={150} x="50%" y="65%" pulsing={false} />
        </div>
      )}

      {/* ── Split screen: before/after playlists ────────────────────────── */}
      <AbsoluteFill
        style={{
          opacity: splitOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {frame < PH.splitScreen.out && (
          <PlaylistVisual type="split" delay={PH.splitScreen.in} activeIndex={0} />
        )}
      </AbsoluteFill>

      {/* ── Transition arrow label ──────────────────────────────────────── */}
      {frame >= PH.splitScreen.in + 30 && frame < PH.splitScreen.out && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 10,
            pointerEvents: 'none',
          }}
        >
          <div style={{
            fontFamily: FONTS.hook,
            fontSize: 60,
            color: COLORS.gold,
            opacity: interpolate(frame, [PH.splitScreen.in + 30, PH.splitScreen.in + 60], [0, 1], {extrapolateRight: 'clamp'}),
            textShadow: `0 0 30px ${COLORS.gold}`,
          }}>→</div>
          <div style={{
            fontFamily: FONTS.body,
            fontSize: 14,
            color: COLORS.gold,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            opacity: interpolate(frame, [PH.splitScreen.in + 40, PH.splitScreen.in + 70], [0, 1], {extrapolateRight: 'clamp'}),
          }}>Transformation</div>
        </AbsoluteFill>
      )}

      {/* ── "Obedience brings breakthrough" ─────────────────────────────── */}
      <AbsoluteFill
        style={{
          opacity: obedienceOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {frame >= PH.obedience.in && (
          <ObedienceMessage frame={frame} delay={PH.obedience.in} />
        )}
      </AbsoluteFill>

      {/* ── Narrator ──────────────────────────────────────────────────── */}
      <NarratorText lines={narratorLines} fontSize={40} position="lower-third" />

      {/* ── Final scripture ────────────────────────────────────────────── */}
      {frame >= PH.finalScripture.in && (
        <ScriptureReveal
          verse="Delight yourself in the LORD, and he will give you the desires of your heart."
          reference="Psalm 37:4"
          delay={PH.finalScripture.in}
          duration={PH.finalScripture.out - PH.finalScripture.in}
          position="center"
        />
      )}

      {/* ── CTA Question ──────────────────────────────────────────────── */}
      {frame >= PH.cta.in && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(frame, [PH.cta.in, PH.cta.in + 30, PH.subscribe.in - 15, PH.subscribe.in], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            gap: 20,
          }}
        >
          <div style={{
            fontFamily: FONTS.scripture,
            fontSize: 56,
            fontStyle: 'italic',
            fontWeight: 400,
            color: COLORS.offWhite,
            textAlign: 'center',
            maxWidth: '80%',
            lineHeight: 1.4,
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}>
            "What is{' '}
            <span style={{color: COLORS.goldBright, fontStyle: 'normal', fontWeight: 700,
              textShadow: `0 0 30px ${COLORS.gold}`, fontFamily: FONTS.hook,}}>
              God
            </span>{' '}
            asking you to{' '}
            <span style={{color: COLORS.goldBright, fontWeight: 700,
              textShadow: `0 0 30px ${COLORS.gold}`}}>
              delete
            </span>{' '}
            today?"
          </div>

          <div style={{
            fontFamily: FONTS.body,
            fontSize: 24,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.06em',
          }}>
            Drop your answer in the comments ↓
          </div>
        </AbsoluteFill>
      )}

      {/* ── Subscribe CTA ────────────────────────────────────────────── */}
      {frame >= PH.subscribe.in && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 30,
            opacity: interpolate(frame, [PH.subscribe.in, PH.subscribe.in + 30, PH.fadeOut.in, PH.fadeOut.out], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}
        >
          {/* Channel name */}
          <div style={{
            fontFamily: FONTS.hook,
            fontSize: 60,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: COLORS.white,
            textShadow: `0 0 60px ${COLORS.gold}44`,
          }}>
            Stay in the Word
          </div>

          <SubscribeCTA frame={frame} delay={PH.subscribe.in + 10} />

          {/* Social handles */}
          <div style={{
            fontFamily: FONTS.body,
            fontSize: 18,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.1em',
          }}>
            @StayInTheWord • God bless you 🙏
          </div>
        </AbsoluteFill>
      )}

      {/* ── Final fade to black ────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: '#000000',
          opacity: exitFade,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
