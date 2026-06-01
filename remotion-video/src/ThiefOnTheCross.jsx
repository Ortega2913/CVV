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

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const GOLD        = '#c9a84c';
const LIGHT       = '#f5e6c8';
const CROSS_BROWN = '#5c3317';
const PERSP       = 900;          // CSS perspective (px) shared by all 3D moves
const TRANS_DUR   = 32;           // overlap frames between scenes

// Scene start / duration  (900 frames = 30 s @ 30 fps)
const S1_START = 0,   S1_DUR = 165;
const S2_START = S1_START + S1_DUR - TRANS_DUR;   // 133
const S2_DUR   = 320;
const S3_START = S2_START + S2_DUR - TRANS_DUR;   // 421
const S3_DUR   = 230;
const S4_START = S3_START + S3_DUR - TRANS_DUR;   // 619
const S4_DUR   = 180;
const S5_START = S4_START + S4_DUR - TRANS_DUR;   // 767
const S5_DUR   = 900 - S5_START;                  // 133

// ─────────────────────────────────────────────────────────────────────────────
// EASING CURVES
// ─────────────────────────────────────────────────────────────────────────────
const easeInCubic    = t => t * t * t;
const easeOutCubic   = t => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
const easeOutExpo    = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeInOutQuint = t => t < 0.5 ? 16*t*t*t*t*t : 1-Math.pow(-2*t+2,5)/2;

// ─────────────────────────────────────────────────────────────────────────────
// PARALLAX ENGINE
//
// Three depth layers per scene:
//   BG  depth=0.25  — art-*.jpg    — sky/distant backdrop  (slowest)
//   MG  depth=0.70  — mg-*.png     — hills, trees, crowds  (medium)
//   FG  depth=1.30  — fg-*.png     — rocks, branches       (fastest)
//
// Motion comes from two sources:
//   1. Organic float  — sinusoidal with unique phase per layer
//   2. Scene drift    — slow linear pan whose direction varies per scene
//
// Scale is slightly enlarged per layer so the translation never reveals
// an empty edge.  Margin = (scale-1)/2 × viewport ≥ max displacement.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the CSS transform values for a parallax layer.
 * @param {number} frame       - current frame (0…totalFrames)
 * @param {number} totalFrames - scene duration in frames
 * @param {number} depth       - depth coefficient (0.25 / 0.70 / 1.30)
 * @param {number} phase       - phase offset for the sinusoidal float
 * @param {number} driftDir    - +1 drift right, -1 drift left, 0 no drift
 */
function parallaxXY(frame, totalFrames, depth, phase, driftDir) {
  // Organic float — X and Y use different frequencies to avoid oval paths
  const floatX = Math.sin(frame * 0.0160 + phase)        * depth * 28;
  const floatY = Math.cos(frame * 0.0108 + phase * 0.72) * depth * 12;
  // Linear drift across the scene
  const progress = totalFrames > 0 ? frame / totalFrames : 0;
  const driftX   = progress * driftDir * depth * 22;
  return { x: floatX + driftX, y: floatY };
}

/** Single parallax image layer */
function ParallaxLayer({ src, depth, phase = 0, driftDir = 1, frame, totalFrames }) {
  const scale     = 1 + depth * 0.075;        // e.g. BG→1.019, MG→1.053, FG→1.098
  const { x, y } = parallaxXY(frame, totalFrames, depth, phase, driftDir);
  return (
    // Outer div translates in screen-pixel space; inner Img is pre-scaled
    // so the margin absorbs any translation without revealing empty edges.
    <div
      style={{
        position: 'absolute', inset: 0,
        transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`,
        willChange: 'transform',
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transform: `scale(${scale.toFixed(4)})`,
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3-D CAMERA MOVE DEFINITIONS  (After-Effects-style)
// Each entry: { out(t)→css,  in(t)→css }   t ∈ [0,1]
// ─────────────────────────────────────────────────────────────────────────────
const CAM = {
  // Dolly-in / push-through-Z  (S1→S2)
  zpush: {
    out(t) {
      const e = easeInCubic(t);
      return {
        transform: `translateZ(${interpolate(e,[0,1],[0,1800])}px) scale(${interpolate(e,[0,1],[1,5.5])})`,
        blur:    interpolate(t,[0,.25,1],[0,0,22]),
        opacity: interpolate(t,[0,.50,1],[1,.85,0]),
        zIndex: 10,
      };
    },
    in(t) {
      const e = easeOutExpo(t);
      return {
        transform: `translateZ(${interpolate(e,[0,1],[-1600,0])}px) scale(${interpolate(e,[0,1],[.12,1])})`,
        blur:    interpolate(t,[0,.65,1],[20,8,0]),
        opacity: interpolate(t,[0,.08,1],[0,1,1]),
        zIndex: 5,
      };
    },
  },
  // Horizontal 3-D door-flip / Y-axis spin  (S2→S3)
  yspin: {
    out(t) {
      const e = easeInOutCubic(t);
      return {
        transform: `perspective(${PERSP}px) rotateY(${interpolate(e,[0,1],[0,-96])}deg) translateZ(${interpolate(e,[0,1],[0,120])}px)`,
        blur:    interpolate(t,[0,.45,.85,1],[0,0,8,18]),
        opacity: interpolate(t,[0,.60,1],[1,.8,0]),
        zIndex: 10,
      };
    },
    in(t) {
      const e = easeInOutCubic(t);
      return {
        transform: `perspective(${PERSP}px) rotateY(${interpolate(e,[0,1],[96,0])}deg) translateZ(${interpolate(e,[0,1],[120,0])}px)`,
        blur:    interpolate(t,[0,.50,1],[18,6,0]),
        opacity: interpolate(t,[0,.40,1],[0,.8,1]),
        zIndex: 5,
      };
    },
  },
  // Camera-crane-up / X-axis tilt  (S3→S4)
  xtilt: {
    out(t) {
      const e = easeInOutQuint(t);
      return {
        transform: `perspective(${PERSP}px) rotateX(${interpolate(e,[0,1],[0,78])}deg) translateY(${interpolate(e,[0,1],[0,-520])}px)`,
        blur:    interpolate(t,[0,.35,1],[0,0,18]),
        opacity: interpolate(t,[0,.55,1],[1,.7,0]),
        zIndex: 10,
      };
    },
    in(t) {
      const e = easeOutExpo(t);
      return {
        transform: `perspective(${PERSP}px) rotateX(${interpolate(e,[0,1],[-78,0])}deg) translateY(${interpolate(e,[0,1],[520,0])}px)`,
        blur:    interpolate(t,[0,.65,1],[18,6,0]),
        opacity: interpolate(t,[0,.12,1],[0,1,1]),
        zIndex: 5,
      };
    },
  },
  // Orbit dolly-back (Z+Y)  (S4→S5)
  orbit: {
    out(t) {
      const e = easeInOutCubic(t);
      return {
        transform: `perspective(${PERSP}px) translateZ(${interpolate(e,[0,1],[0,-2200])}px) rotateY(${interpolate(e,[0,1],[0,28])}deg) scale(${interpolate(e,[0,1],[1,.04])})`,
        blur:    interpolate(t,[0,.20,1],[0,0,20]),
        opacity: interpolate(t,[0,.40,1],[1,.6,0]),
        zIndex: 10,
      };
    },
    in(t) {
      const e = easeOutExpo(t);
      return {
        transform: `perspective(${PERSP}px) translateZ(${interpolate(e,[0,1],[2200,0])}px) rotateY(${interpolate(e,[0,1],[-28,0])}deg) scale(${interpolate(e,[0,1],[.04,1])})`,
        blur:    interpolate(t,[0,.68,1],[20,6,0]),
        opacity: interpolate(t,[0,.08,1],[0,1,1]),
        zIndex: 5,
      };
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CAM3D WRAPPER  — wraps a scene with its enter/exit 3-D camera move
// ─────────────────────────────────────────────────────────────────────────────
function Cam3D({ enterType, exitType, totalFrames, children }) {
  const frame = useCurrentFrame();
  let transform = 'none', blur = 0, opacity = 1, zIndex = 1;

  if (enterType && frame < TRANS_DUR) {
    const r = CAM[enterType].in(frame / TRANS_DUR);
    ({ transform, blur, opacity, zIndex } = r);
  } else if (exitType && frame >= totalFrames - TRANS_DUR) {
    const r = CAM[exitType].out(Math.min(1, (frame - (totalFrames - TRANS_DUR)) / TRANS_DUR));
    ({ transform, blur, opacity, zIndex } = r);
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex,
      transform, opacity,
      filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
      willChange: 'transform, opacity, filter',
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Overlay({ opacity = 0.4 }) {
  return <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${opacity})`, pointerEvents: 'none' }} />;
}

function Cross({ x, y, w = 70, h = 130 }) {
  const bw = w * 0.22;
  return (
    <>
      <rect x={x-bw/2} y={y-h*0.12} width={bw} height={h}      fill={CROSS_BROWN} rx={3} />
      <rect x={x-w/2}  y={y+h*0.22} width={w}  height={h*0.14} fill={CROSS_BROWN} rx={3} />
    </>
  );
}
function Figure({ x, y, size, color }) {
  const sw = size * 0.07;
  return (
    <g>
      <circle cx={x} cy={y-size*.55} r={size*.11} fill={color} />
      <line x1={x-size*.32} y1={y-size*.28} x2={x+size*.32} y2={y-size*.28} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={x} y1={y-size*.42} x2={x} y2={y+size*.22} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={x} y1={y+size*.22} x2={x-size*.12} y2={y+size*.6} stroke={color} strokeWidth={sw*.85} strokeLinecap="round" />
      <line x1={x} y1={y+size*.22} x2={x+size*.12} y2={y+size*.6} stroke={color} strokeWidth={sw*.85} strokeLinecap="round" />
    </g>
  );
}
function TextLine({ frame, at, children, style }) {
  const op = interpolate(frame, [at, at+28], [0,1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  const ty = interpolate(easeOutCubic(Math.max(0,Math.min(1,(frame-at)/28))), [0,1], [32,0]);
  return <div style={{ opacity:op, transform:`translateY(${ty}px)`, ...style }}>{children}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 1 — HOOK
// Layers: art-hook.jpg (BG) → mg-hook.png (MG) → fg-hook.png (FG)
// Drift: rightward
// ─────────────────────────────────────────────────────────────────────────────
function SceneHook() {
  const frame = useCurrentFrame();
  const D = S1_DUR, dd = 1; // drift direction: right

  return (
    <AbsoluteFill style={{ background: '#010108', overflow: 'hidden' }}>
      {/* ── Parallax stack ── */}
      <ParallaxLayer src={staticFile('art-hook.jpg')} depth={0.25} phase={0.0} driftDir={dd} frame={frame} totalFrames={D} />
      <Overlay opacity={0.34} />
      <ParallaxLayer src={staticFile('mg-hook.png')}  depth={0.70} phase={1.8} driftDir={dd} frame={frame} totalFrames={D} />
      {/* FG rendered after text so bare tree branches frame the scene */}
      {/* ── Text ── */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:26, padding:'0 80px' }}>
        <TextLine frame={frame} at={8} style={{ fontSize:70, fontFamily:'Georgia,serif', color:GOLD, textAlign:'center', fontStyle:'italic', lineHeight:1.25, textShadow:'0 4px 40px rgba(0,0,0,0.9),0 0 50px rgba(201,168,76,0.4)' }}>
          "One man went to heaven…
        </TextLine>
        <TextLine frame={frame} at={22} style={{ fontSize:70, fontFamily:'Georgia,serif', color:LIGHT, textAlign:'center', fontStyle:'italic', lineHeight:1.25, textShadow:'0 4px 40px rgba(0,0,0,0.9),0 0 25px rgba(245,230,200,0.3)' }}>
          without ever going to church."
        </TextLine>
        <TextLine frame={frame} at={55} style={{ marginTop:18, fontSize:34, fontFamily:'Georgia,serif', color:'rgba(245,230,200,0.8)', letterSpacing:3, textShadow:'0 2px 16px rgba(0,0,0,0.95)' }}>
          — Luke 23:43
        </TextLine>
      </div>
      {/* FG on top of text to frame the shot — tree silhouettes at edges */}
      <ParallaxLayer src={staticFile('fg-hook.png')}  depth={1.30} phase={3.6} driftDir={dd} frame={frame} totalFrames={D} />
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2 — THREE CROSSES
// Layer order: BG sky → MG hill+crowd → SVG crosses → FG boulders → Text
// The crosses appear BETWEEN MG and FG, giving them mid-scene depth.
// ─────────────────────────────────────────────────────────────────────────────
function SceneCrosses() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = S2_DUR, dd = -1; // drift: left

  const crossSp = spring({ frame: Math.max(0, frame - TRANS_DUR), fps, config: { damping:160, stiffness:70 } });
  const cs  = interpolate(crossSp, [0,1], [0.72, 1.0]);
  const cop = interpolate(frame, [TRANS_DUR, TRANS_DUR+20], [0,1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  const ov  = interpolate(frame, [TRANS_DUR, D], [0.55, 0.36], { extrapolateRight:'clamp' });

  return (
    <AbsoluteFill style={{ background: '#08040a', overflow: 'hidden' }}>
      {/* BG */}
      <ParallaxLayer src={staticFile('art-golgotha.jpg')} depth={0.25} phase={0.3} driftDir={dd} frame={frame} totalFrames={D} />
      <Overlay opacity={ov} />
      {/* MG — hill + crowd */}
      <ParallaxLayer src={staticFile('mg-golgotha.png')} depth={0.70} phase={2.2} driftDir={dd} frame={frame} totalFrames={D} />

      {/* SVG crosses: sit ABOVE MG, BELOW FG  */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position:'absolute', inset:0 }}>
        <defs>
          <radialGradient id="divG" cx="50%" cy="44%" r="26%">
            <stop offset="0%"   stopColor={GOLD} stopOpacity={0.28 * cop} />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#divG)" />
        <g transform={`translate(960,540) scale(${cs}) translate(-960,-540)`} opacity={cop}>
          <Cross x={440}  y={778} w={80}  h={172} />
          <Figure x={440}  y={703} size={183} color="rgba(50,22,6,0.92)" />
          <Cross x={960}  y={742} w={100} h={200} />
          <Figure x={960}  y={655} size={214} color={`rgba(201,168,76,${cop})`} />
          <Cross x={1480} y={778} w={80}  h={172} />
          <Figure x={1480} y={703} size={183} color="rgba(50,22,6,0.92)" />
        </g>
      </svg>

      {/* FG — boulders + soldiers + thornbushes in foreground */}
      <ParallaxLayer src={staticFile('fg-golgotha.png')} depth={1.30} phase={4.1} driftDir={dd} frame={frame} totalFrames={D} />

      {/* Text above all layers */}
      <div style={{ position:'absolute', bottom:70, left:0, right:0, display:'flex', flexDirection:'column', alignItems:'center', gap:18, padding:'0 120px' }}>
        <TextLine frame={frame} at={TRANS_DUR+28} style={{ fontSize:44, fontFamily:'Georgia,serif', color:LIGHT, textAlign:'center', textShadow:'0 3px 24px rgba(0,0,0,0.98)' }}>
          He had no good works. No baptism.
        </TextLine>
        <TextLine frame={frame} at={TRANS_DUR+68} style={{ fontSize:44, fontFamily:'Georgia,serif', color:LIGHT, textAlign:'center', textShadow:'0 3px 24px rgba(0,0,0,0.98)' }}>
          Only seconds left to live.
        </TextLine>
        <TextLine frame={frame} at={TRANS_DUR+108} style={{ fontSize:52, fontFamily:'Georgia,serif', color:GOLD, fontStyle:'italic', textAlign:'center', textShadow:'0 3px 24px rgba(0,0,0,0.98)' }}>
          Just one honest cry.
        </TextLine>
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 3 — THE CRY
// BG → MG (ghost cross + ground) → dialogue cards → FG branches (frame the shot)
// ─────────────────────────────────────────────────────────────────────────────
function SceneCry() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = S3_DUR, dd = 1;

  const pulse  = spring({ frame: Math.max(0,frame-TRANS_DUR), fps, config:{ damping:200, stiffness:120 } });
  const pScale = interpolate(pulse, [0,1], [0.90,1.0]);
  const quoteOp = interpolate(frame, [TRANS_DUR+5, TRANS_DUR+35],  [0,1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  const replyOp = interpolate(frame, [TRANS_DUR+75, TRANS_DUR+105],[0,1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });

  return (
    <AbsoluteFill style={{ background: '#040002', overflow: 'hidden' }}>
      <ParallaxLayer src={staticFile('art-darkness.jpg')} depth={0.25} phase={0.7} driftDir={dd} frame={frame} totalFrames={D} />
      <Overlay opacity={interpolate(frame,[TRANS_DUR,D],[0.20,0.38],{extrapolateRight:'clamp'})} />
      <ParallaxLayer src={staticFile('mg-darkness.png')} depth={0.70} phase={2.6} driftDir={dd} frame={frame} totalFrames={D} />

      {/* Dialogue cards between MG and FG */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:50, padding:'0 100px' }}>
        <div style={{ opacity:quoteOp, transform:`scale(${pScale})`,
                      background:'rgba(8,0,0,0.72)', border:'2px solid rgba(160,40,40,0.72)',
                      borderRadius:18, padding:'36px 70px', textAlign:'center',
                      boxShadow:'0 0 50px rgba(120,0,0,0.35),inset 0 0 30px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize:24, fontFamily:'Georgia,serif', color:'rgba(235,200,190,0.65)', marginBottom:14, letterSpacing:4, textTransform:'uppercase' }}>The Thief Said:</div>
          <div style={{ fontSize:58, fontFamily:'Georgia,serif', color:LIGHT, fontStyle:'italic', lineHeight:1.35, textShadow:'0 0 20px rgba(255,200,180,0.25)' }}>
            "Jesus, remember me."
          </div>
        </div>
        <div style={{ opacity:replyOp,
                      background:'rgba(0,0,0,0.72)', border:'2px solid rgba(201,168,76,0.68)',
                      borderRadius:18, padding:'36px 70px', textAlign:'center',
                      boxShadow:'0 0 50px rgba(201,168,76,0.18),inset 0 0 30px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize:24, fontFamily:'Georgia,serif', color:'rgba(201,168,76,0.75)', marginBottom:14, letterSpacing:4, textTransform:'uppercase' }}>Jesus Answered:</div>
          <div style={{ fontSize:58, fontFamily:'Georgia,serif', color:GOLD, fontStyle:'italic', lineHeight:1.38, textShadow:'0 0 30px rgba(201,168,76,0.45)' }}>
            "Today you will be with me<br />in Paradise."
          </div>
        </div>
      </div>

      {/* FG thorny branches frame the drama */}
      <ParallaxLayer src={staticFile('fg-darkness.png')} depth={1.30} phase={5.0} driftDir={dd} frame={frame} totalFrames={D} />
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 4 — CLOSING MESSAGE (Paradise)
// BG → MG cloud banks → animated god-rays SVG → text → FG dark wisps
// ─────────────────────────────────────────────────────────────────────────────
function SceneClose() {
  const frame = useCurrentFrame();
  const D = S4_DUR, dd = 0; // no drift — heaven is centred and still

  const overlayOp = interpolate(frame,[TRANS_DUR,D],[0.55,0.10],{extrapolateRight:'clamp'});
  const rayOp     = interpolate(frame,[TRANS_DUR,D],[0.04,0.16],{extrapolateRight:'clamp'});

  return (
    <AbsoluteFill style={{ background: '#040608', overflow: 'hidden' }}>
      {/* BG — heaven core light */}
      <ParallaxLayer src={staticFile('art-paradise.jpg')} depth={0.25} phase={1.2} driftDir={dd} frame={frame} totalFrames={D} />
      <Overlay opacity={overlayOp} />
      {/* MG — parting cloud banks */}
      <ParallaxLayer src={staticFile('mg-paradise.png')} depth={0.70} phase={3.1} driftDir={dd} frame={frame} totalFrames={D} />

      {/* SVG animated god-ray fan */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position:'absolute', inset:0, mixBlendMode:'screen' }}>
        {Array.from({ length: 16 }, (_, i) => {
          const a   = Math.PI/2 + (i-8) * 0.165;
          const L   = 960, hw = 0.018;
          const pulse = Math.sin(frame * 0.06 + i * 0.7) * 0.3 + 0.7;
          return (
            <polygon key={i}
              points={`960,375 ${960+Math.cos(a-hw)*L},${375+Math.sin(a-hw)*L} ${960+Math.cos(a+hw)*L},${375+Math.sin(a+hw)*L}`}
              fill={`rgba(255,228,130,${(rayOp*pulse).toFixed(3)})`}
            />
          );
        })}
      </svg>

      {/* Text */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:30, padding:'0 120px' }}>
        <TextLine frame={frame} at={TRANS_DUR+8}  style={{ fontSize:36, fontFamily:'Georgia,serif', color:'rgba(245,230,200,0.85)', textAlign:'center', letterSpacing:4, textTransform:'uppercase', textShadow:'0 2px 20px rgba(0,0,0,0.95)' }}>
          No church. No rituals. No earned merit.
        </TextLine>
        <TextLine frame={frame} at={TRANS_DUR+48} style={{ fontSize:82, fontFamily:'Georgia,serif', color:GOLD, textAlign:'center', fontStyle:'italic', fontWeight:'bold', lineHeight:1.2, textShadow:'0 4px 40px rgba(0,0,0,0.85),0 0 70px rgba(201,168,76,0.55)' }}>
          <>Salvation is a gift,<br />not a reward.</>
        </TextLine>
        <TextLine frame={frame} at={TRANS_DUR+100} style={{ fontSize:32, fontFamily:'Georgia,serif', color:'rgba(245,230,200,0.7)', fontStyle:'italic', textShadow:'0 2px 16px rgba(0,0,0,0.95)' }}>
          — Ephesians 2:8
        </TextLine>
      </div>

      {/* FG — dark cloud wisps at screen edges */}
      <ParallaxLayer src={staticFile('fg-paradise.png')} depth={1.30} phase={0.5} driftDir={dd} frame={frame} totalFrames={D} />
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 5 — CTA (Dawn)
// BG → MG olive trees → text → FG close olive branches
// ─────────────────────────────────────────────────────────────────────────────
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = S5_DUR, dd = 1;

  const sp = spring({ frame: Math.max(0,frame-TRANS_DUR), fps, config:{ damping:150, stiffness:90 } });
  const cs = interpolate(sp, [0,1], [0.86,1.0]);

  return (
    <AbsoluteFill style={{ background: '#030610', overflow: 'hidden' }}>
      <ParallaxLayer src={staticFile('art-dawn.jpg')}  depth={0.25} phase={1.5} driftDir={dd} frame={frame} totalFrames={D} />
      <Overlay opacity={interpolate(frame,[TRANS_DUR,D],[0.52,0.38],{extrapolateRight:'clamp'})} />
      <ParallaxLayer src={staticFile('mg-dawn.png')}   depth={0.70} phase={3.4} driftDir={dd} frame={frame} totalFrames={D} />

      {/* Text between MG and FG */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32 }}>
        <div style={{
          opacity: interpolate(frame,[TRANS_DUR,TRANS_DUR+28],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
          transform:`scale(${cs})`,
          fontSize:54, fontFamily:'Georgia,serif', color:LIGHT, textAlign:'center', lineHeight:1.4, padding:'0 120px',
          textShadow:'0 3px 24px rgba(0,0,0,0.92)',
        }}>
          Tag someone who needs this grace.
        </div>
        <TextLine frame={frame} at={TRANS_DUR+38} style={{ fontSize:36, fontFamily:'Georgia,serif', color:'rgba(201,168,76,0.92)', fontStyle:'italic', letterSpacing:2, textShadow:'0 2px 14px rgba(0,0,0,0.88)' }}>
          #GraceAlone  #ThiefOnTheCross
        </TextLine>
        <div style={{
          opacity: interpolate(frame,[TRANS_DUR+60,TRANS_DUR+80],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
          marginTop:14, width:88, height:4, background:GOLD, borderRadius:2, boxShadow:`0 0 22px ${GOLD}`,
        }} />
      </div>

      {/* FG — close olive branches frame the dawn */}
      <ParallaxLayer src={staticFile('fg-dawn.png')} depth={1.30} phase={5.5} driftDir={dd} frame={frame} totalFrames={D} />
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPOSITION
// ─────────────────────────────────────────────────────────────────────────────
export function ThiefOnTheCross() {
  return (
    <AbsoluteFill style={{ background: '#000', perspective: `${PERSP}px`, perspectiveOrigin: '50% 50%' }}>
      {/*
       *  S1→S2  zpush  — camera punches through the night sky into Golgotha
       *  S2→S3  yspin  — scene 2 folds away like a door revealing darkness
       *  S3→S4  xtilt  — camera cranes up; heaven tilts into view
       *  S4→S5  orbit  — dolly-back orbit; dawn sweeps in
       *
       *  Within every scene, three parallax layers drift at different speeds:
       *    BG (depth=0.25)  →  subtle drift, barely moves
       *    MG (depth=0.70)  →  moderate drift, visible depth
       *    FG (depth=1.30)  →  fast drift, objects "fly past" camera
       *
       *  Phases are staggered so each layer floats independently.
       */}
      <Sequence from={S1_START} durationInFrames={S1_DUR}>
        <Cam3D exitType="zpush" totalFrames={S1_DUR}><SceneHook /></Cam3D>
      </Sequence>

      <Sequence from={S2_START} durationInFrames={S2_DUR}>
        <Cam3D enterType="zpush" exitType="yspin" totalFrames={S2_DUR}><SceneCrosses /></Cam3D>
      </Sequence>

      <Sequence from={S3_START} durationInFrames={S3_DUR}>
        <Cam3D enterType="yspin" exitType="xtilt" totalFrames={S3_DUR}><SceneCry /></Cam3D>
      </Sequence>

      <Sequence from={S4_START} durationInFrames={S4_DUR}>
        <Cam3D enterType="xtilt" exitType="orbit" totalFrames={S4_DUR}><SceneClose /></Cam3D>
      </Sequence>

      <Sequence from={S5_START} durationInFrames={S5_DUR}>
        <Cam3D enterType="orbit" totalFrames={S5_DUR}><SceneCTA /></Cam3D>
      </Sequence>
    </AbsoluteFill>
  );
}
