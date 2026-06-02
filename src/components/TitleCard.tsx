import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, IMG } from "../constants";
import { KenBurnsImage } from "./KenBurnsImage";
import { SceneContainer } from "./SceneContainer";

/**
 * Epic title card: "Bible Lands Today — Clues to Prophecy"
 * Animated gold lines sweep in, titles spring up with a glow pulse.
 */
export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Series label springs in first
  const labelSpring = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 24, stiffness: 70 } });
  // Main title rises after
  const titleSpring = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 22, stiffness: 60 } });
  // Sub-title last
  const subSpring = spring({ frame: Math.max(0, frame - 42), fps, config: { damping: 22, stiffness: 60 } });

  const labelOpacity = interpolate(frame, [15, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [28, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOpacity   = interpolate(frame, [42, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gold rule sweeps in from center
  const ruleWidth = interpolate(frame, [20, 80], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient glow pulse
  const glow = 0.3 + 0.25 * Math.sin((frame / durationInFrames) * Math.PI * 4);

  return (
    <SceneContainer fadeIn={35} fadeOut={25} vignetteIntensity={0.75}>
      <KenBurnsImage src={IMG.JERUSALEM_DRONE} direction="zoom-out" />

      {/* Heavy dark overlay for title legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,12,28,0.65) 0%, rgba(10,22,40,0.82) 100%)",
        }}
      />

      {/* Particle glow circles */}
      <GlowParticles frame={frame} />

      {/* ── Content ── */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Top gold rule */}
        <div
          style={{
            width: ruleWidth,
            height: 1,
            background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
            marginBottom: 28,
            boxShadow: `0 0 16px ${COLORS.gold}`,
          }}
        />

        {/* Series label */}
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${interpolate(labelSpring, [0, 1], [20, 0])}px)`,
            fontFamily: FONTS.sans,
            fontSize: 17,
            color: COLORS.gold,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginBottom: 18,
            textShadow: `0 0 20px rgba(212,175,55,${glow})`,
          }}
        >
          Documentary Series
        </div>

        {/* Main title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: FONTS.serif,
              fontSize: 108,
              color: COLORS.cream,
              margin: "0 0 4px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textShadow: `0 0 80px rgba(212,175,55,${glow}), 0 4px 32px rgba(0,0,0,0.95)`,
            }}
          >
            Bible Lands Today
          </h1>
        </div>

        {/* Divider */}
        <div
          style={{
            opacity: subOpacity,
            width: 200,
            height: 1,
            background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
            margin: "18px auto",
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${interpolate(subSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <h2
            style={{
              fontFamily: FONTS.serif,
              fontSize: 56,
              color: COLORS.gold,
              margin: 0,
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "0.04em",
              textShadow: `0 0 40px rgba(212,175,55,${glow * 0.8})`,
            }}
          >
            Clues to Prophecy
          </h2>
        </div>

        {/* Bottom gold rule */}
        <div
          style={{
            width: ruleWidth,
            height: 1,
            background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
            marginTop: 28,
            boxShadow: `0 0 16px ${COLORS.gold}`,
          }}
        />
      </AbsoluteFill>
    </SceneContainer>
  );
};

/** Soft glowing ambient circles that drift slowly — particle-glow effect */
const GlowParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = [
    { cx: "20%", cy: "30%", r: 220, delay: 0 },
    { cx: "80%", cy: "70%", r: 180, delay: 20 },
    { cx: "50%", cy: "15%", r: 140, delay: 10 },
    { cx: "65%", cy: "85%", r: 160, delay: 30 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((p, i) => {
        const pulse =
          0.04 +
          0.025 *
            Math.sin(((frame + p.delay * 3) / 90) * Math.PI * 2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.cx,
              top: p.cy,
              width: p.r * 2,
              height: p.r * 2,
              marginLeft: -p.r,
              marginTop: -p.r,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(212,175,55,${pulse}) 0%, transparent 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
