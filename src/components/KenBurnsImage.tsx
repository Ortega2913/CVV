import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type KenBurnsDirection =
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "pan-up"
  | "pan-down";

interface KenBurnsImageProps {
  /** Unsplash / CDN URL  — OR —  a CSS gradient string (works offline) */
  src: string;
  direction?: KenBurnsDirection;
  durationInFrames?: number;
  style?: React.CSSProperties;
}

/**
 * Ken Burns motion on either a real image URL or a CSS gradient string.
 * Falls back gracefully to the gradient path when network access is blocked.
 */
export const KenBurnsImage: React.FC<KenBurnsImageProps> = ({
  src,
  direction = "zoom-in",
  durationInFrames,
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: sceneFrames } = useVideoConfig();
  const total = durationInFrames ?? sceneFrames;

  const t = interpolate(frame, [0, total], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let scale = 1;
  let tx = 0;
  let ty = 0;

  switch (direction) {
    case "zoom-in":  scale = interpolate(t, [0, 1], [1.0, 1.14]); break;
    case "zoom-out": scale = interpolate(t, [0, 1], [1.14, 1.0]); break;
    case "pan-left":  scale = 1.12; tx = interpolate(t, [0, 1], [ 3, -3]); break;
    case "pan-right": scale = 1.12; tx = interpolate(t, [0, 1], [-3,  3]); break;
    case "pan-up":    scale = 1.12; ty = interpolate(t, [0, 1], [ 3, -3]); break;
    case "pan-down":  scale = 1.12; ty = interpolate(t, [0, 1], [-3,  3]); break;
  }

  const transform = `scale(${scale}) translate(${tx}%, ${ty}%)`;
  const isGradient = src.startsWith("linear-gradient") || src.startsWith("radial-gradient");

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {isGradient ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: src,
            transform,
            transformOrigin: "center center",
            willChange: "transform",
            ...style,
          }}
        />
      ) : (
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform,
            transformOrigin: "center center",
            willChange: "transform",
            ...style,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
