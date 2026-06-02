import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../constants";
import { SceneContainer } from "./SceneContainer";
import { NarratorText } from "./NarratorText";
import { KenBurnsImage } from "./KenBurnsImage";

interface SplitScreenProps {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  narrator: string;
}

/**
 * Side-by-side split screen.
 * Left panel (ancient) fades in first; right panel (modern) follows.
 * A gold divider line separates them.
 */
export const SplitScreen: React.FC<SplitScreenProps> = ({
  leftSrc,
  rightSrc,
  leftLabel = "Ancient",
  rightLabel = "Today",
  narrator,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Left panel fades in from left
  const leftX = interpolate(frame, [0, 35], [-120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftOpacity = interpolate(frame, [0, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Right panel fades in from right with a delay
  const rightX = interpolate(frame, [20, 55], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightOpacity = interpolate(frame, [20, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider grows from top
  const dividerH = interpolate(frame, [10, 60], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneContainer vignetteIntensity={0.5}>
      <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
        {/* Left panel — ancient */}
        <div
          style={{
            width: "50%",
            height: "100%",
            overflow: "hidden",
            opacity: leftOpacity,
            transform: `translateX(${leftX}px)`,
          }}
        >
          <KenBurnsImage src={leftSrc} direction="pan-right" />

          {/* Dark overlay for label */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background:
                "linear-gradient(transparent, rgba(0,0,0,0.8))",
            }}
          />
          <PanelLabel text={leftLabel} side="left" />
        </div>

        {/* Right panel — modern */}
        <div
          style={{
            width: "50%",
            height: "100%",
            overflow: "hidden",
            opacity: rightOpacity,
            transform: `translateX(${rightX}px)`,
          }}
        >
          <KenBurnsImage src={rightSrc} direction="pan-left" />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background:
                "linear-gradient(transparent, rgba(0,0,0,0.8))",
            }}
          />
          <PanelLabel text={rightLabel} side="right" />
        </div>
      </AbsoluteFill>

      {/* Gold centre divider */}
      <div
        style={{
          position: "absolute",
          top: `${(100 - dividerH) / 2}%`,
          left: "calc(50% - 1px)",
          width: 2,
          height: `${dividerH}%`,
          background: `linear-gradient(to bottom, transparent, ${COLORS.gold}, transparent)`,
          boxShadow: `0 0 12px ${COLORS.gold}`,
          pointerEvents: "none",
        }}
      />

      <NarratorText text={narrator} />
    </SceneContainer>
  );
};

const PanelLabel: React.FC<{ text: string; side: "left" | "right" }> = ({
  text,
  side,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 24,
      [side === "left" ? "left" : "right"]: 24,
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: COLORS.gold,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
    }}
  >
    {text}
  </div>
);
