import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FilmGrain } from "./FilmGrain";
import { Vignette } from "./Vignette";

interface SceneContainerProps {
  children: React.ReactNode;
  /** Fade-in duration in frames. Default 20 */
  fadeIn?: number;
  /** Fade-out duration in frames. Default 20 */
  fadeOut?: number;
  showGrain?: boolean;
  showVignette?: boolean;
  vignetteIntensity?: number;
  /** Extra overlay colour on top of children (e.g. colour grade wash) */
  colorGrade?: string;
}

/**
 * Wraps every scene with:
 *  • Fade in / out
 *  • Cinematic vignette
 *  • Film grain
 *  • Optional colour-grade wash
 */
export const SceneContainer: React.FC<SceneContainerProps> = ({
  children,
  fadeIn = 20,
  fadeOut = 20,
  showGrain = true,
  showVignette = true,
  vignetteIntensity = 0.65,
  colorGrade,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: "#000" }}>
      {children}

      {/* Warm cinematic colour grade: subtle golden-blue wash */}
      <AbsoluteFill
        style={{
          background:
            colorGrade ??
            "linear-gradient(160deg, rgba(20,10,0,0.18) 0%, rgba(0,10,30,0.22) 100%)",
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      />

      {showVignette && <Vignette intensity={vignetteIntensity} />}
      {showGrain && <FilmGrain />}
    </AbsoluteFill>
  );
};
