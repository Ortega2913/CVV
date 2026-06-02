import React, { useMemo } from "react";
import { interpolate } from "remotion";
import { COLORS } from "../theme";
import { DrawnPath } from "./DrawnPath";

const PHI = (1 + Math.sqrt(5)) / 2;

// Fibonacci square tiling (the "golden rectangle" construction grid).
function buildSquares(n: number) {
  const fib = [1, 1];
  for (let i = 2; i < n; i++) fib.push(fib[i - 1] + fib[i - 2]);
  let minX = 0,
    minY = 0,
    maxX = fib[0],
    maxY = fib[0];
  const squares = [{ x: 0, y: 0, s: fib[0] }];
  for (let i = 1; i < n; i++) {
    const s = fib[i];
    const dir = (i - 1) % 4;
    if (dir === 0) {
      squares.push({ x: maxX, y: minY, s });
      maxX += s;
    } else if (dir === 1) {
      squares.push({ x: minX, y: minY - s, s });
      minY -= s;
    } else if (dir === 2) {
      squares.push({ x: minX - s, y: minY, s });
      minX -= s;
    } else {
      squares.push({ x: minX, y: maxY, s });
      maxY += s;
    }
  }
  return { squares, minX, minY, maxX, maxY };
}

// Elegant smooth logarithmic golden spiral curve.
function buildSpiralPath(
  cx: number,
  cy: number,
  startR: number,
  turns: number,
): string {
  const b = Math.log(PHI) / (Math.PI / 2);
  const steps = 240;
  const totalTheta = turns * 2 * Math.PI;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * totalTheta;
    const r = startR * Math.exp(-b * theta);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}

export const GoldenSpiral: React.FC<{
  progress: number; // 0..1 draws the spiral
  size?: number;
  stroke?: string;
  showGrid?: boolean;
}> = ({ progress, size = 360, stroke = COLORS.gold, showGrid = true }) => {
  const { squares, minX, minY, maxX, maxY } = useMemo(() => buildSquares(9), []);
  const w = maxX - minX;
  const h = maxY - minY;
  const pad = 0.5;
  const viewBox = `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`;

  // Spiral eye sits near the smallest squares; tuned to look centered.
  const cx = 0.5;
  const cy = 0.5;
  const startR = Math.max(w, h) * 0.95;

  const gridOpacity = interpolate(progress, [0, 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={size}
      height={size * (h / w)}
      viewBox={viewBox}
      style={{ overflow: "visible" }}
    >
      {showGrid &&
        squares.map((sq, i) => (
          <rect
            key={i}
            x={sq.x}
            y={sq.y}
            width={sq.s}
            height={sq.s}
            fill="none"
            stroke={COLORS.gridStrong}
            strokeWidth={0.06}
            opacity={gridOpacity}
          />
        ))}
      {showGrid && (
        <rect
          x={minX}
          y={minY}
          width={w}
          height={h}
          fill="none"
          stroke={COLORS.goldDeep}
          strokeWidth={0.08}
          opacity={gridOpacity * 0.6}
        />
      )}
      <DrawnPath
        progress={progress}
        d={buildSpiralPath(cx, cy, startR, 3.6)}
        fill="none"
        stroke={stroke}
        strokeWidth={0.16}
        strokeLinecap="round"
      />
    </svg>
  );
};
