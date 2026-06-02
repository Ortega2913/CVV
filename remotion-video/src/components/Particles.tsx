import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

// Slow-floating gold dust motes — adds depth and a "leafing" atmosphere.
export const Particles: React.FC<{ count?: number; seed?: string }> = ({
  count = 36,
  seed = "dust",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const motes = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`${seed}-x-${i}`) * width,
        y: random(`${seed}-y-${i}`) * height,
        r: 1 + random(`${seed}-r-${i}`) * 3.2,
        speed: 0.15 + random(`${seed}-s-${i}`) * 0.5,
        amp: 12 + random(`${seed}-a-${i}`) * 40,
        phase: random(`${seed}-p-${i}`) * Math.PI * 2,
        baseOp: 0.12 + random(`${seed}-o-${i}`) * 0.4,
      })),
    [count, seed, width, height],
  );

  return (
    <AbsoluteFill>
      {motes.map((m, i) => {
        const t = frame / 30;
        const dx = Math.sin(t * m.speed + m.phase) * m.amp;
        const dy = -((frame * m.speed * 0.6) % (height + 60)) + m.y;
        const yy = ((dy % (height + 80)) + height + 80) % (height + 80) - 40;
        const op = m.baseOp * (0.6 + 0.4 * Math.sin(t * 1.3 + m.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x + dx,
              top: yy,
              width: m.r,
              height: m.r,
              borderRadius: "50%",
              background: COLORS.goldLight,
              opacity: op,
              filter: "blur(0.4px)",
              boxShadow: `0 0 ${m.r * 3}px ${COLORS.gold}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
