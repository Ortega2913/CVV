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
  src: string;
  direction?: KenBurnsDirection;
  /** Override the duration used for the motion (defaults to scene duration) */
  durationInFrames?: number;
  /** Extra CSS applied to the <img> element */
  style?: React.CSSProperties;
}

/**
 * Wraps a static image with a slow Ken Burns motion (zoom / pan).
 * Drop this inside any scene to bring still photos to life.
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
  let tx = 0; // percentage translateX
  let ty = 0;

  switch (direction) {
    case "zoom-in":
      scale = interpolate(t, [0, 1], [1.0, 1.14]);
      break;
    case "zoom-out":
      scale = interpolate(t, [0, 1], [1.14, 1.0]);
      break;
    case "pan-left":
      scale = 1.12;
      tx = interpolate(t, [0, 1], [3, -3]);
      break;
    case "pan-right":
      scale = 1.12;
      tx = interpolate(t, [0, 1], [-3, 3]);
      break;
    case "pan-up":
      scale = 1.12;
      ty = interpolate(t, [0, 1], [3, -3]);
      break;
    case "pan-down":
      scale = 1.12;
      ty = interpolate(t, [0, 1], [-3, 3]);
      break;
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: "center center",
          willChange: "transform",
          ...style,
        }}
      />
    </AbsoluteFill>
  );
};
