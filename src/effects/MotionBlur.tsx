import React from "react";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { MOTION_BLUR_SAMPLES } from "../theme";

/**
 * Thin wrapper around @remotion/motion-blur's CameraMotionBlur, gated by the
 * MOTION_BLUR_SAMPLES config. When samples <= 1 it renders children directly
 * (no blur, no extra render cost) — handy for fast preview renders.
 */
export const MotionBlur: React.FC<{
  shutterAngle?: number;
  children: React.ReactNode;
}> = ({ shutterAngle = 160, children }) => {
  if (MOTION_BLUR_SAMPLES <= 1) {
    return <>{children}</>;
  }
  return (
    <CameraMotionBlur shutterAngle={shutterAngle} samples={MOTION_BLUR_SAMPLES}>
      {children}
    </CameraMotionBlur>
  );
};
