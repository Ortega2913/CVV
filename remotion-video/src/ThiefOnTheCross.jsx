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

const GOLD  = '#c9a84c';
const LIGHT = '#f5e6c8';
const CROSS_BROWN = '#5c3317';

// ── Easing helpers ─────────────────────────────────────────────────────────
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;

// ── Ken Burns wrapper ───────────────────────────────────────────────────────
// Slowly pan and zoom the image to bring it to life.
function KenBurns({ src, panX = [-2, 2], panY = [0, -2], zoom = [1.06, 1.0], duration }) {
  const frame = useCurrentFrame();
  const t = easeInOutCubic(Math.min(1, frame / duration));

  const scale  = interpolate(t, [0, 1], zoom);
  const tx     = interpolate(t, [0, 1], panX);
  const ty     = interpolate(t, [0, 1], panY);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

// ── Dark overlay ────────────────────────────────────────────────────────────
function Overlay({ opacity }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${opacity})`, pointerEvents: 'none' }} />
  );
}

// ── Cross / figure SVG ──────────────────────────────────────────────────────
function Cross({ x, y, w = 60, h = 110 }) {
  const bw = 18;
  return (
    <>
      <rect x={x - bw/2} y={y - h*0.12} width={bw} height={h} fill={CROSS_BROWN} rx={3} />
      <rect x={x - w/2}  y={y + h*0.22} width={w}  height={h*0.14} fill={CROSS_BROWN} rx={3} />
    </>
  );
}

function Figure({ x, y, size, color }) {
  return (
    <g>
      <circle cx={x} cy={y - size*0.55} r={size*0.11} fill={color} />
      <line x1={x-size*0.32} y1={y-size*0.28} x2={x+size*0.32} y2={y-size*0.28} stroke={color} strokeWidth={size*0.07} strokeLinecap="round" />
      <line x1={x} y1={y-size*0.42} x2={x} y2={y+size*0.22} stroke={color} strokeWidth={size*0.07} strokeLinecap="round" />
      <line x1={x} y1={y+size*0.22} x2={x-size*0.12} y2={y+size*0.60} stroke={color} strokeWidth={size*0.06} strokeLinecap="round" />
      <line x1={x} y1={y+size*0.22} x2={x+size*0.12} y2={y+size*0.60} stroke={color} strokeWidth={size*0.06} strokeLinecap="round" />
    </g>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TRANSITIONS
// ══════════════════════════════════════════════════════════════════════════════

// White-gold flash (holy transition)
function FlashTransition({ durationInFrames = 20 }) {
  const frame = useCurrentFrame();
  const op = interpolate(
    frame,
    [0, Math.floor(durationInFrames*0.35), durationInFrames],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, rgba(255,240,180,${op}) 0%, rgba(255,200,60,${op*0.7}) 40%, rgba(0,0,0,0) 100%)`,
      pointerEvents: 'none',
    }} />
  );
}

// Darkness-descend transition (scene 2 → 3)
function DarknessTransition({ durationInFrames = 25 }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, durationInFrames], [0, 0.92], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${op})`, pointerEvents: 'none' }} />
  );
}

// Heaven-break transition (scene 3 → 4): shrinking dark iris
function HeavenBreakTransition({ durationInFrames = 30 }) {
  const frame = useCurrentFrame();
  const pct = easeOutCubic(frame / durationInFrames);
  // inner radius grows from 0 to cover whole screen
  const innerR = interpolate(pct, [0, 1], [0, 160]);
  const outerR = interpolate(pct, [0, 1], [0, W_VIRTUAL * 0.9]);
  const op = interpolate(pct, [0, 0.3, 1], [1, 0.5, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: op }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="htGrad" cx="50%" cy="38%" r="50%">
            <stop offset={`${(innerR / 960) * 100}%`} stopColor="rgba(0,0,0,0)" />
            <stop offset={`${Math.min(100, (outerR / 960) * 100)}%`} stopColor="rgba(0,0,0,0.95)" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#htGrad)" />
      </svg>
    </AbsoluteFill>
  );
}

// Dissolve out (scene fades to black)
function DissolveOut({ start, end }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: `rgba(0,0,0,${op})`, pointerEvents: 'none' }} />;
}

// Slide-up reveal (CTA scene entrance)
function SlideUpReveal({ durationInFrames = 20, children }) {
  const frame = useCurrentFrame();
  const t = easeOutCubic(Math.min(1, frame / durationInFrames));
  const ty = interpolate(t, [0, 1], [H_VIRTUAL, 0]);
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateY(${ty}px)` }}>
      {children}
    </div>
  );
}

const W_VIRTUAL = 1920, H_VIRTUAL = 1080;

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — HOOK (frames 0-150, 5s)
// ══════════════════════════════════════════════════════════════════════════════
function SceneHook() {
  const frame = useCurrentFrame();
  const TOTAL = 150;

  const titleOp = interpolate(frame, [0, 35],  [0, 1], { extrapolateRight: 'clamp' });
  const titleY  = interpolate(frame, [0, 35],  [50, 0], { extrapolateRight: 'clamp' });
  const subOp   = interpolate(frame, [45, 78], [0, 1], { extrapolateRight: 'clamp' });
  const subY    = interpolate(frame, [45, 78], [20, 0], { extrapolateRight: 'clamp' });

  // Fade-out at end
  const endFade = interpolate(frame, [TOTAL-20, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#010108' }}>
      <KenBurns src={staticFile('art-hook.jpg')} zoom={[1.0, 1.08]} panX={[0, 1.5]} panY={[0, -1]} duration={TOTAL} />
      <Overlay opacity={0.38} />

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28, padding:'0 80px' }}>
        <div style={{
          opacity: titleOp, transform: `translateY(${titleY}px)`,
          fontSize: 70, fontFamily: 'Georgia, serif', color: GOLD,
          textAlign: 'center', fontStyle: 'italic',
          textShadow: '0 4px 40px rgba(0,0,0,0.9), 0 0 50px rgba(201,168,76,0.45)',
          lineHeight: 1.25,
        }}>
          "One man went to heaven…
        </div>
        <div style={{
          opacity: titleOp, transform: `translateY(${titleY}px)`,
          fontSize: 70, fontFamily: 'Georgia, serif', color: LIGHT,
          textAlign: 'center', fontStyle: 'italic',
          textShadow: '0 4px 40px rgba(0,0,0,0.9), 0 0 25px rgba(245,230,200,0.35)',
          lineHeight: 1.25,
        }}>
          without ever going to church."
        </div>
        <div style={{
          opacity: subOp, transform: `translateY(${subY}px)`,
          marginTop: 20, fontSize: 34, fontFamily: 'Georgia, serif',
          color: 'rgba(245,230,200,0.8)', letterSpacing: 3,
          textShadow: '0 2px 16px rgba(0,0,0,0.9)',
        }}>
          — Luke 23:43
        </div>
      </div>

      {/* Flash transition out */}
      <DissolveOut start={TOTAL-18} end={TOTAL} />
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — CROSSES (frames 150-450, 10s)
// ══════════════════════════════════════════════════════════════════════════════
function SceneCrosses() {
  const frame = useCurrentFrame();
  const TOTAL = 300;

  // Fade in from black
  const fadeIn  = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp' });
  const crossOp = interpolate(frame, [10, 50], [0, 1], { extrapolateRight: 'clamp' });

  const text1Op = interpolate(frame, [60, 90],  [0, 1], { extrapolateRight: 'clamp' });
  const text2Op = interpolate(frame, [100,130], [0, 1], { extrapolateRight: 'clamp' });
  const text3Op = interpolate(frame, [140,170], [0, 1], { extrapolateRight: 'clamp' });

  // Slight cross-scale entrance
  const crossScale = spring({ frame: frame - 10, fps: 30, config: { damping: 180, stiffness: 80 } });
  const cs = interpolate(crossScale, [0, 1], [0.75, 1]);

  return (
    <AbsoluteFill style={{ background: '#0a0504' }}>
      <KenBurns src={staticFile('art-golgotha.jpg')} zoom={[1.04, 1.0]} panX={[1, -1]} panY={[0, 1]} duration={TOTAL} />
      <Overlay opacity={interpolate(frame, [0, TOTAL], [0.55, 0.38], { extrapolateRight: 'clamp' })} />
      <Overlay opacity={interpolate(frame, [0, 22], [1, 0], { extrapolateRight: 'clamp' })} />

      {/* SVG cross overlays */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="divineGlow" cx="50%" cy="45%" r="30%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.25 * crossOp} />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#divineGlow)" />

        <g transform={`translate(960,540) scale(${cs}) translate(-960,-540)`} opacity={crossOp}>
          <Cross x={430}  y={760} w={80}  h={170} />
          <Figure x={430}  y={690} size={180} color="rgba(60,30,10,0.9)" />

          <Cross x={960}  y={730} w={100} h={200} />
          <Figure x={960}  y={655} size={210} color={`rgba(201,168,76,${crossOp})`} />

          <Cross x={1490} y={760} w={80}  h={170} />
          <Figure x={1490} y={690} size={180} color="rgba(60,30,10,0.9)" />
        </g>
      </svg>

      {/* Text */}
      <div style={{ position:'absolute', bottom:70, left:0, right:0, display:'flex', flexDirection:'column', alignItems:'center', gap:18, padding:'0 120px' }}>
        {[
          { op: text1Op, text: 'He had no good works. No baptism.',  color: LIGHT, size: 44 },
          { op: text2Op, text: 'Only seconds left to live.',          color: LIGHT, size: 44 },
          { op: text3Op, text: 'Just one honest cry.',               color: GOLD,  size: 50, italic: true },
        ].map(({ op, text, color, size, italic }) => (
          <div key={text} style={{
            opacity: op, fontSize: size, fontFamily: 'Georgia, serif',
            fontStyle: italic ? 'italic' : 'normal', color,
            textAlign: 'center',
            textShadow: '0 3px 24px rgba(0,0,0,0.95), 0 1px 8px rgba(0,0,0,1)',
          }}>
            {text}
          </div>
        ))}
      </div>

      {/* Darkness descends transition out */}
      <DissolveOut start={TOTAL-22} end={TOTAL} />
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — THE CRY (frames 450-660, 7s)
// ══════════════════════════════════════════════════════════════════════════════
function SceneCry() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const TOTAL = 210;

  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  const pulse  = spring({ frame, fps, config: { damping: 200, stiffness: 120 } });
  const pScale = interpolate(pulse, [0, 1], [0.90, 1]);

  const quoteOp = interpolate(frame, [5,  30],  [0, 1], { extrapolateRight: 'clamp' });
  const replyOp = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: 'clamp' });

  const overlayOp = interpolate(frame, [0, TOTAL], [0.22, 0.35], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#050002' }}>
      {/* Ken Burns: slow zoom IN — intense, claustrophobic */}
      <KenBurns src={staticFile('art-darkness.jpg')} zoom={[1.0, 1.10]} panX={[0, 0]} panY={[0, -2]} duration={TOTAL} />
      <Overlay opacity={overlayOp} />
      <Overlay opacity={interpolate(frame, [0, 18], [1, 0], { extrapolateRight: 'clamp' })} />

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:50, padding:'0 100px', opacity: fadeIn }}>

        {/* Thief's plea */}
        <div style={{
          opacity: quoteOp, transform: `scale(${pScale})`,
          background: 'rgba(8,0,0,0.70)',
          border: '2px solid rgba(160,40,40,0.70)',
          borderRadius: 18, padding: '38px 72px', textAlign: 'center',
          boxShadow: '0 0 40px rgba(120,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: 24, fontFamily: 'Georgia, serif', color: 'rgba(235,200,190,0.65)', marginBottom: 14, letterSpacing: 4, textTransform: 'uppercase' }}>
            The Thief Said:
          </div>
          <div style={{ fontSize: 58, fontFamily: 'Georgia, serif', color: LIGHT, fontStyle: 'italic', lineHeight: 1.35, textShadow: '0 0 20px rgba(255,200,180,0.25)' }}>
            "Jesus, remember me."
          </div>
        </div>

        {/* Jesus's reply */}
        <div style={{
          opacity: replyOp,
          background: 'rgba(0,0,0,0.70)',
          border: '2px solid rgba(201,168,76,0.65)',
          borderRadius: 18, padding: '38px 72px', textAlign: 'center',
          boxShadow: '0 0 50px rgba(201,168,76,0.2), inset 0 0 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: 24, fontFamily: 'Georgia, serif', color: 'rgba(201,168,76,0.75)', marginBottom: 14, letterSpacing: 4, textTransform: 'uppercase' }}>
            Jesus Answered:
          </div>
          <div style={{ fontSize: 58, fontFamily: 'Georgia, serif', color: GOLD, fontStyle: 'italic', lineHeight: 1.38, textShadow: '0 0 30px rgba(201,168,76,0.45)' }}>
            "Today you will be with me
            <br />in Paradise."
          </div>
        </div>
      </div>

      {/* Flash of light transition out */}
      <DissolveOut start={TOTAL-18} end={TOTAL} />
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 4 — CLOSING (frames 660-810, 5s)
// ══════════════════════════════════════════════════════════════════════════════
function SceneClose() {
  const frame = useCurrentFrame();
  const TOTAL = 150;

  // Overlay dims over time as light "breaks through"
  const overlayOp = interpolate(frame, [0, TOTAL], [0.55, 0.12], { extrapolateRight: 'clamp' });
  const fadeIn    = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const line1Op = interpolate(frame, [15, 45],  [0, 1], { extrapolateRight: 'clamp' });
  const line1Y  = interpolate(frame, [15, 45],  [25, 0], { extrapolateRight: 'clamp' });
  const line2Op = interpolate(frame, [52, 82],  [0, 1], { extrapolateRight: 'clamp' });
  const line2Y  = interpolate(frame, [52, 82],  [25, 0], { extrapolateRight: 'clamp' });
  const line3Op = interpolate(frame, [90, 112], [0, 1], { extrapolateRight: 'clamp' });

  // SVG light-ray pulse
  const rayOp = interpolate(frame, [0, TOTAL], [0.04, 0.14], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#040608' }}>
      <KenBurns src={staticFile('art-paradise.jpg')} zoom={[1.08, 1.0]} panX={[0, 0]} panY={[-2, 0]} duration={TOTAL} />
      <Overlay opacity={overlayOp} />
      <Overlay opacity={interpolate(frame, [0, 20], [1, 0], { extrapolateRight: 'clamp' })} />

      {/* Animated SVG god-ray fan */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position:'absolute', inset:0, mixBlendMode:'screen' }}>
        {Array.from({ length: 14 }, (_, i) => {
          const angle = Math.PI/2 + (i-7)*0.17;
          const len = 900;
          const halfW = 0.018;
          return (
            <polygon
              key={i}
              points={`
                960,380
                ${960 + Math.cos(angle-halfW)*len},${380 + Math.sin(angle-halfW)*len}
                ${960 + Math.cos(angle+halfW)*len},${380 + Math.sin(angle+halfW)*len}
              `}
              fill={`rgba(255,230,140,${(rayOp*(0.4+Math.sin(i)*0.3)).toFixed(3)})`}
            />
          );
        })}
      </svg>

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:30, padding:'0 120px', opacity: fadeIn }}>
        <div style={{
          opacity: line1Op, transform: `translateY(${line1Y}px)`,
          fontSize: 36, fontFamily: 'Georgia, serif', color: 'rgba(245,230,200,0.85)',
          textAlign: 'center', letterSpacing: 4, textTransform: 'uppercase',
          textShadow: '0 2px 20px rgba(0,0,0,0.9)',
        }}>
          No church. No rituals. No earned merit.
        </div>

        <div style={{
          opacity: line2Op, transform: `translateY(${line2Y}px)`,
          fontSize: 82, fontFamily: 'Georgia, serif', color: GOLD,
          textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold',
          textShadow: '0 4px 40px rgba(0,0,0,0.8), 0 0 70px rgba(201,168,76,0.55)',
          lineHeight: 1.2,
        }}>
          Salvation is a gift,<br />not a reward.
        </div>

        <div style={{
          opacity: line3Op,
          fontSize: 32, fontFamily: 'Georgia, serif',
          color: 'rgba(245,230,200,0.7)', fontStyle: 'italic',
          textShadow: '0 2px 16px rgba(0,0,0,0.9)',
        }}>
          — Ephesians 2:8
        </div>
      </div>

      <DissolveOut start={TOTAL-18} end={TOTAL} />
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 5 — CTA (frames 810-900, 3s)
// ══════════════════════════════════════════════════════════════════════════════
function SceneCTA() {
  const frame = useCurrentFrame();
  const TOTAL = 90;

  const fadeIn   = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const scale    = spring({ frame, fps: 30, config: { damping: 160, stiffness: 100 } });
  const cs       = interpolate(scale, [0, 1], [0.88, 1]);
  const tagOp    = interpolate(frame, [18, 45], [0, 1], { extrapolateRight: 'clamp' });
  const barOp    = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#03060e' }}>
      <KenBurns src={staticFile('art-dawn.jpg')} zoom={[1.0, 1.06]} panX={[0, 0]} panY={[2, 0]} duration={TOTAL} />
      <Overlay opacity={interpolate(frame, [0, TOTAL], [0.50, 0.38], { extrapolateRight: 'clamp' })} />
      <Overlay opacity={interpolate(frame, [0, 20], [1, 0], { extrapolateRight: 'clamp' })} />

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32 }}>
        <div style={{
          opacity: fadeIn, transform: `scale(${cs})`,
          fontSize: 54, fontFamily: 'Georgia, serif', color: LIGHT,
          textAlign: 'center', lineHeight: 1.4, padding: '0 120px',
          textShadow: '0 3px 24px rgba(0,0,0,0.9)',
        }}>
          Tag someone who needs this grace.
        </div>

        <div style={{
          opacity: tagOp,
          fontSize: 36, fontFamily: 'Georgia, serif',
          color: 'rgba(201,168,76,0.92)', fontStyle: 'italic', letterSpacing: 2,
          textShadow: '0 2px 14px rgba(0,0,0,0.85)',
        }}>
          #GraceAlone  #ThiefOnTheCross
        </div>

        <div style={{
          opacity: barOp, marginTop: 12,
          width: 90, height: 4, background: GOLD, borderRadius: 2,
          boxShadow: `0 0 22px ${GOLD}`,
        }} />
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ══════════════════════════════════════════════════════════════════════════════
export function ThiefOnTheCross() {
  // Scene boundaries (frames @ 30fps)
  // S1: 0-150  (5s)  S2: 150-450 (10s)  S3: 450-660 (7s)  S4: 660-810 (5s)  S5: 810-900 (3s)

  return (
    <AbsoluteFill style={{ background: '#000' }}>

      {/* ── Scenes ─────────────────────────────────────────────────── */}
      <Sequence from={0}   durationInFrames={150}><SceneHook /></Sequence>
      <Sequence from={150} durationInFrames={300}><SceneCrosses /></Sequence>
      <Sequence from={450} durationInFrames={210}><SceneCry /></Sequence>
      <Sequence from={660} durationInFrames={150}><SceneClose /></Sequence>
      <Sequence from={810} durationInFrames={90}> <SceneCTA /></Sequence>

      {/* ── Motion graphic transitions (layered on top) ────────────── */}

      {/* S1→S2: Gold flash (divine moment) */}
      <Sequence from={132} durationInFrames={36}>
        <FlashTransition durationInFrames={36} />
      </Sequence>

      {/* S2→S3: Darkness descends */}
      <Sequence from={432} durationInFrames={24}>
        <DarknessTransition durationInFrames={24} />
      </Sequence>

      {/* S3→S4: Heaven breaks open */}
      <Sequence from={642} durationInFrames={32}>
        <HeavenBreakTransition durationInFrames={32} />
      </Sequence>

      {/* S4→S5: Gentle dissolve (already handled by DissolveOut) */}

    </AbsoluteFill>
  );
}
