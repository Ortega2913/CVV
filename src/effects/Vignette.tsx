import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Soft cinematic vignette — darkens the corners to focus the eye centre-frame,
 * which matters a lot on tall vertical video.
 */
export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.7,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,${strength}) 100%)`,
      }}
    />
  );
};
