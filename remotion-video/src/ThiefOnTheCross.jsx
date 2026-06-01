import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

const DARK_BG = '#0a0a0f';
const GOLD = '#c9a84c';
const LIGHT = '#f5e6c8';
const RED = '#8b1a1a';
const CROSS_BROWN = '#5c3317';

function Cross({ x, y, width = 60, height = 110, opacity = 1 }) {
  const armW = width;
  const armH = 18;
  const bodyW = 18;
  const bodyH = height;
  return (
    <g opacity={opacity}>
      <rect
        x={x - bodyW / 2}
        y={y - height * 0.15}
        width={bodyW}
        height={bodyH}
        fill={CROSS_BROWN}
        rx={3}
      />
      <rect
        x={x - armW / 2}
        y={y + height * 0.15}
        width={armW}
        height={armH}
        fill={CROSS_BROWN}
        rx={3}
      />
    </g>
  );
}

function Figure({ x, y, opacity = 1, color = '#c9a84c' }) {
  return (
    <g opacity={opacity}>
      {/* head */}
      <circle cx={x} cy={y - 52} r={10} fill={color} />
      {/* body arms spread */}
      <line
        x1={x - 28}
        y1={y - 30}
        x2={x + 28}
        y2={y - 30}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* torso */}
      <line
        x1={x}
        y1={y - 40}
        x2={x}
        y2={y + 20}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* legs */}
      <line
        x1={x}
        y1={y + 20}
        x2={x - 12}
        y2={y + 55}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={x}
        y1={y + 20}
        x2={x + 12}
        y2={y + 55}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
  );
}

function Stars({ count = 60, seed = 1 }) {
  const stars = [];
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = 0; i < count; i++) {
    const cx = rand() * 1920;
    const cy = rand() * 600;
    const r = rand() * 1.8 + 0.4;
    const op = rand() * 0.6 + 0.3;
    stars.push(<circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={op} />);
  }
  return <g>{stars}</g>;
}

// ── Scene 1: Hook (0–5 s) ─────────────────────────────────────────────────────
function SceneHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 30], [40, 0], { extrapolateRight: 'clamp' });

  const subOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0a0a1a 0%, #1a0a00 100%)` }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <Stars count={80} seed={42} />
        {/* golden glow behind title */}
        <ellipse cx={960} cy={500} rx={500} ry={120} fill={GOLD} opacity={0.08} />
      </svg>

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
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 72,
            fontFamily: 'Georgia, serif',
            color: GOLD,
            textAlign: 'center',
            fontStyle: 'italic',
            textShadow: '0 0 40px rgba(201,168,76,0.6)',
            lineHeight: 1.2,
          }}
        >
          "One man went to heaven…
        </div>
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 72,
            fontFamily: 'Georgia, serif',
            color: LIGHT,
            textAlign: 'center',
            fontStyle: 'italic',
            textShadow: '0 0 20px rgba(245,230,200,0.4)',
            lineHeight: 1.2,
          }}
        >
          without ever going to church."
        </div>
        <div
          style={{
            opacity: subOpacity,
            marginTop: 24,
            fontSize: 34,
            fontFamily: 'Georgia, serif',
            color: 'rgba(245,230,200,0.7)',
            textAlign: 'center',
            letterSpacing: 2,
          }}
        >
          — Luke 23:43
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 2: The Two Crosses (5–15 s) ─────────────────────────────────────────
function SceneCrosses() {
  const frame = useCurrentFrame();

  const crossOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' });
  const crossScale = interpolate(frame, [0, 40], [0.7, 1], { extrapolateRight: 'clamp' });

  const text1Op = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' });
  const text2Op = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' });
  const text3Op = interpolate(frame, [130, 160], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #150505 0%, #0a0a0f 60%, #1a0a00 100%)` }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        <Stars count={60} seed={7} />

        {/* ground line */}
        <line
          x1={200}
          y1={820}
          x2={1720}
          y2={820}
          stroke="rgba(201,168,76,0.2)"
          strokeWidth={2}
        />

        {/* hill silhouette */}
        <ellipse cx={960} cy={870} rx={700} ry={160} fill="#1a0800" />

        <g
          transform={`translate(960, 540) scale(${crossScale}) translate(-960, -540)`}
          opacity={crossOpacity}
        >
          {/* left thief */}
          <Cross x={560} y={680} width={80} height={150} />
          <Figure x={560} y={620} color="#a87850" />

          {/* Jesus - center, slightly larger */}
          <Cross x={960} y={660} width={100} height={170} />
          <Figure x={960} y={595} color={GOLD} />

          {/* right thief */}
          <Cross x={1360} y={680} width={80} height={150} />
          <Figure x={1360} y={620} color="#a87850" />
        </g>

        {/* light ray from center cross */}
        <defs>
          <radialGradient id="rayGrad" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.25" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx={960}
          cy={500}
          rx={300}
          ry={400}
          fill="url(#rayGrad)"
          opacity={crossOpacity}
        />
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
          gap: 16,
          padding: '0 120px',
        }}
      >
        <div
          style={{
            opacity: text1Op,
            fontSize: 42,
            fontFamily: 'Georgia, serif',
            color: LIGHT,
            textAlign: 'center',
          }}
        >
          He had no good works. No baptism.
        </div>
        <div
          style={{
            opacity: text2Op,
            fontSize: 42,
            fontFamily: 'Georgia, serif',
            color: LIGHT,
            textAlign: 'center',
          }}
        >
          Only seconds left to live.
        </div>
        <div
          style={{
            opacity: text3Op,
            fontSize: 46,
            fontFamily: 'Georgia, serif',
            color: GOLD,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Just one honest cry.
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 3: The Cry (15–22 s) ────────────────────────────────────────────────
function SceneCry() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = spring({ frame, fps, config: { damping: 200 } });
  const scale = interpolate(pulse, [0, 1], [0.85, 1]);

  const quoteOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const replyOp = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #1a0808 0%, #0a0a0f 70%)`,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <Stars count={50} seed={13} />
        <defs>
          <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.15" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={960} cy={540} rx={600} ry={400} fill="url(#glow3)" />
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 60,
          padding: '0 120px',
        }}
      >
        <div
          style={{
            opacity: quoteOp,
            transform: `scale(${scale})`,
            background: 'rgba(139,26,26,0.2)',
            border: `2px solid rgba(139,26,26,0.6)`,
            borderRadius: 16,
            padding: '40px 80px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontFamily: 'Georgia, serif',
              color: 'rgba(245,230,200,0.7)',
              marginBottom: 16,
              letterSpacing: 2,
            }}
          >
            THE THIEF SAID:
          </div>
          <div
            style={{
              fontSize: 62,
              fontFamily: 'Georgia, serif',
              color: LIGHT,
              fontStyle: 'italic',
              lineHeight: 1.3,
              textShadow: '0 0 20px rgba(245,230,200,0.3)',
            }}
          >
            "Jesus, remember me."
          </div>
        </div>

        <div
          style={{
            opacity: replyOp,
            background: 'rgba(201,168,76,0.12)',
            border: `2px solid rgba(201,168,76,0.5)`,
            borderRadius: 16,
            padding: '40px 80px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontFamily: 'Georgia, serif',
              color: 'rgba(201,168,76,0.7)',
              marginBottom: 16,
              letterSpacing: 2,
            }}
          >
            JESUS ANSWERED:
          </div>
          <div
            style={{
              fontSize: 62,
              fontFamily: 'Georgia, serif',
              color: GOLD,
              fontStyle: 'italic',
              lineHeight: 1.3,
              textShadow: '0 0 30px rgba(201,168,76,0.5)',
            }}
          >
            "Today you will be with me
            <br />
            in Paradise."
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 4: Closing Message (22–27 s) ────────────────────────────────────────
function SceneClose() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lightSpread = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

  const line1Op = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: 'clamp' });
  const line2Op = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' });
  const line3Op = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 20%, #1a1000 0%, #0a0a0f 80%)`,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <Stars count={70} seed={99} />
        <defs>
          <radialGradient id="heavenGlow" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.3 * lightSpread} />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#heavenGlow)" />

        {/* beams of light */}
        {[...Array(7)].map((_, i) => {
          const angle = -60 + i * 20;
          const rad = (angle * Math.PI) / 180;
          const len = 800;
          return (
            <line
              key={i}
              x1={960}
              y1={0}
              x2={960 + Math.sin(rad) * len}
              y2={Math.cos(rad) * len}
              stroke={GOLD}
              strokeWidth={3}
              opacity={0.06 * lightSpread}
            />
          );
        })}
      </svg>

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
            color: 'rgba(245,230,200,0.75)',
            textAlign: 'center',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          No church. No rituals. No earned merit.
        </div>

        <div
          style={{
            opacity: line2Op,
            fontSize: 80,
            fontFamily: 'Georgia, serif',
            color: GOLD,
            textAlign: 'center',
            fontStyle: 'italic',
            fontWeight: 'bold',
            textShadow: '0 0 60px rgba(201,168,76,0.7), 0 0 120px rgba(201,168,76,0.3)',
            lineHeight: 1.2,
          }}
        >
          Salvation is a gift,
          <br />
          not a reward.
        </div>

        <div
          style={{
            opacity: line3Op,
            marginTop: 12,
            fontSize: 32,
            fontFamily: 'Georgia, serif',
            color: 'rgba(245,230,200,0.6)',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          — Ephesians 2:8
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 5: CTA (27–30 s) ────────────────────────────────────────────────────
function SceneCTA() {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const ctaScale = interpolate(frame, [10, 40], [0.8, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #0d1a10 0%, #0a0a0f 80%)`,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <Stars count={60} seed={55} />
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <div
          style={{
            opacity: fadeIn,
            transform: `scale(${ctaScale})`,
            fontSize: 52,
            fontFamily: 'Georgia, serif',
            color: LIGHT,
            textAlign: 'center',
            lineHeight: 1.4,
            padding: '0 120px',
          }}
        >
          Tag someone who needs this grace.
        </div>

        <div
          style={{
            opacity: fadeIn,
            fontSize: 36,
            fontFamily: 'Georgia, serif',
            color: 'rgba(201,168,76,0.8)',
            textAlign: 'center',
            fontStyle: 'italic',
            letterSpacing: 2,
          }}
        >
          #GraceAlone #ThiefOnTheCross
        </div>

        <div
          style={{
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' }),
            marginTop: 20,
            width: 80,
            height: 4,
            background: GOLD,
            borderRadius: 2,
            boxShadow: `0 0 20px ${GOLD}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

// ── Main Composition ──────────────────────────────────────────────────────────
export function ThiefOnTheCross() {
  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      {/* Scene 1: Hook — 0 to 5s (150 frames @30fps) */}
      <Sequence from={0} durationInFrames={150}>
        <SceneHook />
      </Sequence>

      {/* Scene 2: Crosses — 5s to 15s */}
      <Sequence from={150} durationInFrames={300}>
        <SceneCrosses />
      </Sequence>

      {/* Scene 3: The Cry — 15s to 22s */}
      <Sequence from={450} durationInFrames={210}>
        <SceneCry />
      </Sequence>

      {/* Scene 4: Closing — 22s to 27s */}
      <Sequence from={660} durationInFrames={150}>
        <SceneClose />
      </Sequence>

      {/* Scene 5: CTA — 27s to 30s */}
      <Sequence from={810} durationInFrames={90}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
}
