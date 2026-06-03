import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "./constants";
import { fadeIn, slideUp, scaleIn } from "./utils";

export function IntroScene({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  const logoScale = scaleIn(frame, startFrame, fps);
  const logoOpacity = fadeIn(frame, startFrame, 15);

  const nameOpacity = fadeIn(frame, startFrame + 20, 25);
  const nameY = slideUp(frame, startFrame + 20, fps, 50);

  const subtitleOpacity = fadeIn(frame, startFrame + 45, 20);
  const subtitleY = slideUp(frame, startFrame + 45, fps, 30);

  const roleOpacity = fadeIn(frame, startFrame + 65, 20);
  const lineWidth = interpolate(f, [70, 120], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Logo circle */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: `3px solid ${COLORS.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          background: `radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)`,
          boxShadow: `0 0 30px rgba(108,99,255,0.4), 0 0 60px rgba(108,99,255,0.15)`,
        }}
      >
        <span style={{ fontSize: 38, fontWeight: 900, color: COLORS.accent, fontFamily: "sans-serif", letterSpacing: -2 }}>M</span>
      </div>

      {/* Name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            fontWeight: 900,
            fontFamily: "sans-serif",
            letterSpacing: 4,
            color: COLORS.white,
            textShadow: `0 0 40px rgba(108,99,255,0.6), 0 2px 20px rgba(0,0,0,0.8)`,
            lineHeight: 1,
          }}
        >
          MANGKARA
        </h1>
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            fontWeight: 900,
            fontFamily: "sans-serif",
            letterSpacing: 4,
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentAlt})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
          }}
        >
          DAJIED WANRIEH
        </h1>
      </div>

      {/* Divider line */}
      <div
        style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentAlt})`,
          marginTop: 18,
          marginBottom: 18,
          borderRadius: 2,
          boxShadow: `0 0 12px rgba(108,99,255,0.5)`,
        }}
      />

      {/* Subtitle */}
      <p
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          margin: 0,
          fontSize: 18,
          fontFamily: "sans-serif",
          color: COLORS.muted,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        The Alpha &amp; Omega in his own Dreams
      </p>

      {/* Role badge */}
      <div
        style={{
          opacity: roleOpacity,
          marginTop: 20,
          padding: "8px 24px",
          borderRadius: 50,
          border: `1px solid ${COLORS.accentAlt}55`,
          background: `rgba(0,229,255,0.08)`,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontFamily: "sans-serif",
            color: COLORS.accentAlt,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Founder &amp; CEO · GodsofRemoina
        </span>
      </div>
    </div>
  );
}
