import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "./constants";
import { fadeIn, slideUp, scaleIn } from "./utils";

export function OutroScene({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = scaleIn(frame, startFrame, fps);
  const logoOpacity = fadeIn(frame, startFrame, 15);

  const titleOpacity = fadeIn(frame, startFrame + 20, 25);
  const titleY = slideUp(frame, startFrame + 20, fps, 40);

  const contactOpacity = fadeIn(frame, startFrame + 50, 25);
  const contactY = slideUp(frame, startFrame + 50, fps, 30);

  const ctaOpacity = fadeIn(frame, startFrame + 80, 20);
  const pulse = interpolate(Math.sin((frame - startFrame) * 0.08), [-1, 1], [0.85, 1.05]);

  const CONTACTS = [
    { icon: "📧", label: "ortega@gmail.com" },
    { icon: "📞", label: "+1 238 746 4737" },
    { icon: "🌐", label: "GodsofRemoina" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `2px solid ${COLORS.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          boxShadow: `0 0 24px rgba(108,99,255,0.5)`,
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 900, color: COLORS.accent, fontFamily: "sans-serif" }}>M</span>
      </div>

      {/* Title */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center", marginBottom: 16 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 36,
            fontWeight: 900,
            fontFamily: "sans-serif",
            color: COLORS.white,
            letterSpacing: 3,
          }}
        >
          Let's <span style={{ color: COLORS.accent }}>Connect</span>
        </h2>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: COLORS.muted, fontFamily: "sans-serif", letterSpacing: 2 }}>
          Open to opportunities &amp; collaborations
        </p>
      </div>

      {/* Contact info */}
      <div
        style={{
          opacity: contactOpacity,
          transform: `translateY(${contactY}px)`,
          display: "flex",
          gap: 20,
          marginTop: 28,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {CONTACTS.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 50,
            }}
          >
            <span style={{ fontSize: 16 }}>{c.icon}</span>
            <span style={{ fontSize: 13, color: COLORS.white, fontFamily: "sans-serif" }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${pulse})`,
          marginTop: 36,
          padding: "14px 44px",
          borderRadius: 50,
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentAlt})`,
          boxShadow: `0 4px 24px rgba(108,99,255,0.5)`,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "sans-serif", letterSpacing: 2 }}>
          HIRE ME
        </span>
      </div>
    </div>
  );
}
