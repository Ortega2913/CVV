import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../constants";

interface BibleVerseProps {
  verse: string;
  reference: string;
  /** "center" floats the card mid-screen; "lower" anchors it above the narrator bar */
  position?: "center" | "lower";
  /** Frame at which the card animates in. Default 0 */
  delayIn?: number;
}

/**
 * Elegant gold-bordered Bible verse card.
 * Springs in, glows, and fades out with the scene.
 */
export const BibleVerse: React.FC<BibleVerseProps> = ({
  verse,
  reference,
  position = "center",
  delayIn = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const adj = Math.max(0, frame - delayIn);

  const entrance = spring({
    frame: adj,
    fps,
    config: { damping: 22, stiffness: 70, mass: 1.2 },
  });

  const opacity = interpolate(
    frame,
    [delayIn, delayIn + 25, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(entrance, [0, 1], [0.94, 1]);
  const ty = interpolate(entrance, [0, 1], [24, 0]);

  // Slow ambient glow pulse
  const glow = interpolate(
    (frame % 90) / 90,
    [0, 0.5, 1],
    [0.25, 0.55, 0.25]
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: position === "center" ? "center" : "flex-end",
        alignItems: "center",
        padding: position === "lower" ? "0 120px 180px" : "0 120px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${ty}px)`,
          textAlign: "center",
          maxWidth: 1160,
          padding: "52px 72px",
          background:
            "linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(5,12,24,0.96) 100%)",
          border: `1px solid ${COLORS.gold}`,
          borderRadius: 6,
          boxShadow: `0 0 60px rgba(212,175,55,${glow}), 0 8px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.15)`,
        }}
      >
        {/* Top ornament */}
        <GoldRule />

        <p
          style={{
            fontFamily: FONTS.serif,
            fontSize: 40,
            color: COLORS.goldLight,
            fontStyle: "italic",
            lineHeight: 1.75,
            margin: "24px 0 20px",
            textShadow: `0 0 32px rgba(240,208,96,0.35)`,
            letterSpacing: "0.01em",
          }}
        >
          "{verse}"
        </p>

        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 20,
            color: COLORS.gold,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {reference}
        </p>

        <GoldRule style={{ marginTop: 24, marginBottom: 0 }} />
      </div>
    </AbsoluteFill>
  );
};

const GoldRule: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      width: 80,
      height: 1,
      background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
      margin: "0 auto",
      ...style,
    }}
  />
);
