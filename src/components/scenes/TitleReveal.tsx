import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {COLORS, FONTS, s} from '../../constants';
import {DramaticText} from '../DramaticText';
import {LightRays} from '../LightRays';
import {GlowEffect} from '../GlowEffect';
import {ThreeDScene} from '../three/ThreeDScene';

/*
  TITLE REVEAL — 15 seconds (450–900 frames)
  Epic 3D title animation. Establishes the video's visual identity.

  Timeline:
  0:00 – 0:02  (f0–60)    Fade in from white. Gold light rays emerge.
  0:02 – 0:05  (f60–150)  3D cross rises & orbits. Particles converge.
  0:05 – 0:09  (f150–270) Main title slams in: "5 Signs God Is Asking You"
  0:09 – 0:13  (f270–390) Subtitle reveals: "To Delete Your Playlist"
  0:13 – 0:15  (f390–450) Transition: cross fades, cinematic fade to dark

  Midjourney prompt for hero background:
  "Cinematic heavenly golden light beams breaking through dark storm clouds,
   divine rays, deep purple and blue sky, photorealistic, 8k, epic scale,
   no people, cinematic color grading"
*/

export const TitleReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ─── Phase timings ────────────────────────────────────────────────────────
  const FADE_IN_END = 40;
  const CROSS_START = 20;
  const TITLE_LINE1_START = 120;
  const TITLE_LINE2_START = 160;
  const TITLE_LINE3_START = 200;
  const NUMBER_BADGE_START = 90;
  const CHANNEL_IN = 340;
  const FADE_OUT_START = 400;

  // ─── Background fade from white ───────────────────────────────────────────
  const fromWhite = interpolate(frame, [0, FADE_IN_END], [1, 0], {extrapolateRight: 'clamp'});

  // ─── Background atmosphere ────────────────────────────────────────────────
  const bgOpacity = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});

  // ─── Light rays intensity ─────────────────────────────────────────────────
  const raysIntensity = interpolate(
    frame,
    [CROSS_START, CROSS_START + 60, FADE_OUT_START, 450],
    [0, 0.45, 0.45, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── Center glow ──────────────────────────────────────────────────────────
  const glowIntensity = interpolate(
    frame,
    [CROSS_START, CROSS_START + 40, FADE_OUT_START, 450],
    [0, 0.6, 0.6, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── 3D scene opacity ─────────────────────────────────────────────────────
  const sceneOpacity = interpolate(
    frame,
    [CROSS_START, CROSS_START + 30, FADE_OUT_START, 450],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── "5 SIGNS" badge ──────────────────────────────────────────────────────
  const badgeScale = spring({
    fps,
    frame: Math.max(0, frame - NUMBER_BADGE_START),
    config: {damping: 8, stiffness: 250, mass: 1},
    from: 0,
    to: 1,
  });
  const badgeOpacity = interpolate(frame, [NUMBER_BADGE_START, NUMBER_BADGE_START + 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─── Title lines ──────────────────────────────────────────────────────────
  const line1Opacity = interpolate(frame, [TITLE_LINE1_START, TITLE_LINE1_START + 20], [0, 1], {extrapolateRight: 'clamp'});
  const line1Y = spring({fps, frame: Math.max(0, frame - TITLE_LINE1_START), config: {damping: 100, stiffness: 150}, from: 60, to: 0});

  const line2Scale = spring({fps, frame: Math.max(0, frame - TITLE_LINE2_START), config: {damping: 200, stiffness: 80}, from: 2, to: 1});
  const line2Opacity = interpolate(frame, [TITLE_LINE2_START, TITLE_LINE2_START + 15], [0, 1], {extrapolateRight: 'clamp'});

  const line3Opacity = interpolate(frame, [TITLE_LINE3_START, TITLE_LINE3_START + 25], [0, 1], {extrapolateRight: 'clamp'});
  const line3X = spring({fps, frame: Math.max(0, frame - TITLE_LINE3_START), config: {damping: 100, stiffness: 150}, from: -80, to: 0});

  // ─── Decorative horizontal lines ──────────────────────────────────────────
  const lineWidth = interpolate(frame, [TITLE_LINE2_START, TITLE_LINE2_START + 50], [0, 900], {extrapolateRight: 'clamp'});

  // ─── Channel CTA ──────────────────────────────────────────────────────────
  const channelOpacity = interpolate(frame, [CHANNEL_IN, CHANNEL_IN + 20, 430, 450], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ─── Exit fade ────────────────────────────────────────────────────────────
  const exitFade = interpolate(frame, [FADE_OUT_START, 450], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>

      {/* ── Background: deep purple-blue ───────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 100% at 50% 50%,
            ${COLORS.deepPurple} 0%,
            #0d1030 30%,
            ${COLORS.darkBg} 100%)`,
          opacity: bgOpacity,
        }}
      />

      {/* ── Light rays ─────────────────────────────────────────────────────── */}
      <div style={{opacity: raysIntensity}}>
        <LightRays color={COLORS.gold} intensity={0.7} numRays={16} originX={50} originY={45} />
      </div>

      {/* ── Center divine glow ─────────────────────────────────────────────── */}
      <div style={{opacity: glowIntensity}}>
        <GlowEffect color={COLORS.gold} intensity={0.5} blur={150} x="50%" y="45%" />
      </div>

      {/* ── 3D Cross scene ─────────────────────────────────────────────────── */}
      <div style={{opacity: sceneOpacity}}>
        <ThreeDScene preset="title-reveal" crossColor={COLORS.gold} emissiveColor={COLORS.gold} crossScale={1.4} delay={CROSS_START} cameraMovement="orbit" />
      </div>

      {/* ── Title block ─────────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '12%',
        }}
      >
        {/* "5 SIGNS" badge pill */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldBright} 100%)`,
            color: COLORS.darkBg,
            fontFamily: FONTS.body,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            padding: '10px 36px',
            borderRadius: 40,
            marginBottom: 30,
            boxShadow: `0 0 40px ${COLORS.gold}88, 0 8px 30px rgba(0,0,0,0.5)`,
          }}
        >
          5 Signs
        </div>

        {/* Line 1: "God Is Asking You" */}
        <div
          style={{
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
            fontFamily: FONTS.hook,
            fontSize: 70,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: COLORS.offWhite,
            letterSpacing: '0.04em',
            textShadow: `0 0 60px ${COLORS.gold}44`,
            textAlign: 'center',
          }}
        >
          God Is Asking You
        </div>

        {/* Decorative line */}
        <div
          style={{
            height: 2,
            width: lineWidth,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            borderRadius: 1,
            margin: '14px 0',
            boxShadow: `0 0 12px ${COLORS.gold}88`,
          }}
        />

        {/* Line 2: "TO DELETE" — massive */}
        <div
          style={{
            opacity: line2Opacity,
            transform: `scale(${line2Scale})`,
            fontFamily: FONTS.hook,
            fontSize: 160,
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 0.9,
            color: 'transparent',
            backgroundImage: `linear-gradient(160deg, ${COLORS.white} 0%, ${COLORS.gold} 40%, ${COLORS.goldLight} 60%, ${COLORS.white} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 30px ${COLORS.gold}66)`,
            textAlign: 'center',
          }}
        >
          Your Playlist
        </div>

        {/* Decorative line */}
        <div
          style={{
            height: 2,
            width: lineWidth,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            borderRadius: 1,
            margin: '14px 0',
            boxShadow: `0 0 12px ${COLORS.gold}88`,
          }}
        />

        {/* Line 3: slide from left */}
        <div
          style={{
            opacity: line3Opacity,
            transform: `translateX(${line3X}px)`,
            fontFamily: FONTS.scripture,
            fontSize: 40,
            fontStyle: 'italic',
            color: COLORS.goldLight,
            letterSpacing: '0.06em',
            textShadow: `0 0 30px ${COLORS.gold}66`,
            textAlign: 'center',
          }}
        >
          — And Why You Should Listen
        </div>

        {/* Channel subscribe nudge */}
        <div
          style={{
            opacity: channelOpacity,
            marginTop: 40,
            fontFamily: FONTS.body,
            fontSize: 20,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.08em',
          }}
        >
          👆 Subscribe • Hit the bell • Stay to the end
        </div>
      </AbsoluteFill>

      {/* ── From-white overlay (entrance) ──────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: COLORS.gloryYellow,
          opacity: fromWhite,
          pointerEvents: 'none',
        }}
      />

      {/* ── Exit fade ─────────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: COLORS.darkBg,
          opacity: exitFade,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
