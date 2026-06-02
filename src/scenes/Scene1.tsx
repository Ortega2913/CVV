import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Particles } from "../Particles";

// 0–3s (frames 0–89): Dark bedroom silhouette + woman speaking
export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slow subtle pulse on dim lamp
  const lampPulse = 0.08 + Math.sin(frame * 0.06) * 0.03;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Dark bedroom background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, #050818 0%, #0a0f2e 40%, #08091a 100%)",
          opacity: bgOpacity,
        }}
      />

      {/* Dim blue lamp glow top-right corner */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(80,120,255,${lampPulse * 2}) 0%, transparent 70%)`,
        }}
      />

      {/* Silhouette – person sitting on bed, head in hands */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 280,
        }}
      >
        {/* Body */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 110,
            height: 200,
            background: "rgba(5,8,24,0.95)",
            borderRadius: "50px 50px 0 0",
          }}
        />
        {/* Head bowed down */}
        <div
          style={{
            position: "absolute",
            bottom: 175,
            left: "50%",
            transform: "translateX(-50%) rotate(25deg)",
            width: 70,
            height: 75,
            background: "rgba(5,8,24,0.95)",
            borderRadius: "50%",
          }}
        />
        {/* Arms raised to face */}
        <div
          style={{
            position: "absolute",
            bottom: 155,
            left: "18%",
            width: 55,
            height: 12,
            background: "rgba(5,8,24,0.95)",
            borderRadius: 6,
            transform: "rotate(-35deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 155,
            right: "18%",
            width: 55,
            height: 12,
            background: "rgba(5,8,24,0.95)",
            borderRadius: 6,
            transform: "rotate(35deg)",
          }}
        />
        {/* Bed surface */}
        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 300,
            height: 18,
            background: "rgba(20,25,60,0.7)",
            borderRadius: 4,
          }}
        />
      </div>

      {/* Very faint floor reflection */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: "linear-gradient(to top, rgba(10,15,46,0.6) 0%, transparent 100%)",
        }}
      />

      {/* Woman face – warm close-up overlay blended in */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 38%, rgba(180,120,60,0.18) 0%, transparent 70%)",
        }}
      />

      <Particles count={25} warm={false} />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
