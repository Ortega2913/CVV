import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

// Cream "renaissance paper" backdrop: warm radial wash, faint engineering grid,
// and a soft vignette. A very slow drift keeps it alive without distracting.
export const PaperBackground: React.FC<{ tint?: string }> = ({ tint }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 12;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 120% at ${50 + drift / 6}% 30%, ${
            tint ?? COLORS.paper
          } 0%, ${COLORS.paper2} 55%, ${COLORS.paper3} 100%)`,
        }}
      />
      {/* faint grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${drift}px ${-drift}px`,
          maskImage:
            "radial-gradient(120% 100% at 50% 50%, black 40%, transparent 90%)",
        }}
      />
      {/* paper grain */}
      <AbsoluteFill
        style={{
          opacity: 0.5,
          mixBlendMode: "multiply",
          background:
            "radial-gradient(60% 60% at 20% 20%, rgba(120,100,60,0.05), transparent 70%), radial-gradient(70% 70% at 85% 85%, rgba(120,100,60,0.06), transparent 70%)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 280px rgba(40,30,12,0.28)",
        }}
      />
    </AbsoluteFill>
  );
};
