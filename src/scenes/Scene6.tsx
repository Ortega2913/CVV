import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Particles } from "../Particles";

// 24–30s (frames 720–899): Person walks from darkness into light + CTA
export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 180;

  const walkProgress = interpolate(frame, [0, duration * 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const lightBrightness = interpolate(frame, [0, duration * 0.6], [0.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bouncing heart for CTA
  const heartBounce = interpolate(
    frame % 30,
    [0, 8, 16, 24, 30],
    [0, -14, 0, -7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heartVisible = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Background: dark to glorious warm gold */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(170deg,
            hsl(220, 50%, ${3 + lightBrightness * 5}%) 0%,
            hsl(${200 - lightBrightness * 170}, ${20 + lightBrightness * 60}%, ${5 + lightBrightness * 25}%) 50%,
            hsl(40, 90%, ${lightBrightness * 40}%) 100%)`,
        }}
      />

      {/* Bright light portal at top */}
      <div
        style={{
          position: "absolute",
          top: "0%",
          left: "50%",
          transform: "translateX(-50%)",
          width: `${200 + lightBrightness * 500}px`,
          height: `${150 + lightBrightness * 400}px`,
          borderRadius: "0 0 60% 60%",
          background: `radial-gradient(ellipse, rgba(255,240,180,${lightBrightness * 0.8}) 0%, rgba(255,190,60,${lightBrightness * 0.5}) 40%, transparent 70%)`,
          filter: `blur(${20 - lightBrightness * 10}px)`,
        }}
      />

      {/* Radiating light rays from top */}
      {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map(
        (angle, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "2%",
              left: "50%",
              width: `${lightBrightness * 55}%`,
              height: "2px",
              background: `linear-gradient(to right, rgba(255,200,80,${lightBrightness * 0.3}), transparent)`,
              transformOrigin: "left center",
              transform: `translateY(-50%) rotate(${angle}deg)`,
              filter: "blur(3px)",
            }}
          />
        )
      )}

      {/* Person silhouette walking toward light */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "50%",
          transform: `translateX(-50%)`,
          opacity: 1,
        }}
      >
        {/* Shadow on ground */}
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 14,
            background: `rgba(0,0,0,${0.5 - walkProgress * 0.3})`,
            borderRadius: "50%",
            filter: "blur(6px)",
          }}
        />
        {/* Body */}
        <div
          style={{
            width: 55,
            height: `${130 + walkProgress * 30}px`,
            background: `rgba(${20 + walkProgress * 160}, ${12 + walkProgress * 100}, ${5 + walkProgress * 40}, ${0.9 - walkProgress * 0.3})`,
            borderRadius: "28px 28px 0 0",
            marginLeft: -27,
            boxShadow: `0 0 ${walkProgress * 40}px rgba(255,200,80,${walkProgress * 0.5})`,
          }}
        />
        {/* Head */}
        <div
          style={{
            position: "absolute",
            top: `-${42 + walkProgress * 8}px`,
            left: "50%",
            transform: "translateX(-50%)",
            width: 44,
            height: 48,
            background: `rgba(${30 + walkProgress * 180}, ${18 + walkProgress * 120}, ${8 + walkProgress * 50}, ${0.9 - walkProgress * 0.3})`,
            borderRadius: "50%",
            boxShadow: `0 0 ${walkProgress * 30}px rgba(255,200,80,${walkProgress * 0.6})`,
          }}
        />
        {/* Arms – one slightly raised in praise */}
        <div
          style={{
            position: "absolute",
            top: `${20 + walkProgress * 5}px`,
            right: `-${30 + walkProgress * 15}px`,
            width: 12,
            height: 70,
            background: `rgba(${20 + walkProgress * 160}, ${12 + walkProgress * 100}, ${5 + walkProgress * 40}, 0.85)`,
            borderRadius: 6,
            transform: `rotate(${-40 - walkProgress * 30}deg)`,
            transformOrigin: "top center",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: `${20 + walkProgress * 5}px`,
            left: `-${30 + walkProgress * 15}px`,
            width: 12,
            height: 70,
            background: `rgba(${20 + walkProgress * 160}, ${12 + walkProgress * 100}, ${5 + walkProgress * 40}, 0.85)`,
            borderRadius: 6,
            transform: `rotate(${40 + walkProgress * 30}deg)`,
            transformOrigin: "top center",
          }}
        />
      </div>

      {/* Glowing overlay as person reaches light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(255,220,130,${walkProgress * 0.12})`,
          pointerEvents: "none",
        }}
      />

      {/* Bouncing heart CTA */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "50%",
          transform: `translateX(-50%) translateY(${heartBounce}px)`,
          opacity: heartVisible,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            lineHeight: 1,
            filter: "drop-shadow(0 0 15px rgba(255,80,80,0.8))",
          }}
        >
          ❤️
        </div>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 32,
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 0 12px rgba(255,200,80,0.8), 0 2px 4px rgba(0,0,0,0.9)",
            marginTop: 6,
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          Drop a ❤️ if this gives you hope
        </div>
      </div>

      <Particles count={55} warm={true} />

      {/* Final glowing overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 80% at 50% 30%, transparent 35%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
