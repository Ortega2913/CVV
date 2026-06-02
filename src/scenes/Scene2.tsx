import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Particles } from "../Particles";

// 3–8s (frames 90–239): Tears + floating lyrics "You are not alone"
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const lyricOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const lyricFloat = Math.sin(frame * 0.04) * 12;
  const lyricScale = interpolate(frame, [20, 55], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
  });

  // Animated tear drops
  const tearPositions = [
    { x: "44%", delay: 0 },
    { x: "48%", delay: 18 },
    { x: "52%", delay: 9 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Deep blue-navy background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(175deg, #030610 0%, #0d1235 50%, #05080f 100%)",
        }}
      />

      {/* Soft warm face glow – simulates close-up woman */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 520,
          height: 640,
          borderRadius: "260px 260px 200px 200px",
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(200,140,70,0.22) 0%, rgba(160,100,40,0.12) 45%, transparent 70%)",
        }}
      />

      {/* Cheek highlight */}
      <div
        style={{
          position: "absolute",
          top: "32%",
          left: "30%",
          width: 160,
          height: 100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,180,100,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Tear drops */}
      {tearPositions.map((t, i) => {
        const dropY = ((frame - t.delay) * 4) % 300;
        const visible = frame > t.delay;
        return visible ? (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${38 + dropY * 0.1}%`,
              left: t.x,
              width: 8,
              height: 16,
              background: "rgba(160,200,255,0.7)",
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              boxShadow: "0 0 8px rgba(140,180,255,0.5)",
              opacity: Math.min(1, (frame - t.delay) / 10) * (1 - dropY / 300),
            }}
          />
        ) : null;
      })}

      {/* Floating lyric text */}
      <div
        style={{
          position: "absolute",
          top: `${54 + lyricFloat / 10}%`,
          left: 0,
          right: 0,
          opacity: lyricOpacity,
          transform: `scale(${lyricScale})`,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Georgia', serif",
            fontSize: 58,
            fontStyle: "italic",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.35,
            textShadow:
              "0 0 25px rgba(255,210,80,0.9), 0 0 50px rgba(255,180,40,0.6), 0 2px 4px rgba(0,0,0,0.95)",
            letterSpacing: "0.01em",
          }}
        >
          "You are not alone"
        </p>
      </div>

      {/* Blurred worship-hands background hint */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          height: 180,
          opacity: 0.12,
          background:
            "radial-gradient(ellipse, rgba(255,200,80,0.6) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <Particles count={35} warm={true} />

      {/* Golden bloom at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "20%",
          background: "linear-gradient(to top, rgba(180,120,20,0.12) 0%, transparent 100%)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 45%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
