import React from "react";

/**
 * Morphable blob shape.
 *
 * The shape is defined by N radii sampled evenly around a circle. Because every
 * state shares the same point count, interpolating one radii array into another
 * produces a TRUE shape morph (no popping) — the core of our morph transition.
 *
 * Points are smoothed into a closed path with the Catmull-Rom → cubic-Bézier
 * conversion, so blobs stay buttery and organic.
 */

export type BlobShape = {
  radii: number[]; // length N, multipliers around the ring
  /** Ellipse stretch — >1 on rx makes a wide pill. */
  rx: number;
  ry: number;
  /** Whole-shape rotation in radians. */
  rotation: number;
};

const TWO_PI = Math.PI * 2;

/** Linear interpolation of two equal-length blob states. */
export const lerpShape = (a: BlobShape, b: BlobShape, t: number): BlobShape => {
  const n = Math.max(a.radii.length, b.radii.length);
  const radii = new Array(n).fill(0).map((_, i) => {
    const ra = a.radii[i % a.radii.length];
    const rb = b.radii[i % b.radii.length];
    return ra + (rb - ra) * t;
  });
  return {
    radii,
    rx: a.rx + (b.rx - a.rx) * t,
    ry: a.ry + (b.ry - a.ry) * t,
    rotation: a.rotation + (b.rotation - a.rotation) * t,
  };
};

/** Build a smooth closed SVG path from a blob state, centred at (cx,cy). */
export const blobPath = (
  shape: BlobShape,
  cx: number,
  cy: number,
  base: number
): string => {
  const n = shape.radii.length;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * TWO_PI + shape.rotation;
    const r = base * shape.radii[i];
    pts.push([
      cx + Math.cos(ang) * r * shape.rx,
      cy + Math.sin(ang) * r * shape.ry,
    ]);
  }

  // Catmull-Rom -> cubic Bézier (closed loop).
  const p = (i: number) => pts[(i + n) % n];
  let d = `M ${p(0)[0].toFixed(2)} ${p(0)[1].toFixed(2)} `;
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(
      2
    )} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  return d + "Z";
};

/** Named blob presets (all 8-point so they morph into one another). */
export const SHAPES: Record<string, BlobShape> = {
  circle: { radii: [1, 1, 1, 1, 1, 1, 1, 1], rx: 1, ry: 1, rotation: 0 },
  blob: {
    radii: [1.05, 0.84, 1.12, 0.9, 1.04, 0.82, 1.14, 0.92],
    rx: 1,
    ry: 1,
    rotation: 0,
  },
  star: {
    radii: [1.15, 0.55, 1.15, 0.55, 1.15, 0.55, 1.15, 0.55],
    rx: 1,
    ry: 1,
    rotation: -Math.PI / 2,
  },
  pill: { radii: [1, 1, 1, 1, 1, 1, 1, 1], rx: 2.2, ry: 0.78, rotation: 0 },
  pillWide: { radii: [1, 1, 1, 1, 1, 1, 1, 1], rx: 3.1, ry: 0.7, rotation: 0 },
};

export const Blob: React.FC<{
  shape: BlobShape;
  cx: number;
  cy: number;
  base: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  filter?: string;
}> = ({
  shape,
  cx,
  cy,
  base,
  fill = "#ffce4f",
  stroke,
  strokeWidth = 0,
  opacity = 1,
  filter,
}) => {
  return (
    <path
      d={blobPath(shape, cx, cy, base)}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      style={{ filter }}
    />
  );
};
