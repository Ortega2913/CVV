import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./constants";
import { fadeIn, slideUp, progressBar } from "./utils";

const SKILLS = [
  { name: "Web Development", fill: 0.95, icon: "🌐", color: COLORS.accent },
  { name: "Frontend", fill: 0.78, icon: "🎨", color: "#ff6b9d" },
  { name: "Backend", fill: 0.55, icon: "⚙️", color: COLORS.accentAlt },
  { name: "Full Stack", fill: 0.50, icon: "🔗", color: COLORS.green },
  { name: "Singing", fill: 0.95, icon: "🎵", color: COLORS.gold },
  { name: "Football", fill: 0.78, icon: "⚽", color: "#ff8c42" },
];

function SkillBar({
  skill,
  index,
  startFrame,
}: {
  skill: typeof SKILLS[0];
  index: number;
  startFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = index % 2;
  const row = Math.floor(index / 2);
  const delay = col * 20 + row * 50;
  const opacity = fadeIn(frame, startFrame + delay, 20);
  const y = slideUp(frame, startFrame + delay, fps, 25);
  const barFill = progressBar(frame, startFrame + delay + 15, fps, skill.fill);
  const barWidth = barFill * 100;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{skill.icon}</span>
        <span style={{ fontSize: 15, color: COLORS.white, fontFamily: "sans-serif", fontWeight: 600 }}>{skill.name}</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: skill.color, fontFamily: "sans-serif", fontWeight: 700 }}>
          {Math.round(barFill * 100)}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 8,
          background: "rgba(255,255,255,0.07)",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barWidth}%`,
            borderRadius: 8,
            background: `linear-gradient(90deg, ${skill.color}cc, ${skill.color})`,
            boxShadow: `0 0 10px ${skill.color}66`,
            transition: "none",
          }}
        />
      </div>
    </div>
  );
}

export function SkillsScene({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, startFrame, 20);
  const titleY = slideUp(frame, startFrame, fps, 30);

  const half = Math.ceil(SKILLS.length / 2);
  const left = SKILLS.slice(0, half);
  const right = SKILLS.slice(half);

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
      <div style={{ marginBottom: 40, opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div style={{ fontSize: 11, color: COLORS.accentAlt, letterSpacing: 6, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 8 }}>
          Capabilities
        </div>
        <h2 style={{ margin: 0, fontSize: 40, fontWeight: 900, color: COLORS.white, fontFamily: "sans-serif" }}>
          Skills &amp; <span style={{ color: COLORS.accentAlt }}>Expertise</span>
        </h2>
      </div>

      {/* Two-column grid */}
      <div style={{ display: "flex", gap: 60 }}>
        <div style={{ flex: 1 }}>
          {left.map((skill, i) => (
            <SkillBar key={i} skill={skill} index={i} startFrame={startFrame + 30} />
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {right.map((skill, i) => (
            <SkillBar key={i + half} skill={skill} index={i + half} startFrame={startFrame + 30} />
          ))}
        </div>
      </div>
    </div>
  );
}
