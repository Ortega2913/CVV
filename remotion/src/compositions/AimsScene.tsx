import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "./constants";
import { fadeIn, slideLeft, slideUp } from "./utils";

const AIMS = [
  { text: "Master Web Development", sub: "Frontend & Backend excellence", icon: "🎯" },
  { text: "Learn Modern Frameworks", sub: "React, Node.js, and beyond", icon: "📚" },
  { text: "Build for a Lifetime", sub: "Consistency over shortcuts", icon: "♾️" },
];

export function AimsScene({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, startFrame, 20);
  const titleY = slideUp(frame, startFrame, fps, 30);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 120px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 44, opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div style={{ fontSize: 11, color: COLORS.green, letterSpacing: 6, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 8 }}>
          Vision &amp; Goals
        </div>
        <h2 style={{ margin: 0, fontSize: 40, fontWeight: 900, color: COLORS.white, fontFamily: "sans-serif" }}>
          My <span style={{ color: COLORS.green }}>Aims</span>
        </h2>
      </div>

      {/* Aim cards */}
      {AIMS.map((aim, i) => {
        const delay = i * 45;
        const opacity = fadeIn(frame, startFrame + 30 + delay, 20);
        const x = slideLeft(frame, startFrame + 30 + delay, fps, 70);

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${x}px)`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 24,
              padding: "20px 28px",
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.green}33`,
              borderRadius: 16,
              borderLeft: `4px solid ${COLORS.green}`,
            }}
          >
            <span style={{ fontSize: 32 }}>{aim.icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.white, fontFamily: "sans-serif", marginBottom: 4 }}>
                {aim.text}
              </div>
              <div style={{ fontSize: 13, color: COLORS.muted, fontFamily: "sans-serif" }}>{aim.sub}</div>
            </div>
            {/* Progress indicator */}
            <div
              style={{
                marginLeft: "auto",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: COLORS.green,
                boxShadow: `0 0 10px ${COLORS.green}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
