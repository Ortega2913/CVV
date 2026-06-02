import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../constants";

interface NarratorTextProps {
  text: string;
  /** Delay before text fades in (frames). Default 25 */
  delayIn?: number;
  /** How many frames before scene end to start fading out. Default 25 */
  holdOut?: number;
  /** Word or phrase to highlight in gold italic */
  highlight?: string;
  /** Scripture reference shown below the text in smaller gold type */
  verseRef?: string;
  fontSize?: number;
}

/**
 * Bottom-third narrator subtitle bar.
 * Fades in with a gentle upward drift. Highlighted words glow gold.
 */
export const NarratorText: React.FC<NarratorTextProps> = ({
  text,
  delayIn = 25,
  holdOut = 25,
  highlight,
  verseRef,
  fontSize = 34,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const adj = Math.max(0, frame - delayIn);
  const end = durationInFrames - delayIn;

  const opacity = interpolate(
    adj,
    [0, 22, end - holdOut, end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const ty = interpolate(adj, [0, 22], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderText = () => {
    if (!highlight) return text;
    const parts = text.split(highlight);
    return parts.map((part, i) => (
      <React.Fragment key={i}>
        {part}
        {i < parts.length - 1 && (
          <em
            style={{
              color: COLORS.goldLight,
              fontStyle: "italic",
              textShadow: `0 0 16px rgba(240,208,96,0.6)`,
            }}
          >
            {highlight}
          </em>
        )}
      </React.Fragment>
    ));
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 96px 56px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${ty}px)`,
          maxWidth: 1500,
          width: "100%",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Gradient scrim behind text */}
        <div
          style={{
            position: "absolute",
            inset: "-50px -100px -30px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 70%, transparent 100%)",
            borderRadius: 12,
            pointerEvents: "none",
          }}
        />

        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize,
            color: COLORS.cream,
            lineHeight: 1.65,
            margin: 0,
            textShadow:
              "0 2px 24px rgba(0,0,0,0.95), 0 0 48px rgba(0,0,0,0.8)",
            fontWeight: 300,
            letterSpacing: "0.015em",
            position: "relative",
          }}
        >
          {renderText()}
        </p>

        {verseRef && (
          <p
            style={{
              fontFamily: FONTS.serif,
              fontSize: 22,
              color: COLORS.gold,
              marginTop: 10,
              fontStyle: "italic",
              textShadow: "0 2px 12px rgba(0,0,0,0.95)",
              position: "relative",
              letterSpacing: "0.02em",
            }}
          >
            — {verseRef}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
