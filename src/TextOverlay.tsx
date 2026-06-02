import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

interface TextOverlayProps {
  text: string;
  startFrame: number;
  endFrame: number;
  position?: "center" | "lower-third";
  gold?: boolean;
  large?: boolean;
  emoji?: boolean;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  startFrame,
  endFrame,
  position = "lower-third",
  gold = false,
  large = false,
  emoji = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const fadeOut = interpolate(frame, [endFrame - 8, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  const scale = interpolate(frame, [startFrame, startFrame + 15], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const opacity = Math.min(fadeIn, fadeOut);
  if (opacity <= 0) return null;

  const bottom = position === "lower-third" ? "14%" : undefined;
  const top = position === "center" ? "50%" : undefined;
  const transform =
    position === "center"
      ? `translateY(-50%) scale(${scale})`
      : `scale(${scale})`;

  const fontSize = large ? 72 : 52;
  const glowColor = gold ? "rgba(255,200,60,0.8)" : "rgba(255,255,255,0.6)";
  const color = gold ? "#FFD700" : "#FFFFFF";

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        top,
        transform,
        opacity,
        padding: "0 60px",
        textAlign: "center",
        zIndex: 10,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize,
          fontWeight: 700,
          color,
          lineHeight: 1.3,
          textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 2px 2px 4px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.8)`,
          letterSpacing: emoji ? "normal" : "0.01em",
        }}
      >
        {text}
      </p>
    </div>
  );
};
