import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "./constants";
import { fadeIn, slideUp, scaleIn } from "./utils";

const HOBBIES = [
  { icon: "⚽", label: "Football", desc: "The beautiful game", color: "#ff8c42" },
  { icon: "🎵", label: "Singing", desc: "Music & rhythm", color: COLORS.gold },
  { icon: "🎮", label: "Free Fire", desc: "Gaming legend", color: "#ff4466" },
  { icon: "💻", label: "Coding", desc: "Web developer at heart", color: COLORS.accent },
];

function HobbyCard({ hobby, index, startFrame }: { hobby: typeof HOBBIES[0]; index: number; startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 30;
  const opacity = fadeIn(frame, startFrame + delay, 20);
  const scale = scaleIn(frame, startFrame + delay, fps);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 24px",
        background: COLORS.cardBg,
        border: `1px solid ${hobby.color}44`,
        borderRadius: 20,
        flex: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${hobby.color}15 0%, transparent 70%)`,
        }}
      />
      <span style={{ fontSize: 44, marginBottom: 14, position: "relative" }}>{hobby.icon}</span>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: COLORS.white,
          fontFamily: "sans-serif",
          marginBottom: 6,
          position: "relative",
        }}
      >
        {hobby.label}
      </div>
      <div style={{ fontSize: 12, color: hobby.color, fontFamily: "sans-serif", position: "relative", letterSpacing: 1 }}>
        {hobby.desc}
      </div>
    </div>
  );
}

export function HobbiesScene({ startFrame }: { startFrame: number }) {
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
        padding: "0 100px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 44, opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div
          style={{ fontSize: 11, color: "#ff8c42", letterSpacing: 6, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 8 }}
        >
          Outside Work
        </div>
        <h2 style={{ margin: 0, fontSize: 40, fontWeight: 900, color: COLORS.white, fontFamily: "sans-serif" }}>
          Interests &amp; <span style={{ color: "#ff8c42" }}>Hobbies</span>
        </h2>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {HOBBIES.map((h, i) => (
          <HobbyCard key={i} hobby={h} index={i} startFrame={startFrame + 25} />
        ))}
      </div>
    </div>
  );
}
