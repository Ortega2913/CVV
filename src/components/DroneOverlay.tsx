import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../constants";

interface DroneOverlayProps {
  /** Location label displayed in the lower-left corner */
  location?: string;
  /** Altitude label, e.g. "320m AGL" */
  altitude?: string;
  /** Show the subtle horizontal scan-line grid. Default true */
  showScanlines?: boolean;
}

/**
 * Cinematic drone/aerial UI overlay.
 * Adds corner brackets, telemetry readout, and optional scan-line texture.
 */
export const DroneOverlay: React.FC<DroneOverlayProps> = ({
  location,
  altitude,
  showScanlines = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle blink for the recording dot
  const dotOpacity = frame % 60 < 45 ? 1 : 0;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {/* ── Scan-line texture ── */}
      {showScanlines && (
        <AbsoluteFill
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Corner brackets ── */}
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <CornerBracket key={c} corner={c} />
      ))}

      {/* ── Location tag (bottom-left) ── */}
      {location && (
        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 52,
            fontFamily: FONTS.sans,
            fontSize: 16,
            color: COLORS.gold,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textShadow: "0 1px 8px rgba(0,0,0,0.9)",
          }}
        >
          {location}
          {altitude && (
            <span style={{ color: COLORS.cream, marginLeft: 16, opacity: 0.7 }}>
              {altitude}
            </span>
          )}
        </div>
      )}

      {/* ── Recording dot (top-right) ── */}
      <div
        style={{
          position: "absolute",
          top: 52,
          right: 52,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: FONTS.sans,
          fontSize: 14,
          color: COLORS.cream,
          letterSpacing: "0.12em",
          opacity: dotOpacity,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#E74C3C",
            boxShadow: "0 0 8px rgba(231,76,60,0.8)",
          }}
        />
        REC
      </div>
    </AbsoluteFill>
  );
};

type Corner = "tl" | "tr" | "bl" | "br";

const CornerBracket: React.FC<{ corner: Corner }> = ({ corner }) => {
  const size = 36;
  const thickness = 2;
  const offset = 36;
  const color = COLORS.gold;

  const pos: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    ...(corner === "tl" && { top: offset, left: offset }),
    ...(corner === "tr" && { top: offset, right: offset }),
    ...(corner === "bl" && { bottom: offset, left: offset }),
    ...(corner === "br" && { bottom: offset, right: offset }),
  };

  const borderStyle = `${thickness}px solid ${color}`;

  return (
    <div
      style={{
        ...pos,
        borderTop: corner.startsWith("t") ? borderStyle : "none",
        borderBottom: corner.startsWith("b") ? borderStyle : "none",
        borderLeft: corner.endsWith("l") ? borderStyle : "none",
        borderRight: corner.endsWith("r") ? borderStyle : "none",
        opacity: 0.75,
      }}
    />
  );
};
