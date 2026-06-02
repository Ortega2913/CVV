import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Particles } from "../Particles";

// 13–19s (frames 390–569): Sunrise breaking through clouds + woman compassionate
export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const sunRise = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const cloudShift = frame * 0.3;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Sky gradient – dark to sunrise warm */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg,
            hsl(220, 55%, ${5 + sunRise * 10}%) 0%,
            hsl(${220 - sunRise * 170}, ${30 + sunRise * 60}%, ${8 + sunRise * 22}%) 45%,
            hsl(${30 + sunRise * 10}, ${60 + sunRise * 30}%, ${12 + sunRise * 30}%) 75%,
            hsl(40, 90%, ${sunRise * 40}%) 100%)`,
        }}
      />

      {/* Sun orb rising */}
      <div
        style={{
          position: "absolute",
          bottom: `${15 + sunRise * 20}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,240,180,${sunRise * 0.95}) 0%, rgba(255,180,60,${sunRise * 0.7}) 40%, transparent 70%)`,
          boxShadow: `0 0 ${sunRise * 80}px rgba(255,200,60,${sunRise * 0.5})`,
        }}
      />

      {/* Sun rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: `${15 + sunRise * 20 + 8}%`,
            left: "50%",
            width: `${sunRise * 45}%`,
            height: 2,
            background: `linear-gradient(to right, rgba(255,200,60,${sunRise * 0.35}), transparent)`,
            transformOrigin: "left center",
            transform: `translateY(-50%) rotate(${angle + frame * 0.1}deg)`,
            filter: "blur(3px)",
          }}
        />
      ))}

      {/* Cloud layers */}
      <div
        style={{
          position: "absolute",
          bottom: `${25 + sunRise * 5}%`,
          left: `${-cloudShift % 120}px`,
          right: 0,
          height: "18%",
          background: `linear-gradient(to bottom, transparent, rgba(${50 + sunRise * 80}, ${40 + sunRise * 60}, ${30 + sunRise * 20}, ${0.3 + sunRise * 0.2}), transparent)`,
          filter: "blur(25px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: `${30 + sunRise * 3}%`,
          left: 0,
          right: `${-cloudShift * 0.7 % 80}px`,
          height: "12%",
          background: `linear-gradient(to bottom, transparent, rgba(${80 + sunRise * 100}, ${70 + sunRise * 80}, ${60 + sunRise * 30}, ${0.25 + sunRise * 0.15}), transparent)`,
          filter: "blur(20px)",
        }}
      />

      {/* Ocean waves */}
      {[0, 1, 2].map((i) => {
        const waveOffset = Math.sin(frame * 0.03 + i * 2.1) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: `${8 + i * 4 + waveOffset * 0.05}%`,
              left: 0,
              right: 0,
              height: "4%",
              background: `linear-gradient(to bottom, transparent, rgba(${40 + sunRise * 60}, ${60 + sunRise * 80}, ${150 + sunRise * (-50)}, ${0.15 + i * 0.08}), transparent)`,
              filter: "blur(10px)",
              transform: `translateX(${waveOffset + i * 20}px)`,
            }}
          />
        );
      })}

      {/* Warm woman face glow overlay */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 620,
          borderRadius: "250px 250px 180px 180px",
          background: `radial-gradient(ellipse at 50% 30%, rgba(210,155,80,${0.15 + sunRise * 0.1}) 0%, transparent 65%)`,
        }}
      />

      <Particles count={40} warm={true} />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 70% at 50% 40%, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
