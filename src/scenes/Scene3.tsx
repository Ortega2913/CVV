import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Particles } from "../Particles";

// 8–13s (frames 240–389): Divine golden arms of light wrapping around person
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const armSpread = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const glowIntensity = interpolate(frame, [0, 45, 90], [0, 1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const faceReveal = interpolate(frame, [50, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Background transitions from dark to warm */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(170deg,
            hsl(230, 40%, ${4 + glowIntensity * 4}%) 0%,
            hsl(30, 60%, ${3 + glowIntensity * 8}%) 60%,
            hsl(40, 80%, ${2 + glowIntensity * 6}%) 100%)`,
        }}
      />

      {/* Central radiant burst */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500 * glowIntensity,
          height: 500 * glowIntensity,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,200,80,${glowIntensity * 0.35}) 0%, rgba(255,150,30,${glowIntensity * 0.18}) 40%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Left arm of light */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: `${20 - armSpread * 8}%`,
          width: `${armSpread * 32}%`,
          height: "10%",
          background:
            "linear-gradient(to right, transparent, rgba(255,190,60,0.55), rgba(255,210,80,0.7))",
          borderRadius: "0 50% 50% 0",
          transform: "rotate(-15deg)",
          filter: "blur(8px)",
          transformOrigin: "left center",
        }}
      />

      {/* Right arm of light */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          right: `${20 - armSpread * 8}%`,
          width: `${armSpread * 32}%`,
          height: "10%",
          background:
            "linear-gradient(to left, transparent, rgba(255,190,60,0.55), rgba(255,210,80,0.7))",
          borderRadius: "50% 0 0 50%",
          transform: "rotate(15deg)",
          filter: "blur(8px)",
          transformOrigin: "right center",
        }}
      />

      {/* Person silhouette receiving the hug */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 220,
        }}
      >
        {/* Body */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 160,
            background: `rgba(15, 10, 5, ${0.85 - faceReveal * 0.3})`,
            borderRadius: "40px 40px 0 0",
          }}
        />
        {/* Head */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 65,
            background: `rgba(${180 + faceReveal * 30}, ${120 + faceReveal * 60}, ${60 + faceReveal * 40}, ${0.5 + faceReveal * 0.4})`,
            borderRadius: "50%",
            boxShadow: `0 0 ${faceReveal * 30}px rgba(255,200,80,${faceReveal * 0.6})`,
          }}
        />
      </div>

      {/* Warm light rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            width: `${glowIntensity * 55}%`,
            height: 3,
            background: `linear-gradient(to right, rgba(255,190,60,${glowIntensity * 0.4}), transparent)`,
            transformOrigin: "left center",
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            filter: "blur(4px)",
          }}
        />
      ))}

      <Particles count={50} warm={true} />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 65% at 50% 40%, transparent 35%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
