import React from "react";
import { AbsoluteFill } from "remotion";

interface VignetteProps {
  /** 0–1 opacity of the dark edges. Default 0.65 */
  intensity?: number;
  /** Radial gradient center stop (where image is clear). Default 45% */
  clearRadius?: string;
}

/** Cinematic vignette: dark edges that focus the eye on the center. */
export const Vignette: React.FC<VignetteProps> = ({
  intensity = 0.65,
  clearRadius = "45%",
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, transparent ${clearRadius}, rgba(0,0,0,${intensity}) 100%)`,
      pointerEvents: "none",
    }}
  />
);
