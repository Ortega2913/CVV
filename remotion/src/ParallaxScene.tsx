import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { useNullCamera } from "./useNullCamera";
import { Warrior } from "./characters/Warrior";
import { Sage }    from "./characters/Sage";

// ────────────────────────────────────────────────────────────────────
// DEPTH CONSTANTS  (z in CSS 3D: positive = toward viewer)
// ────────────────────────────────────────────────────────────────────
const Z_FAR_BG       = -1100;  // distant star-field / sky
const Z_MID_FOG      =  -650;  // mid fog layer
const Z_SAGE         =  -700;  // background character
const Z_DEBRIS_MID   =  -350;  // floating particles between chars
const Z_WARRIOR      =     0;  // foreground character (reference plane)
const Z_NEAR_DEBRIS  =   200;  // near-camera particles

// ────────────────────────────────────────────────────────────────────
// STAR FIELD
// ────────────────────────────────────────────────────────────────────
function Stars() {
  return (
    <>
      {Array.from({ length: 80 }).map((_, i) => {
        const x = ((i * 137.508) % 100).toFixed(2);
        const y = ((i * 97.31)   % 100).toFixed(2);
        const s = (1 + (i % 3) * 0.5).toFixed(1);
        const o = (0.2 + (i % 5) * 0.1).toFixed(2);
        return (
          <div key={i} style={{
            position: "absolute",
            left:   `${x}%`,
            top:    `${y}%`,
            width:   s,
            height:  s,
            borderRadius: "50%",
            background: "white",
            opacity: +o,
          }} />
        );
      })}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────
// FLOATING PARTICLES  (mixed warm / cool colours, different depths)
// ────────────────────────────────────────────────────────────────────
interface ParticleLayerProps {
  frame: number;
  count: number;
  zDepth: number;
  color: string;
  speedY: number;
  seed: number;
  opacity: number;
}

function ParticleLayer({ frame, count, zDepth, color, speedY, seed, opacity }: ParticleLayerProps) {
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateZ(${zDepth}px)` }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = ((i * seed + 11) % 100).toFixed(1);
        const rawY = ((i * (seed * 0.7) + frame * speedY) % 110) - 10;
        const sz  = 1 + (i % 3);
        const op  = opacity * (0.5 + (i % 3) * 0.25);
        return (
          <div key={i} style={{
            position: "absolute",
            left:   `${x}%`,
            top:    `${rawY.toFixed(1)}%`,
            width:   sz,
            height:  sz,
            borderRadius: "50%",
            background:  color,
            opacity:     op,
            boxShadow:  `0 0 ${sz * 3}px ${color}`,
          }} />
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// MAIN PARALLAX SCENE
// ────────────────────────────────────────────────────────────────────
export const ParallaxScene: React.FC = () => {
  const frame               = useCurrentFrame();
  const { fps }             = useVideoConfig();
  const camera              = useNullCamera(frame, fps);

  // ── World transform: inverse of camera null position ─────────────
  // Moving the world opposite to camera direction simulates camera movement.
  // This is the null-camera-controller pattern from After Effects:
  //   camera.z > 0  →  world shifts toward viewer  →  scene "zooms in"
  const worldTransform = [
    `rotateX(${-camera.rotX}deg)`,
    `rotateY(${-camera.rotY}deg)`,
    `translate3d(${-camera.x}px, ${-camera.y}px, ${camera.z}px)`,
  ].join(" ");

  // ── Depth-of-field blur per character plane ───────────────────────
  // As camera moves from Z=0 toward Z=-700, the warrior goes out-of-focus
  // and the sage comes into focus.
  const fgBlur = interpolate(camera.z, [0, 150, 720], [0, 1.5, 9], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });
  const bgBlur = interpolate(camera.z, [0, 380, 720], [7, 2.5, 0], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // ── Warm → cool colour grade tracks camera position ──────────────
  const warmR = interpolate(camera.z, [0, 720], [70, 0],  { extrapolateRight: "clamp" });
  const warmG = interpolate(camera.z, [0, 720], [15, 0],  { extrapolateRight: "clamp" });
  const coolB = interpolate(camera.z, [0, 720], [0,  55], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#020108", overflow: "hidden" }}>

      {/* ── 3D PERSPECTIVE CONTAINER ("camera lens") ─────────────── */}
      <AbsoluteFill
        style={{
          perspective:       `${camera.fov}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* ── WORLD SPACE — all 3D content lives here ──────────── */}
        {/* Inverse-transformed by the null camera state           */}
        <AbsoluteFill
          style={{
            transformStyle:  "preserve-3d",
            transform:       worldTransform,
            transformOrigin: "50% 50%",
          }}
        >
          {/* FAR BACKGROUND: stars + horizon glow */}
          <div style={{
            position: "absolute", inset: 0,
            transform: `translateZ(${Z_FAR_BG}px)`,
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 62% 52%, rgba(55,35,110,0.55) 0%, rgba(15,8,40,0.35) 45%, transparent 70%)",
            }} />
            <Stars />
          </div>

          {/* MID FOG LAYER */}
          <div style={{
            position: "absolute", inset: 0,
            transform: `translateZ(${Z_MID_FOG}px)`,
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 75%, rgba(18,8,38,0.65) 0%, transparent 80%)",
            }} />
          </div>

          {/* ══ BACKGROUND CHARACTER: SAGE (far plane) ══════════ */}
          <div style={{
            position:  "absolute",
            left:      "63%",        // slightly right of centre
            top:       "46%",
            transform: `translate(-50%, -50%) translateZ(${Z_SAGE}px)`,
            filter:    `blur(${bgBlur}px)`,
          }}>
            <Sage frame={frame} />
          </div>

          {/* Sage aura on ground */}
          <div style={{
            position: "absolute",
            left: "60%", top: "75%",
            transform: `translate(-50%, -50%) translateZ(${Z_SAGE + 20}px)`,
            width: 200, height: 60,
            background: "radial-gradient(ellipse, rgba(60,80,255,0.28) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />

          {/* MID DEBRIS: floating particles between both characters */}
          <ParticleLayer frame={frame} count={22}
            zDepth={Z_DEBRIS_MID} color="#4466FF"
            speedY={0.18} seed={137.5} opacity={0.35} />
          <ParticleLayer frame={frame} count={16}
            zDepth={Z_DEBRIS_MID - 80} color="#FF7744"
            speedY={0.14} seed={97.3}  opacity={0.28} />

          {/* Ground fog (FG area) */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "38%",
            transform: `translateZ(-90px)`,
            background: "linear-gradient(to top, rgba(12,4,25,0.85), transparent)",
          }} />

          {/* ══ FOREGROUND CHARACTER: WARRIOR (reference plane) ═ */}
          <div style={{
            position:  "absolute",
            left:      "37%",        // slightly left of centre
            top:       "50%",
            transform: `translate(-50%, -50%) translateZ(${Z_WARRIOR}px)`,
            filter:    `blur(${fgBlur}px)`,
          }}>
            <Warrior frame={frame} />
          </div>

          {/* Warrior fire glow on ground */}
          <div style={{
            position: "absolute",
            left: "37%", top: "80%",
            transform: `translate(-50%, -50%) translateZ(${Z_WARRIOR - 10}px)`,
            width: 180, height: 50,
            background: "radial-gradient(ellipse, rgba(255,70,0,0.22) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />

          {/* NEAR DEBRIS: embers closest to camera */}
          <ParticleLayer frame={frame} count={10}
            zDepth={Z_NEAR_DEBRIS} color="#FF8840"
            speedY={0.45} seed={53.7} opacity={0.30} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── FLAT / 2D OVERLAY ELEMENTS (not in 3D space) ─────────── */}

      {/* Cinematic letterbox */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "7.5%",
        background: "rgba(0,0,0,0.88)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "7.5%",
        background: "rgba(0,0,0,0.88)",
      }} />

      {/* Lens vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.72) 100%)",
      }} />

      {/* Colour grade overlay (warm FG → cool BG) */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `rgba(${warmR.toFixed(0)},${warmG.toFixed(0)},${coolB.toFixed(0)},0.12)`,
        mixBlendMode: "screen",
      }} />

      {/* Subtle lens flare streak during push */}
      {camera.z > 100 && camera.z < 650 && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `linear-gradient(125deg,
            transparent 40%,
            rgba(200,180,255,${interpolate(camera.z,[100,380,650],[0,0.04,0])}) 55%,
            transparent 70%)`,
          mixBlendMode: "screen",
        }} />
      )}

      {/* Null camera debug readout */}
      <div style={{
        position: "absolute", bottom: "9%", left: 18,
        color: "rgba(255,255,255,0.28)",
        fontSize: 10, fontFamily: "monospace", lineHeight: 1.6,
        pointerEvents: "none",
      }}>
        NULL CAM<br />
        z: {camera.z.toFixed(0).padStart(4)}&nbsp; x: {camera.x.toFixed(0).padStart(4)}&nbsp; y: {camera.y.toFixed(0).padStart(4)}<br />
        rotY: {camera.rotY.toFixed(2)}°&nbsp; rotX: {camera.rotX.toFixed(2)}°<br />
        DOF fg:{fgBlur.toFixed(1)}px&nbsp; bg:{bgBlur.toFixed(1)}px
      </div>
    </AbsoluteFill>
  );
};
