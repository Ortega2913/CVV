import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EASE } from "../theme";

/**
 * After-Effects-style warm light-leak wipe used between scenes.
 *
 * The overlay ramps up to a hot peak at the midpoint of its own sequence and
 * back down, while a coloured gradient sweeps across the frame — exactly the
 * "soft glow fade + whoosh" feel of a film transition. Because it lives in its
 * own <Sequence>, it sits on top of BOTH outgoing and incoming scenes and
 * masks the cut.
 */
export const LightLeak: React.FC<{
  warm?: boolean;
  bright?: boolean;
  flip?: boolean;
}> = ({ warm = true, bright = false, flip = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mid = durationInFrames / 2;

  // 0 -> 1 -> 0 envelope, eased for a soft bloom.
  const env = interpolate(
    frame,
    [0, mid, durationInFrames],
    [0, bright ? 1 : 0.85, 0],
    {
      easing: EASE.soft,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Sweep position of the leak across the frame.
  const sweep = interpolate(frame, [0, durationInFrames], flip ? [120, -20] : [-20, 120], {
    easing: EASE.cinematic,
  });

  const hot = warm ? "255,210,150" : "200,220,255";
  const edge = warm ? "255,150,70" : "120,170,255";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Full-frame warm bloom */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: env,
          background: `radial-gradient(circle at ${sweep}% 40%, rgba(${hot},0.95) 0%, rgba(${edge},0.5) 25%, rgba(0,0,0,0) 60%)`,
        }}
      />
      {/* Diagonal whoosh streak */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: env * 0.9,
          background: `linear-gradient(105deg, rgba(0,0,0,0) ${sweep - 30}%, rgba(${hot},0.8) ${sweep}%, rgba(0,0,0,0) ${sweep + 30}%)`,
          filter: "blur(8px)",
        }}
      />
      {/* Brief white flash at the very peak for the cut */}
      <AbsoluteFill
        style={{
          backgroundColor: "#fff7e8",
          opacity: interpolate(
            frame,
            [mid - 3, mid, mid + 3],
            [0, bright ? 0.55 : 0.4, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ),
        }}
      />
    </AbsoluteFill>
  );
};
