import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, IMG } from "../constants";
import { SceneContainer } from "./SceneContainer";
import { NarratorText } from "./NarratorText";

interface Region {
  id: string;
  label: string;
  subLabel?: string;
  cx: number; // percent of 1920
  cy: number; // percent of 1080
  radius: number;
  color: string;
  delayFrames: number;
  isTarget?: boolean; // Israel (center of prophecy)
}

// Approximate positions on a Middle-East-centred 1920×1080 canvas
const REGIONS: Region[] = [
  { id: "israel",  label: "Israel",         cx: 50.5, cy: 54,   radius: 14, color: "#4A90D9", delayFrames: 15,  isTarget: true },
  { id: "syria",   label: "Syria",           cx: 54,   cy: 43,   radius: 13, color: "#E74C3C", delayFrames: 45  },
  { id: "lebanon", label: "Lebanon",         cx: 50,   cy: 45,   radius: 10, color: "#E67E22", delayFrames: 55  },
  { id: "jordan",  label: "Jordan",          cx: 54,   cy: 57,   radius: 14, color: "#27AE60", delayFrames: 50  },
  { id: "egypt",   label: "Egypt",           cx: 41,   cy: 62,   radius: 18, color: "#F39C12", delayFrames: 65  },
  { id: "turkey",  label: "Turkey (Togarmah)", cx: 48, cy: 29,   radius: 18, color: "#E67E22", delayFrames: 80  },
  { id: "russia",  label: "Russia",  subLabel:"(Far North)", cx: 58, cy: 12, radius: 22, color: "#9B59B6", delayFrames: 95  },
  { id: "iran",    label: "Persia",  subLabel:"(Iran)",      cx: 72, cy: 47, radius: 22, color: "#C0392B", delayFrames: 110 },
  { id: "libya",   label: "Libya",           cx: 34,   cy: 52,   radius: 16, color: "#C0392B", delayFrames: 125 },
];

// Lines connecting threat nations to Israel
const THREAT_LINES = ["russia", "iran", "turkey", "libya"];

interface MapAnimationProps {
  narrator: string;
}

export const MapAnimation: React.FC<MapAnimationProps> = ({ narrator }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <SceneContainer>
      {/* Subtle dark map-tinted background */}
      <AbsoluteFill style={{ background: "#0D1B2A" }} />

      {/* Faint topographic grid */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.06 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke={COLORS.gold} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </AbsoluteFill>

      {/* Map SVG */}
      <AbsoluteFill>
        <svg
          viewBox="0 0 1920 1080"
          width="1920"
          height="1080"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Threat lines from nations → Israel */}
          {REGIONS.filter((r) => THREAT_LINES.includes(r.id)).map((r) => {
            const israel = REGIONS.find((x) => x.id === "israel")!;
            const lineProgress = interpolate(
              frame,
              [r.delayFrames + 30, r.delayFrames + 90],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const x1 = (r.cx / 100) * 1920;
            const y1 = (r.cy / 100) * 1080;
            const x2 = (israel.cx / 100) * 1920;
            const y2 = (israel.cy / 100) * 1080;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const xEnd = x1 + dx * lineProgress;
            const yEnd = y1 + dy * lineProgress;
            return (
              <line
                key={r.id + "-line"}
                x1={x1}
                y1={y1}
                x2={xEnd}
                y2={yEnd}
                stroke={r.color}
                strokeWidth="2"
                strokeDasharray="8 4"
                opacity="0.55"
              />
            );
          })}

          {/* Region circles + labels */}
          {REGIONS.map((r) => {
            const s = spring({
              frame: Math.max(0, frame - r.delayFrames),
              fps,
              config: { damping: 20, stiffness: 90 },
            });
            const scale = interpolate(s, [0, 1], [0, 1]);
            const opacity = interpolate(
              frame,
              [r.delayFrames, r.delayFrames + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const cx = (r.cx / 100) * 1920;
            const cy = (r.cy / 100) * 1080;

            // Pulse for Israel
            const pulse = r.isTarget
              ? r.radius + 6 * Math.sin((frame / 40) * Math.PI * 2)
              : r.radius;

            return (
              <g
                key={r.id}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                {/* Outer glow ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={pulse + 8}
                  fill="none"
                  stroke={r.color}
                  strokeWidth="1"
                  opacity="0.3"
                />
                {/* Main circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={pulse}
                  fill={r.color}
                  opacity={r.isTarget ? 0.95 : 0.75}
                />
                {/* Label */}
                <text
                  x={cx}
                  y={cy - pulse - 10}
                  textAnchor="middle"
                  fill={COLORS.cream}
                  fontSize={r.isTarget ? 20 : 16}
                  fontFamily={FONTS.sans}
                  fontWeight={r.isTarget ? "700" : "400"}
                  style={{ textShadow: "0 2px 8px #000" }}
                >
                  {r.label}
                </text>
                {r.subLabel && (
                  <text
                    x={cx}
                    y={cy - pulse - 10 + 18}
                    textAnchor="middle"
                    fill={COLORS.gold}
                    fontSize={13}
                    fontFamily={FONTS.sans}
                    fontStyle="italic"
                  >
                    {r.subLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Title overlay */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            opacity: interpolate(frame, [0, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p
            style={{
              fontFamily: FONTS.sans,
              fontSize: 15,
              color: COLORS.gold,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Ezekiel 38–39 · Psalm 83 · The Gog-Magog Coalition
          </p>
        </div>
      </AbsoluteFill>

      <NarratorText text={narrator} />
    </SceneContainer>
  );
};
