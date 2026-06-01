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
const GOLD  = '#c9a84c';
const LIGHT = '#f5e6c8';
const CROSS_BROWN = '#5c3317';

// Camera perspective distance (px). Lower = more extreme 3D distortion.
const PERSP = 900;

// Scene timing  (frames @ 30 fps, total 900 = 30 s)
// Scenes overlap by TRANS_DUR frames to give each transition room to breathe.
const TRANS_DUR = 32;    // frames each transition lasts
const S1_START  = 0;     const S1_DUR = 165;
const S2_START  = S1_START + S1_DUR - TRANS_DUR;   // 133
const S2_DUR    = 320;
const S3_START  = S2_START + S2_DUR - TRANS_DUR;   // 421
const S3_DUR    = 230;
const S4_START  = S3_START + S3_DUR - TRANS_DUR;   // 619
const S4_DUR    = 180;
const S5_START  = S4_START + S4_DUR - TRANS_DUR;   // 767
const S5_DUR    = 900 - S5_START;                  // 133

// ─────────────────────────────────────────────────────────────────────────────
// EASING CURVES  (mimic AE graph-editor presets)
// ─────────────────────────────────────────────────────────────────────────────
const easeInCubic    = t => t * t * t;
const easeOutCubic   = t => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const easeOutExpo    = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeInOutQuint = t => t < 0.5 ? 16*t*t*t*t*t : 1-Math.pow(-2*t+2,5)/2;

// ─────────────────────────────────────────────────────────────────────────────
// 3D CAMERA MOVE DEFINITIONS
//   Each entry: { out(t) → css, in(t) → css }   t ∈ [0,1]
//   css = { transform, blur, opacity, zIndex }
// ─────────────────────────────────────────────────────────────────────────────
const CAM = {

  // ── DOLLY IN / PUSH THROUGH Z ─────────────────────────────────────────────
  // Camera rushes forward through the outgoing scene, smashing into the next.
  // S1 → S2
  zpush: {
    out(t) {
      const e = easeInCubic(t);
      const z = interpolate(e, [0, 1], [0, 1800]);
      const s = interpolate(e, [0, 1], [1.0, 5.5]);
      return {
        transform: `translateZ(${z}px) scale(${s})`,
        blur:    interpolate(t, [0, 0.25, 1], [0, 0, 22]),
        opacity: interpolate(t, [0, 0.50, 1], [1, 0.85, 0]),
        zIndex: 10,
      };
    },
    in(t) {
      const e = easeOutExpo(t);
      const z = interpolate(e, [0, 1], [-1600, 0]);
      const s = interpolate(e, [0, 1], [0.12, 1.0]);
      return {
        transform: `translateZ(${z}px) scale(${s})`,
        blur:    interpolate(t, [0, 0.65, 1], [20, 8, 0]),
        opacity: interpolate(t, [0, 0.08, 1], [0,  1, 1]),
        zIndex: 5,
      };
    },
  },

  // ── HORIZONTAL 3D SPIN (Y-AXIS) ───────────────────────────────────────────
  // Outgoing scene folds away; new scene unfolds from opposite side.
  // Like an AE "card flip" / rotating door. S2 → S3
  yspin: {
    out(t) {
      const e = easeInOutCubic(t);
      const ry = interpolate(e, [0, 1], [0, -96]);
      const z  = interpolate(e, [0, 1], [0, 120]);
      return {
        transform: `perspective(${PERSP}px) rotateY(${ry}deg) translateZ(${z}px)`,
        blur:    interpolate(t, [0, 0.45, 0.85, 1], [0, 0, 8, 18]),
        opacity: interpolate(t, [0, 0.60,       1], [1, 0.8, 0]),
        zIndex: 10,
      };
    },
    in(t) {
      const e = easeInOutCubic(t);
      const ry = interpolate(e, [0, 1], [96, 0]);
      const z  = interpolate(e, [0, 1], [120, 0]);
      return {
        transform: `perspective(${PERSP}px) rotateY(${ry}deg) translateZ(${z}px)`,
        blur:    interpolate(t, [0, 0.50, 1], [18, 6, 0]),
        opacity: interpolate(t, [0, 0.40, 1], [0,  0.8, 1]),
        zIndex: 5,
      };
    },
  },

  // ── CAMERA CRANE UP / X-AXIS TILT ─────────────────────────────────────────
  // Outgoing scene tilts back as if the camera cranes upward to reveal heaven.
  // S3 → S4
  xtilt: {
    out(t) {
      const e = easeInOutQuint(t);
      const rx = interpolate(e, [0, 1], [0,   78]);
      const ty = interpolate(e, [0, 1], [0, -520]);
      return {
        transform: `perspective(${PERSP}px) rotateX(${rx}deg) translateY(${ty}px)`,
        blur:    interpolate(t, [0, 0.35, 1], [0,  0, 18]),
        opacity: interpolate(t, [0, 0.55, 1], [1, 0.7, 0]),
        zIndex: 10,
      };
    },
    in(t) {
      const e = easeOutExpo(t);
      const rx = interpolate(e, [0, 1], [-78,   0]);
      const ty = interpolate(e, [0, 1], [ 520,  0]);
      return {
        transform: `perspective(${PERSP}px) rotateX(${rx}deg) translateY(${ty}px)`,
        blur:    interpolate(t, [0, 0.65, 1], [18, 6, 0]),
        opacity: interpolate(t, [0, 0.12, 1], [0,  1, 1]),
        zIndex: 5,
      };
    },
  },

  // ── ORBIT DOLLY-BACK (Z + Y) ──────────────────────────────────────────────
  // Camera orbits away from the scene (pulls back + slight yaw), new scene
  // sweeps in from orbit. Like an AE null-object camera rig move. S4 → S5
  orbit: {
    out(t) {
      const e = easeInOutCubic(t);
      const z  = interpolate(e, [0, 1], [0,   -2200]);
      const ry = interpolate(e, [0, 1], [0,     28]);
      const s  = interpolate(e, [0, 1], [1.0,  0.04]);
      return {
        transform: `perspective(${PERSP}px) translateZ(${z}px) rotateY(${ry}deg) scale(${s})`,
        blur:    interpolate(t, [0, 0.20, 1], [0, 0, 20]),
        opacity: interpolate(t, [0, 0.40, 1], [1, 0.6, 0]),
        zIndex: 10,
      };
    },
    in(t) {
      const e = easeOutExpo(t);
      const z  = interpolate(e, [0, 1], [2200,    0]);
      const ry = interpolate(e, [0, 1], [ -28,    0]);
      const s  = interpolate(e, [0, 1], [ 0.04, 1.0]);
      return {
        transform: `perspective(${PERSP}px) translateZ(${z}px) rotateY(${ry}deg) scale(${s})`,
        blur:    interpolate(t, [0, 0.68, 1], [20, 6, 0]),
        opacity: interpolate(t, [0, 0.08, 1], [0,  1, 1]),
        zIndex: 5,
      };
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CAM3D WRAPPER
// Applies enter / exit 3D camera moves to a scene.
//   enterType / exitType  — key into CAM{}
//   totalFrames           — total frames this Sequence runs
//   transitionDur         — how many frames each transition occupies
// ─────────────────────────────────────────────────────────────────────────────
function Cam3D({ enterType, exitType, totalFrames, transitionDur = TRANS_DUR, children }) {
  const frame = useCurrentFrame();

  let transform = 'none';
  let blur = 0;
  let opacity = 1;
  let zIndex = 1;

  const inEnd  = enterType ? transitionDur : 0;
  const outStart = exitType ? totalFrames - transitionDur : totalFrames;

  if (enterType && frame < inEnd) {
    const t = frame / inEnd;
    const r = CAM[enterType].in(t);
    transform = r.transform;
    blur      = r.blur;
    opacity   = r.opacity;
    zIndex    = r.zIndex;
  } else if (exitType && frame >= outStart) {
    const t = (frame - outStart) / transitionDur;
    const r = CAM[exitType].out(Math.min(1, t));
    transform = r.transform;
    blur      = r.blur;
    opacity   = r.opacity;
    zIndex    = r.zIndex;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex,
        transform,
        filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none',
        opacity,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Ken Burns — camera move within each scene (subtle, cinematic)
function KenBurns({ src, zoom = [1.05, 1.0], panX = [0, 0], panY = [0, -1.5], duration }) {
  const frame = useCurrentFrame();
  const t = easeInOutCubic(Math.min(1, frame / duration));
  const scale = interpolate(t, [0, 1], zoom);
  const tx    = interpolate(t, [0, 1], panX);
  const ty    = interpolate(t, [0, 1], panY);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Img
        src={src}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}

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
      <circle cx={x} cy={y-size*0.55} r={size*0.11} fill={color} />
      <line x1={x-size*0.32} y1={y-size*0.28} x2={x+size*0.32} y2={y-size*0.28} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={x} y1={y-size*0.42} x2={x} y2={y+size*0.22}  stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={x} y1={y+size*0.22} x2={x-size*0.12} y2={y+size*0.60} stroke={color} strokeWidth={sw*0.85} strokeLinecap="round" />
      <line x1={x} y1={y+size*0.22} x2={x+size*0.12} y2={y+size*0.60} stroke={color} strokeWidth={sw*0.85} strokeLinecap="round" />
    </g>
  );
}

// Animated text line — slides up + fades in
function TextLine({ frame, startFrame, text, style }) {
  const op  = interpolate(frame, [startFrame, startFrame+28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ty  = interpolate(easeOutCubic(Math.max(0, Math.min(1, (frame - startFrame) / 28))), [0, 1], [30, 0]);
  return (
    <div style={{ opacity: op, transform: `translateY(${ty}px)`, ...style }}>
      {text}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 1 — HOOK  (S1_START to S1_START+S1_DUR)
// ─────────────────────────────────────────────────────────────────────────────
function SceneHook() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#010108' }}>
      <KenBurns src={staticFile('art-hook.jpg')} zoom={[1.0, 1.10]} panX={[0, 2]} panY={[0, -1.5]} duration={S1_DUR} />
      <Overlay opacity={0.36} />

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:26, padding:'0 80px' }}>
        <TextLine frame={frame} startFrame={8}
          text={'"One man went to heaven…'}
          style={{ fontSize:70, fontFamily:'Georgia,serif', color:GOLD, textAlign:'center', fontStyle:'italic', lineHeight:1.25,
                   textShadow:'0 4px 40px rgba(0,0,0,0.9),0 0 50px rgba(201,168,76,0.4)' }}
        />
        <TextLine frame={frame} startFrame={22}
          text={'without ever going to church."'}
          style={{ fontSize:70, fontFamily:'Georgia,serif', color:LIGHT, textAlign:'center', fontStyle:'italic', lineHeight:1.25,
                   textShadow:'0 4px 40px rgba(0,0,0,0.9),0 0 25px rgba(245,230,200,0.3)' }}
        />
        <TextLine frame={frame} startFrame={55}
          text={'— Luke 23:43'}
          style={{ marginTop:18, fontSize:34, fontFamily:'Georgia,serif', color:'rgba(245,230,200,0.8)', letterSpacing:3,
                   textShadow:'0 2px 16px rgba(0,0,0,0.95)' }}
        />
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2 — THREE CROSSES  (S2_START … )
// ─────────────────────────────────────────────────────────────────────────────
function SceneCrosses() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crosses spring-enter after the 3D camera transition clears
  const crossSp = spring({ frame: Math.max(0, frame - TRANS_DUR), fps, config: { damping: 160, stiffness: 70 } });
  const cs  = interpolate(crossSp, [0, 1], [0.7, 1.0]);
  const cop = interpolate(frame, [TRANS_DUR, TRANS_DUR + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Dynamic overlay: slightly lightens as scene progresses
  const ov = interpolate(frame, [TRANS_DUR, S2_DUR], [0.52, 0.34], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#08040a' }}>
      <KenBurns src={staticFile('art-golgotha.jpg')} zoom={[1.06, 1.0]} panX={[1.5, -1.5]} panY={[0, 1]} duration={S2_DUR} />
      <Overlay opacity={ov} />

      {/* SVG crosses + figures */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position:'absolute', inset:0 }}>
        <defs>
          <radialGradient id="divG" cx="50%" cy="44%" r="28%">
            <stop offset="0%"   stopColor={GOLD}  stopOpacity={0.30 * cop} />
            <stop offset="100%" stopColor={GOLD}  stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#divG)" />
        <g transform={`translate(960,540) scale(${cs}) translate(-960,-540)`} opacity={cop}>
          <Cross x={440}  y={780} w={80}  h={175} />
          <Figure x={440}  y={705} size={185} color="rgba(55,25,8,0.95)" />
          <Cross x={960}  y={745} w={100} h={200} />
          <Figure x={960}  y={660} size={215} color={`rgba(201,168,76,${cop})`} />
          <Cross x={1480} y={780} w={80}  h={175} />
          <Figure x={1480} y={705} size={185} color="rgba(55,25,8,0.95)" />
        </g>
      </svg>

      <div style={{ position:'absolute', bottom:72, left:0, right:0, display:'flex', flexDirection:'column', alignItems:'center', gap:18, padding:'0 120px' }}>
        <TextLine frame={frame} startFrame={TRANS_DUR + 28}
          text="He had no good works. No baptism."
          style={{ fontSize:44, fontFamily:'Georgia,serif', color:LIGHT, textAlign:'center', textShadow:'0 3px 24px rgba(0,0,0,0.98)' }}
        />
        <TextLine frame={frame} startFrame={TRANS_DUR + 68}
          text="Only seconds left to live."
          style={{ fontSize:44, fontFamily:'Georgia,serif', color:LIGHT, textAlign:'center', textShadow:'0 3px 24px rgba(0,0,0,0.98)' }}
        />
        <TextLine frame={frame} startFrame={TRANS_DUR + 108}
          text="Just one honest cry."
          style={{ fontSize:52, fontFamily:'Georgia,serif', color:GOLD, fontStyle:'italic', textAlign:'center', textShadow:'0 3px 24px rgba(0,0,0,0.98)' }}
        />
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 3 — THE CRY  (S3_START … )
// ─────────────────────────────────────────────────────────────────────────────
function SceneCry() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse  = spring({ frame: Math.max(0, frame - TRANS_DUR), fps, config: { damping: 200, stiffness: 120 } });
  const pScale = interpolate(pulse, [0, 1], [0.90, 1.0]);

  const quoteOp = interpolate(frame, [TRANS_DUR+5, TRANS_DUR+35],  [0, 1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  const replyOp = interpolate(frame, [TRANS_DUR+75, TRANS_DUR+105],[0, 1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });

  return (
    <AbsoluteFill style={{ background: '#040002' }}>
      <KenBurns src={staticFile('art-darkness.jpg')} zoom={[1.0, 1.12]} panX={[0, 0]} panY={[0, -2.5]} duration={S3_DUR} />
      <Overlay opacity={interpolate(frame, [TRANS_DUR, S3_DUR], [0.22, 0.38], { extrapolateRight:'clamp' })} />

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:50, padding:'0 100px' }}>
        <div style={{ opacity:quoteOp, transform:`scale(${pScale})`,
                      background:'rgba(8,0,0,0.72)', border:'2px solid rgba(160,40,40,0.72)',
                      borderRadius:18, padding:'36px 70px', textAlign:'center',
                      boxShadow:'0 0 50px rgba(120,0,0,0.35),inset 0 0 30px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize:24, fontFamily:'Georgia,serif', color:'rgba(235,200,190,0.65)', marginBottom:14, letterSpacing:4, textTransform:'uppercase' }}>
            The Thief Said:
          </div>
          <div style={{ fontSize:58, fontFamily:'Georgia,serif', color:LIGHT, fontStyle:'italic', lineHeight:1.35,
                        textShadow:'0 0 20px rgba(255,200,180,0.25)' }}>
            "Jesus, remember me."
          </div>
        </div>

        <div style={{ opacity:replyOp,
                      background:'rgba(0,0,0,0.72)', border:'2px solid rgba(201,168,76,0.68)',
                      borderRadius:18, padding:'36px 70px', textAlign:'center',
                      boxShadow:'0 0 50px rgba(201,168,76,0.18),inset 0 0 30px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize:24, fontFamily:'Georgia,serif', color:'rgba(201,168,76,0.75)', marginBottom:14, letterSpacing:4, textTransform:'uppercase' }}>
            Jesus Answered:
          </div>
          <div style={{ fontSize:58, fontFamily:'Georgia,serif', color:GOLD, fontStyle:'italic', lineHeight:1.38,
                        textShadow:'0 0 30px rgba(201,168,76,0.45)' }}>
            "Today you will be with me<br />in Paradise."
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 4 — CLOSING MESSAGE  (S4_START … )
// ─────────────────────────────────────────────────────────────────────────────
function SceneClose() {
  const frame = useCurrentFrame();

  const overlayOp = interpolate(frame, [TRANS_DUR, S4_DUR], [0.55, 0.12], { extrapolateRight:'clamp' });
  const rayOp     = interpolate(frame, [TRANS_DUR, S4_DUR], [0.04, 0.16], { extrapolateRight:'clamp' });

  return (
    <AbsoluteFill style={{ background: '#040608' }}>
      <KenBurns src={staticFile('art-paradise.jpg')} zoom={[1.10, 1.0]} panX={[0, 0]} panY={[-2.5, 0]} duration={S4_DUR} />
      <Overlay opacity={overlayOp} />

      {/* Animated god-ray fan blended over the image */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080"
           style={{ position:'absolute', inset:0, mixBlendMode:'screen' }}>
        {Array.from({ length: 16 }, (_, i) => {
          const a = Math.PI/2 + (i - 8) * 0.16;
          const L = 950, hw = 0.017;
          const pulse = Math.sin(frame * 0.06 + i * 0.7) * 0.3 + 0.7;
          return (
            <polygon key={i}
              points={`960,375 ${960+Math.cos(a-hw)*L},${375+Math.sin(a-hw)*L} ${960+Math.cos(a+hw)*L},${375+Math.sin(a+hw)*L}`}
              fill={`rgba(255,228,130,${(rayOp * pulse).toFixed(3)})`}
            />
          );
        })}
      </svg>

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:30, padding:'0 120px' }}>
        <TextLine frame={frame} startFrame={TRANS_DUR+8}
          text="No church. No rituals. No earned merit."
          style={{ fontSize:36, fontFamily:'Georgia,serif', color:'rgba(245,230,200,0.85)',
                   textAlign:'center', letterSpacing:4, textTransform:'uppercase',
                   textShadow:'0 2px 20px rgba(0,0,0,0.95)' }}
        />
        <TextLine frame={frame} startFrame={TRANS_DUR+48}
          text={<>Salvation is a gift,<br />not a reward.</>}
          style={{ fontSize:82, fontFamily:'Georgia,serif', color:GOLD,
                   textAlign:'center', fontStyle:'italic', fontWeight:'bold', lineHeight:1.2,
                   textShadow:'0 4px 40px rgba(0,0,0,0.85),0 0 70px rgba(201,168,76,0.55)' }}
        />
        <TextLine frame={frame} startFrame={TRANS_DUR+100}
          text="— Ephesians 2:8"
          style={{ fontSize:32, fontFamily:'Georgia,serif', color:'rgba(245,230,200,0.7)',
                   fontStyle:'italic', textShadow:'0 2px 16px rgba(0,0,0,0.95)' }}
        />
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 5 — CTA  (S5_START … 900)
// ─────────────────────────────────────────────────────────────────────────────
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp  = spring({ frame: Math.max(0, frame - TRANS_DUR), fps, config: { damping: 150, stiffness: 90 } });
  const cs  = interpolate(sp, [0, 1], [0.85, 1.0]);

  return (
    <AbsoluteFill style={{ background: '#030610' }}>
      <KenBurns src={staticFile('art-dawn.jpg')} zoom={[1.0, 1.08]} panX={[0, 0]} panY={[1.5, 0]} duration={S5_DUR} />
      <Overlay opacity={interpolate(frame, [TRANS_DUR, S5_DUR], [0.52, 0.38], { extrapolateRight:'clamp' })} />

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32 }}>
        <div style={{
          opacity: interpolate(frame, [TRANS_DUR, TRANS_DUR+28], [0, 1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' }),
          transform: `scale(${cs})`,
          fontSize:54, fontFamily:'Georgia,serif', color:LIGHT, textAlign:'center', lineHeight:1.4, padding:'0 120px',
          textShadow:'0 3px 24px rgba(0,0,0,0.92)',
        }}>
          Tag someone who needs this grace.
        </div>
        <TextLine frame={frame} startFrame={TRANS_DUR+38}
          text="#GraceAlone  #ThiefOnTheCross"
          style={{ fontSize:36, fontFamily:'Georgia,serif', color:'rgba(201,168,76,0.92)',
                   fontStyle:'italic', letterSpacing:2, textShadow:'0 2px 14px rgba(0,0,0,0.88)' }}
        />
        <div style={{
          opacity: interpolate(frame, [TRANS_DUR+60, TRANS_DUR+80], [0, 1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' }),
          marginTop:14, width:88, height:4, background:GOLD, borderRadius:2,
          boxShadow:`0 0 22px ${GOLD}`,
        }} />
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPOSITION
// A single `perspective` container wraps every scene so that all 3D transforms
// share the same vanishing point — exactly how After Effects handles its
// 3D camera with multiple layers.
// ─────────────────────────────────────────────────────────────────────────────
export function ThiefOnTheCross() {
  return (
    <AbsoluteFill
      style={{
        background: '#000',
        perspective: `${PERSP}px`,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/*
       * Each Sequence overlaps the next by TRANS_DUR frames.
       * Cam3D applies the correct enter/exit 3D camera move to each scene.
       *
       *  S1 → S2  : zpush   (camera flies THROUGH scene 1 into scene 2)
       *  S2 → S3  : yspin   (horizontal 3D door flip)
       *  S3 → S4  : xtilt   (camera cranes UP, heaven tilts into view)
       *  S4 → S5  : orbit   (camera dolly-back orbit, dawn sweeps in)
       */}

      <Sequence from={S1_START} durationInFrames={S1_DUR}>
        <Cam3D exitType="zpush" totalFrames={S1_DUR}>
          <SceneHook />
        </Cam3D>
      </Sequence>

      <Sequence from={S2_START} durationInFrames={S2_DUR}>
        <Cam3D enterType="zpush" exitType="yspin" totalFrames={S2_DUR}>
          <SceneCrosses />
        </Cam3D>
      </Sequence>

      <Sequence from={S3_START} durationInFrames={S3_DUR}>
        <Cam3D enterType="yspin" exitType="xtilt" totalFrames={S3_DUR}>
          <SceneCry />
        </Cam3D>
      </Sequence>

      <Sequence from={S4_START} durationInFrames={S4_DUR}>
        <Cam3D enterType="xtilt" exitType="orbit" totalFrames={S4_DUR}>
          <SceneClose />
        </Cam3D>
      </Sequence>

      <Sequence from={S5_START} durationInFrames={S5_DUR}>
        <Cam3D enterType="orbit" totalFrames={S5_DUR}>
          <SceneCTA />
        </Cam3D>
      </Sequence>
    </AbsoluteFill>
  );
}
