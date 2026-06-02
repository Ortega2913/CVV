import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Particles } from "../Particles";

// 19–24s (frames 570–719): Worship scenes – raised hands, golden fabric, candles
export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const glow = 0.6 + Math.sin(frame * 0.05) * 0.2;
  const candleFlicker = 0.7 + Math.sin(frame * 0.12) * 0.15 + Math.sin(frame * 0.23) * 0.1;

  const fabricWave = Math.sin(frame * 0.04) * 15;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Warm deep background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(175deg, #0c0704 0%, #1a0e04 40%, #0f0702 100%)",
        }}
      />

      {/* Cross light beam */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: "55%",
          background: `linear-gradient(to bottom, rgba(255,200,80,${glow * 0.5}) 0%, transparent 100%)`,
          filter: "blur(18px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          right: "15%",
          height: 45,
          background: `linear-gradient(to right, transparent, rgba(255,200,80,${glow * 0.4}), transparent)`,
          filter: "blur(14px)",
        }}
      />

      {/* Golden flowing fabric */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: `${35 + fabricWave * 0.15}%`,
          width: "35%",
          height: "45%",
          background: `linear-gradient(135deg, rgba(255,180,40,0.22), rgba(255,140,20,0.12), rgba(200,120,10,0.08))`,
          borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
          filter: "blur(8px)",
          transform: `rotate(${fabricWave * 0.3}deg)`,
        }}
      />

      {/* Raised hands silhouettes */}
      {[-160, -60, 60, 160].map((xOff, i) => {
        const handSway = Math.sin(frame * 0.04 + i * 1.1) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: "20%",
              left: "50%",
              transform: `translateX(${xOff + handSway}px)`,
            }}
          >
            {/* Arm */}
            <div
              style={{
                width: 22,
                height: 120,
                background: `rgba(${180 + i * 10}, ${120 + i * 8}, ${50 + i * 5}, ${0.55 - i * 0.04})`,
                borderRadius: 11,
                marginLeft: -11,
                boxShadow: `0 0 15px rgba(255,160,40,${0.2 + glow * 0.15})`,
                transform: `rotate(${handSway * 0.8}deg)`,
                transformOrigin: "bottom center",
              }}
            />
          </div>
        );
      })}

      {/* Candle flames */}
      {[-200, 0, 200].map((x, i) => {
        const flicker = candleFlicker + Math.sin(frame * 0.18 + i * 2.3) * 0.1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: "12%",
              left: "50%",
              transform: `translateX(${x}px)`,
            }}
          >
            {/* Candle body */}
            <div
              style={{
                width: 16,
                height: 60,
                background: "rgba(220,210,190,0.7)",
                borderRadius: 4,
                marginLeft: -8,
              }}
            />
            {/* Flame */}
            <div
              style={{
                position: "absolute",
                bottom: 58,
                left: "50%",
                transform: `translateX(-50%) scaleY(${flicker})`,
                transformOrigin: "bottom center",
                width: 18,
                height: 30,
                background:
                  "radial-gradient(ellipse at 50% 70%, rgba(255,240,100,0.95), rgba(255,140,20,0.7), transparent)",
                borderRadius: "50% 50% 40% 40%",
                filter: "blur(1px)",
              }}
            />
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                bottom: 40,
                left: "50%",
                transform: "translateX(-50%)",
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(255,180,40,${flicker * 0.3}) 0%, transparent 70%)`,
                filter: "blur(10px)",
              }}
            />
          </div>
        );
      })}

      <Particles count={45} warm={true} />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 75% at 50% 45%, transparent 38%, rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
