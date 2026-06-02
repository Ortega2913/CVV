import React from "react";
import { COLORS } from "../theme";
import { DrawnPath } from "./DrawnPath";

type OProps = { progress: number; size?: number; stroke?: string };

// --- Classical column (Corinthian-ish) line sketch ---
export const ColumnSketch: React.FC<OProps> = ({
  progress,
  size = 220,
  stroke = COLORS.inkSoft,
}) => (
  <svg width={size} height={size * 2.6} viewBox="0 0 100 260" fill="none">
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* capital */}
      <DrawnPath progress={progress} d="M20 40 Q50 18 80 40 L80 50 L20 50 Z" stroke={stroke} strokeWidth={1.6} />
      <DrawnPath progress={progress} d="M28 40 Q34 30 30 28 M72 40 Q66 30 70 28" stroke={stroke} strokeWidth={1.2} />
      {/* shaft with flutes */}
      <DrawnPath progress={progress} d="M30 50 L30 230 M42 50 L42 230 M50 50 L50 230 M58 50 L58 230 M70 50 L70 230" stroke={stroke} strokeWidth={0.9} />
      <DrawnPath progress={progress} d="M28 50 L28 230 M72 50 L72 230" stroke={stroke} strokeWidth={1.4} />
      {/* base */}
      <DrawnPath progress={progress} d="M22 230 L78 230 L82 246 L18 246 Z" stroke={stroke} strokeWidth={1.6} />
    </g>
  </svg>
);

// --- Renaissance round arch ---
export const ArchSketch: React.FC<OProps> = ({
  progress,
  size = 300,
  stroke = COLORS.inkSoft,
}) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 300 330" fill="none">
    <g strokeLinecap="round" strokeLinejoin="round">
      <DrawnPath progress={progress} d="M40 320 L40 150 A110 110 0 0 1 260 150 L260 320" stroke={stroke} strokeWidth={2} />
      <DrawnPath progress={progress} d="M58 320 L58 158 A92 92 0 0 1 242 158 L242 320" stroke={stroke} strokeWidth={1.3} />
      <DrawnPath progress={progress} d="M150 48 L150 40" stroke={stroke} strokeWidth={1.2} />
      {/* keystone */}
      <DrawnPath progress={progress} d="M138 50 L162 50 L168 72 L132 72 Z" stroke={COLORS.gold} strokeWidth={1.6} />
    </g>
  </svg>
);

// --- Compass / divider (the designer's tool) ---
export const CompassSketch: React.FC<OProps> = ({
  progress,
  size = 160,
  stroke = COLORS.inkSoft,
}) => (
  <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
    <g strokeLinecap="round" strokeLinejoin="round">
      <DrawnPath progress={progress} d="M80 24 L52 138" stroke={stroke} strokeWidth={2.2} />
      <DrawnPath progress={progress} d="M80 24 L108 138" stroke={stroke} strokeWidth={2.2} />
      <DrawnPath progress={progress} d="M80 24 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0" stroke={COLORS.gold} strokeWidth={1.8} />
      <DrawnPath progress={progress} d="M52 138 A40 40 0 0 0 108 138" stroke={COLORS.gold} strokeWidth={1.2} />
    </g>
  </svg>
);

// --- Laurel branch ---
export const Laurel: React.FC<OProps & { flip?: boolean }> = ({
  progress,
  size = 200,
  stroke = COLORS.gold,
  flip,
}) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 100 140"
    fill="none"
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
  >
    <g strokeLinecap="round">
      <DrawnPath progress={progress} d="M70 130 Q40 90 50 20" stroke={stroke} strokeWidth={2} />
      {new Array(7).fill(0).map((_, i) => {
        const t = i / 7;
        const y = 122 - t * 96;
        const x = 66 - t * 14;
        return (
          <DrawnPath
            key={i}
            progress={progress}
            d={`M${x} ${y} Q${x - 18} ${y - 6} ${x - 24} ${y + 8}`}
            stroke={stroke}
            strokeWidth={1.5}
          />
        );
      })}
    </g>
  </svg>
);

// --- Radiant halo (used behind sacred figures) ---
export const Halo: React.FC<{ progress: number; size?: number; rays?: number }> = ({
  progress,
  size = 360,
  rays = 24,
}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" fill="none">
    {new Array(rays).fill(0).map((_, i) => {
      const a = (i / rays) * Math.PI * 2;
      const r1 = 36;
      const r2 = 90;
      return (
        <DrawnPath
          key={i}
          progress={progress}
          d={`M${Math.cos(a) * r1} ${Math.sin(a) * r1} L${Math.cos(a) * r2} ${Math.sin(a) * r2}`}
          stroke={COLORS.goldLight}
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      );
    })}
    <DrawnPath progress={progress} d="M30 0 A30 30 0 1 0 -30 0 A30 30 0 1 0 30 0" stroke={COLORS.gold} strokeWidth={1.8} fill="none" />
  </svg>
);
