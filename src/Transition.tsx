import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface TransitionProps {
  startFrame: number;
  durationFrames?: number;
  type?: "crossdissolve" | "lightbloom" | "particle-burst" | "fade-warm";
}

export const Transition: React.FC<TransitionProps> = ({
  startFrame,
  durationFrames = 18,
  type = "crossdissolve",
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
  );

  // Peak in middle
  const peak = interpolate(
    frame,
    [startFrame, startFrame + durationFrames / 2, startFrame + durationFrames],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (peak <= 0) return null;

  if (type === "lightbloom") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, rgba(255,220,120,${peak * 0.85}), rgba(255,180,60,${peak * 0.5}) 50%, transparent 80%)`,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
    );
  }

  if (type === "particle-burst") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(255,200,80,${peak * 0.7}), rgba(200,140,40,${peak * 0.4}) 40%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
    );
  }

  if (type === "fade-warm") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(180,120,40,${peak * 0.6})`,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
    );
  }

  // Default crossdissolve – white flash
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `rgba(255,255,255,${peak * 0.5})`,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
};
