import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "./constants";

export function SceneTransition({ triggerFrame, duration = 20 }: { triggerFrame: number; duration?: number }) {
  const frame = useCurrentFrame();
  const half = duration / 2;

  const opacity = interpolate(
    frame,
    [triggerFrame - half, triggerFrame, triggerFrame + half],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (opacity === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: COLORS.bg,
        opacity,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}

export function SceneWrapper({
  children,
  startFrame,
  endFrame,
}: {
  children: React.ReactNode;
  startFrame: number;
  endFrame: number;
}) {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [endFrame - 15, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {children}
    </div>
  );
}
