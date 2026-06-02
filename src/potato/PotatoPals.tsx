import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Blob, blobPath, lerpShape, SHAPES } from "./Blob";
import { Caption } from "./Caption";
import { Sparkles } from "./Sparkles";
import { Vignette } from "../effects/Vignette";
import { FilmGrain } from "../effects/FilmGrain";

const EASE = Easing.bezier(0.65, 0, 0.35, 1);
const FONT =
  "'Arial Rounded MT Bold', 'Poppins', 'Trebuchet MS', system-ui, sans-serif";

/* ----------------------------- Virtual camera ---------------------------- */
/**
 * A smooth, keyframed virtual camera over the footage: settle wide → push on
 * the cheerful potato → pan to the grumpy one as it frowns → pull back for the
 * reunion. A touch of sine "handheld" drift keeps it alive.
 */
const VirtualCamera: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 50, 110, 150, 185, 241],
    [1.06, 1.1, 1.18, 1.18, 1.2, 1.06],
    { easing: EASE, extrapolateRight: "clamp" }
  );
  const tx =
    interpolate(frame, [0, 50, 110, 150, 185, 241], [0, 26, 92, 92, -92, 0], {
      easing: EASE,
      extrapolateRight: "clamp",
    }) + Math.sin(frame * 0.05) * 4;
  const ty =
    interpolate(frame, [0, 110, 185, 241], [0, -22, -22, 0], {
      easing: EASE,
      extrapolateRight: "clamp",
    }) + Math.cos(frame * 0.04) * 3;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/* --------------------------- Intro morph reveal -------------------------- */
/** A brand-coloured blob that morphs + shrinks away to reveal the footage. */
const IntroMorph: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (frame > 22) return null;

  const t = interpolate(frame, [0, 22], [0, 1], { easing: EASE });
  const shape = lerpShape(SHAPES.star, SHAPES.blob, t);
  const base = interpolate(t, [0, 1], [width * 1.1, 0]);
  const opacity = interpolate(frame, [0, 14, 22], [1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <Blob shape={shape} cx={width / 2} cy={height / 2} base={base} fill="#ffb429" />
      </svg>
    </AbsoluteFill>
  );
};

/* --------------------- Title that morphs into a badge -------------------- */
/**
 * "POTATO PALS" enters big and centred (blob morphs star→pill), then MORPHS
 * and travels into a small persistent corner logo (pill→circle) — the headline
 * morph transition tying the title to a lasting brand badge.
 */
const TitleBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Phase progress: 0..1 big-in (0–18), travel/morph to corner (44–66).
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 110, mass: 0.9 } });
  const toCorner = interpolate(frame, [44, 66], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Position + scale lerp from centre hero to top-left badge.
  const cx = interpolate(toCorner, [0, 1], [width / 2, 150]);
  const cy = interpolate(toCorner, [0, 1], [430, 130]);
  const scale = interpolate(toCorner, [0, 1], [1, 0.34]) * interpolate(enter, [0, 1], [0.5, 1]);

  // Shape morph pill -> circle as it docks.
  const shape = lerpShape(SHAPES.pill, SHAPES.circle, toCorner);
  const bigOpacity = interpolate(frame, [44, 54], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const smallOpacity = interpolate(frame, [54, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: enter,
      }}
    >
      <svg width={760} height={300} viewBox="0 0 760 300" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }}>
        <defs>
          <filter id="titleShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="10" stdDeviation="16" floodOpacity="0.4" />
          </filter>
        </defs>
        <path d={blobPath(shape, 380, 150, 110)} fill="#ff6f3c" style={{ filter: "url(#titleShadow)" }} />
        <path d={blobPath(shape, 380, 138, 102)} fill="rgba(255,255,255,0.16)" />
      </svg>

      {/* Big hero wordmark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          opacity: bigOpacity,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 96,
          lineHeight: 0.92,
          color: "#fff",
          textAlign: "center",
          textShadow: "0 4px 0 rgba(0,0,0,0.18)",
          letterSpacing: -2,
          whiteSpace: "nowrap",
        }}
      >
        POTATO
        <br />
        PALS
      </div>

      {/* Small docked badge label */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          opacity: smallOpacity,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 150,
          color: "#fff",
          textAlign: "center",
          textShadow: "0 4px 0 rgba(0,0,0,0.18)",
          letterSpacing: -4,
          whiteSpace: "nowrap",
        }}
      >
        PP
      </div>
    </div>
  );
};

/* ------------------------------- Composition ----------------------------- */
export const PotatoPals: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1208" }}>
      {/* Footage under the smooth virtual camera (audio included) */}
      <VirtualCamera>
        <OffthreadVideo
          src={staticFile("footage/potatoes.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </VirtualCamera>

      {/* Warm cinematic-ish grade overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,180,60,0.10) 0%, rgba(0,0,0,0) 45%, rgba(60,30,0,0.35) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Floating hearts + sparkles */}
      <Sparkles count={16} />

      {/* Title morphing into a corner badge */}
      <TitleBadge />

      {/* Mood-reactive captions (each morphs in from a shape) */}
      <Caption text="best buds" appearAt={64} disappearAt={108} top="84%" bg="#ffce4f" emoji="heart" />
      <Caption
        text="someone's grumpy"
        appearAt={120}
        disappearAt={168}
        top="84%"
        bg="#9fd0ff"
        textColor="#143b5e"
        fromShape={SHAPES.blob}
      />
      <Caption text="friends again!" appearAt={182} disappearAt={236} top="84%" bg="#ffce4f" emoji="heart" />

      {/* Intro morph reveal sits on top of the first frames */}
      <IntroMorph />

      {/* Light film grade for cohesion */}
      <Vignette strength={0.5} />
      <FilmGrain opacity={0.05} />
    </AbsoluteFill>
  );
};
