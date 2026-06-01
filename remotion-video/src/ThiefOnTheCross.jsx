import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
} from 'remotion';

const GOLD = '#c9a84c';
const LIGHT = '#f5e6c8';
const CROSS_BROWN = '#5c3317';

// Full-bleed background image with optional dark overlay
function BgImage({ src, overlayOpacity = 0.45, children }) {
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(0,0,0,${overlayOpacity})`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
}

function Cross({ x, y, width = 60, height = 110, opacity = 1 }) {
  const armW = width;
  const armH = 18;
  const bodyW = 18;
  const bodyH = height;
  return (
    <g opacity={opacity}>
      <rect x={x - bodyW / 2} y={y - height * 0.15} width={bodyW} height={bodyH} fill={CROSS_BROWN} rx={3} />
      <rect x={x - armW / 2} y={y + height * 0.15} width={armW} height={armH} fill={CROSS_BROWN} rx={3} />
    </g>
  );
}

function Figure({ x, y, color = '#c9a84c' }) {
  return (
    <g>
      <circle cx={x} cy={y - 52} r={10} fill={color} />
      <line x1={x - 28} y1={y - 30} x2={x + 28} y2={y - 30} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={x} y1={y - 40} x2={x} y2={y + 20} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={x} y1={y + 20} x2={x - 12} y2={y + 55} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <line x1={x} y1={y + 20} x2={x + 12} y2={y + 55} stroke={color} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

// ── Scene 1: Hook (0–5 s) ─────────────────────────────────────────────────────
function SceneHook() {
  const frame = useCurrentFrame();

  const titleOp  = interpolate(frame, [0, 30],  [0, 1], { extrapolateRight: 'clamp' });
  const titleY   = interpolate(frame, [0, 30],  [40, 0], { extrapolateRight: 'clamp' });
  const subOp    = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <BgImage src={staticFile('bg-hook.png')} overlayOpacity={0.35}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          padding: '0 80px',
        }}
      >
        <div
          style={{
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            fontSize: 72,
            fontFamily: 'Georgia, serif',
            color: GOLD,
            textAlign: 'center',
            fontStyle: 'italic',
            textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.5)',
            lineHeight: 1.25,
          }}
        >
          "One man went to heaven…
        </div>
        <div
          style={{
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            fontSize: 72,
            fontFamily: 'Georgia, serif',
            color: LIGHT,
            textAlign: 'center',
            fontStyle: 'italic',
            textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 0 20px rgba(245,230,200,0.3)',
            lineHeight: 1.25,
          }}
        >
          without ever going to church."
        </div>
        <div
          style={{
            opacity: subOp,
            marginTop: 24,
            fontSize: 34,
            fontFamily: 'Georgia, serif',
            color: 'rgba(245,230,200,0.8)',
            textAlign: 'center',
            letterSpacing: 3,
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          — Luke 23:43
        </div>
      </div>
    </BgImage>
  );
}

// ── Scene 2: The Two Crosses (5–15 s) ─────────────────────────────────────────
function SceneCrosses() {
  const frame = useCurrentFrame();

  const crossOp    = interpolate(frame, [0, 40],   [0, 1], { extrapolateRight: 'clamp' });
  const crossScale = interpolate(frame, [0, 40],   [0.7, 1], { extrapolateRight: 'clamp' });
  const text1Op    = interpolate(frame, [50, 80],  [0, 1], { extrapolateRight: 'clamp' });
  const text2Op    = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' });
  const text3Op    = interpolate(frame, [130, 160],[0, 1], { extrapolateRight: 'clamp' });

  return (
    <BgImage src={staticFile('bg-golgotha.png')} overlayOpacity={0.3}>
      {/* SVG crosses + figure overlays */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="rayGrad2" cx="50%" cy="10%" r="80%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.3" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={960} cy={420} rx={320} ry={380} fill="url(#rayGrad2)" opacity={crossOp} />

        <g
          transform={`translate(960,540) scale(${crossScale}) translate(-960,-540)`}
          opacity={crossOp}
        >
          <Cross x={560} y={680} width={80} height={150} />
          <Figure x={560} y={620} color="#c09060" />

          <Cross x={960} y={650} width={110} height={180} />
          <Figure x={960} y={580} color={GOLD} />

          <Cross x={1360} y={680} width={80} height={150} />
          <Figure x={1360} y={620} color="#c09060" />
        </g>
      </svg>

      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          padding: '0 120px',
        }}
      >
        {[
          { op: text1Op, text: 'He had no good works. No baptism.', color: LIGHT },
          { op: text2Op, text: 'Only seconds left to live.',        color: LIGHT },
          { op: text3Op, text: 'Just one honest cry.',              color: GOLD, italic: true },
        ].map(({ op, text, color, italic }) => (
          <div
            key={text}
            style={{
              opacity: op,
              fontSize: italic ? 48 : 42,
              fontFamily: 'Georgia, serif',
              fontStyle: italic ? 'italic' : 'normal',
              color,
              textAlign: 'center',
              textShadow: '0 3px 20px rgba(0,0,0,0.95)',
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </BgImage>
  );
}

// ── Scene 3: The Cry (15–22 s) ────────────────────────────────────────────────
function SceneCry() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse   = spring({ frame, fps, config: { damping: 200 } });
  const scale   = interpolate(pulse, [0, 1], [0.88, 1]);
  const quoteOp = interpolate(frame, [0, 25],  [0, 1], { extrapolateRight: 'clamp' });
  const replyOp = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <BgImage src={staticFile('bg-cry.png')} overlayOpacity={0.25}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 52,
          padding: '0 120px',
        }}
      >
        {/* Thief's plea */}
        <div
          style={{
            opacity: quoteOp,
            transform: `scale(${scale})`,
            background: 'rgba(10,0,0,0.55)',
            border: '2px solid rgba(180,50,50,0.65)',
            borderRadius: 18,
            padding: '40px 80px',
            textAlign: 'center',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div style={{ fontSize: 26, fontFamily: 'Georgia, serif', color: 'rgba(245,210,200,0.7)', marginBottom: 14, letterSpacing: 3 }}>
            THE THIEF SAID:
          </div>
          <div style={{ fontSize: 60, fontFamily: 'Georgia, serif', color: LIGHT, fontStyle: 'italic', lineHeight: 1.3, textShadow: '0 0 20px rgba(255,200,180,0.3)' }}>
            "Jesus, remember me."
          </div>
        </div>

        {/* Jesus's reply */}
        <div
          style={{
            opacity: replyOp,
            background: 'rgba(0,0,0,0.55)',
            border: '2px solid rgba(201,168,76,0.6)',
            borderRadius: 18,
            padding: '40px 80px',
            textAlign: 'center',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div style={{ fontSize: 26, fontFamily: 'Georgia, serif', color: 'rgba(201,168,76,0.75)', marginBottom: 14, letterSpacing: 3 }}>
            JESUS ANSWERED:
          </div>
          <div style={{ fontSize: 60, fontFamily: 'Georgia, serif', color: GOLD, fontStyle: 'italic', lineHeight: 1.35, textShadow: '0 0 30px rgba(201,168,76,0.5)' }}>
            "Today you will be with me<br />in Paradise."
          </div>
        </div>
      </div>
    </BgImage>
  );
}

// ── Scene 4: Closing Message (22–27 s) ────────────────────────────────────────
function SceneClose() {
  const frame = useCurrentFrame();

  const line1Op = interpolate(frame, [10, 40],  [0, 1], { extrapolateRight: 'clamp' });
  const line2Op = interpolate(frame, [50, 80],  [0, 1], { extrapolateRight: 'clamp' });
  const line3Op = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: 'clamp' });

  // Brighten the paradise image over time (reduce overlay)
  const overlayOp = interpolate(frame, [0, 90], [0.5, 0.15], { extrapolateRight: 'clamp' });

  return (
    <BgImage src={staticFile('bg-paradise.png')} overlayOpacity={overlayOp}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 120px',
        }}
      >
        <div
          style={{
            opacity: line1Op,
            fontSize: 36,
            fontFamily: 'Georgia, serif',
            color: 'rgba(245,230,200,0.85)',
            textAlign: 'center',
            letterSpacing: 3,
            textTransform: 'uppercase',
            textShadow: '0 2px 16px rgba(0,0,0,0.9)',
          }}
        >
          No church. No rituals. No earned merit.
        </div>

        <div
          style={{
            opacity: line2Op,
            fontSize: 82,
            fontFamily: 'Georgia, serif',
            color: GOLD,
            textAlign: 'center',
            fontStyle: 'italic',
            fontWeight: 'bold',
            textShadow: '0 4px 40px rgba(0,0,0,0.8), 0 0 60px rgba(201,168,76,0.5)',
            lineHeight: 1.2,
          }}
        >
          Salvation is a gift,<br />not a reward.
        </div>

        <div
          style={{
            opacity: line3Op,
            fontSize: 32,
            fontFamily: 'Georgia, serif',
            color: 'rgba(245,230,200,0.7)',
            textAlign: 'center',
            fontStyle: 'italic',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          — Ephesians 2:8
        </div>
      </div>
    </BgImage>
  );
}

// ── Scene 5: CTA (27–30 s) ────────────────────────────────────────────────────
function SceneCTA() {
  const frame = useCurrentFrame();

  const fadeIn   = interpolate(frame, [0, 30],  [0, 1], { extrapolateRight: 'clamp' });
  const ctaScale = interpolate(frame, [10, 40], [0.8, 1], { extrapolateRight: 'clamp' });
  const barOp    = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <BgImage src={staticFile('bg-dawn.png')} overlayOpacity={0.4}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
        }}
      >
        <div
          style={{
            opacity: fadeIn,
            transform: `scale(${ctaScale})`,
            fontSize: 54,
            fontFamily: 'Georgia, serif',
            color: LIGHT,
            textAlign: 'center',
            lineHeight: 1.4,
            padding: '0 120px',
            textShadow: '0 3px 20px rgba(0,0,0,0.9)',
          }}
        >
          Tag someone who needs this grace.
        </div>

        <div
          style={{
            opacity: fadeIn,
            fontSize: 36,
            fontFamily: 'Georgia, serif',
            color: 'rgba(201,168,76,0.9)',
            textAlign: 'center',
            fontStyle: 'italic',
            letterSpacing: 2,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}
        >
          #GraceAlone #ThiefOnTheCross
        </div>

        <div
          style={{
            opacity: barOp,
            marginTop: 16,
            width: 90,
            height: 4,
            background: GOLD,
            borderRadius: 2,
            boxShadow: `0 0 20px ${GOLD}`,
          }}
        />
      </div>
    </BgImage>
  );
}

// ── Main Composition ──────────────────────────────────────────────────────────
export function ThiefOnTheCross() {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence from={0}   durationInFrames={150}><SceneHook /></Sequence>
      <Sequence from={150} durationInFrames={300}><SceneCrosses /></Sequence>
      <Sequence from={450} durationInFrames={210}><SceneCry /></Sequence>
      <Sequence from={660} durationInFrames={150}><SceneClose /></Sequence>
      <Sequence from={810} durationInFrames={90}> <SceneCTA /></Sequence>
    </AbsoluteFill>
  );
}
