import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
  hue: number;
}

export const Particles: React.FC<{ count?: number; warm?: boolean }> = ({
  count = 40,
  warm = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.sin(i * 7.3 + 1.1) * 0.5 + 0.5) * width,
      y: (Math.cos(i * 3.7 + 0.9) * 0.5 + 0.5) * height,
      size: 2 + ((i * 13) % 5),
      speed: 0.3 + ((i * 7) % 10) * 0.07,
      opacity: 0.3 + ((i * 11) % 6) * 0.1,
      delay: (i * 17) % 60,
      hue: warm ? 35 + ((i * 23) % 25) : 220 + ((i * 17) % 40),
    }));
  }, [count, width, height, warm]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const t = (frame - p.delay) * p.speed;
        const y = ((p.y - t * 0.8) % height + height) % height;
        const drift = Math.sin((frame + p.delay) * 0.02) * 30;
        const pulse = Math.sin((frame + p.delay) * 0.05) * 0.3 + 0.7;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + drift,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: warm
                ? `hsl(${p.hue}, 90%, 70%)`
                : `hsl(${p.hue}, 60%, 80%)`,
              opacity: p.opacity * pulse,
              boxShadow: warm
                ? `0 0 ${p.size * 3}px hsl(${p.hue}, 90%, 60%)`
                : `0 0 ${p.size * 2}px hsl(${p.hue}, 60%, 70%)`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </div>
  );
};
