import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "./constants";
import { fadeIn, slideLeft, slideUp } from "./utils";

const EXPERIENCE = [
  { year: "2010", role: "Amazon", desc: "E-Commerce & Cloud Operations", color: COLORS.gold },
  { year: "2013 – 2018", role: "Developer", desc: "Full Stack Web Development", color: COLORS.accent },
];

function TimelineItem({
  item,
  index,
  startFrame,
}: {
  item: typeof EXPERIENCE[0];
  index: number;
  startFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 40;
  const opacity = fadeIn(frame, startFrame + delay, 20);
  const x = slideLeft(frame, startFrame + delay, fps, 80);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "flex-start",
        gap: 28,
        marginBottom: 36,
      }}
    >
      {/* Timeline dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: item.color,
            boxShadow: `0 0 14px ${item.color}88`,
            flexShrink: 0,
          }}
        />
        {index < EXPERIENCE.length - 1 && (
          <div style={{ width: 2, height: 60, background: `linear-gradient(${item.color}88, transparent)`, marginTop: 4 }} />
        )}
      </div>

      {/* Content card */}
      <div
        style={{
          flex: 1,
          background: COLORS.cardBg,
          border: `1px solid ${item.color}44`,
          borderRadius: 12,
          padding: "16px 24px",
          backdropFilter: "blur(4px)",
        }}
      >
        <div style={{ fontSize: 12, color: item.color, letterSpacing: 4, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 6 }}>
          {item.year}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: "sans-serif", marginBottom: 4 }}>{item.role}</div>
        <div style={{ fontSize: 14, color: COLORS.muted, fontFamily: "sans-serif" }}>{item.desc}</div>
      </div>
    </div>
  );
}

export function ExperienceScene({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, startFrame, 20);
  const titleY = slideUp(frame, startFrame, fps, 30);
  const lineWidth = interpolate(frame, [startFrame + 10, startFrame + 60], [0, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Section header */}
      <div style={{ marginBottom: 44, opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div style={{ fontSize: 11, color: COLORS.accent, letterSpacing: 6, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 10 }}>
          Professional Journey
        </div>
        <h2 style={{ margin: 0, fontSize: 40, fontWeight: 900, color: COLORS.white, fontFamily: "sans-serif" }}>
          Work <span style={{ color: COLORS.accent }}>Experience</span>
        </h2>
        <div
          style={{
            width: lineWidth,
            height: 3,
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentAlt})`,
            borderRadius: 2,
            marginTop: 12,
          }}
        />
      </div>

      {/* Timeline items */}
      {EXPERIENCE.map((item, i) => (
        <TimelineItem key={i} item={item} index={i} startFrame={startFrame + 40} />
      ))}
    </div>
  );
}
