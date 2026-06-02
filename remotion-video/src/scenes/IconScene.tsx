import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, SANS, SERIF, SERIF_DISPLAY } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { DrawnPath } from "../components/DrawnPath";
import { Particles } from "../components/Particles";
import { AnimatedWords } from "../components/AnimatedText";

const OrnateFrame: React.FC<{ progress: number }> = ({ progress }) => {
  const W = 520;
  const H = 720;
  const m = 26;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <rect x={4} y={4} width={W - 8} height={H - 8} fill="rgba(255,253,247,0.85)" stroke={COLORS.goldDeep} strokeWidth={3} />
      <DrawnPath progress={progress} d={`M${m} ${m} H${W - m} V${H - m} H${m} Z`} stroke={COLORS.gold} strokeWidth={3} />
      <DrawnPath progress={progress} d={`M${m + 14} ${m + 14} H${W - m - 14} V${H - m - 14} H${m + 14} Z`} stroke={COLORS.goldDeep} strokeWidth={1.4} />
      {/* corner flourishes */}
      {[
        [m, m, 1, 1],
        [W - m, m, -1, 1],
        [m, H - m, 1, -1],
        [W - m, H - m, -1, -1],
      ].map(([x, y, sx, sy], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
          <DrawnPath progress={progress} d="M6 6 q34 4 40 40 q-22 -10 -40 -8 q10 -18 0 -32" stroke={COLORS.gold} strokeWidth={2} />
        </g>
      ))}
      {/* repeating border diamonds */}
      {new Array(9).fill(0).map((_, i) => {
        const x = m + 24 + (i * (W - 2 * m - 48)) / 8;
        return (
          <g key={`t${i}`} opacity={interpolate(progress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <path d={`M${x} ${m + 7} l5 5 l-5 5 l-5 -5 Z`} fill={COLORS.goldDeep} />
            <path d={`M${x} ${H - m - 7} l5 5 l-5 5 l-5 -5 Z`} fill={COLORS.goldDeep} />
          </g>
        );
      })}
    </svg>
  );
};

const IconFigure: React.FC<{ progress: number }> = ({ progress }) => {
  const haloPulse = 1 + Math.sin(useCurrentFrame() / 18) * 0.03;
  return (
    <svg width={360} height={560} viewBox="0 0 360 560" fill="none" style={{ position: "absolute" }}>
      {/* halo */}
      <g transform={`translate(180 150) scale(${haloPulse})`} opacity={interpolate(progress, [0.2, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <circle r={92} fill={COLORS.goldLight} opacity={0.18} />
        <circle r={78} fill="none" stroke={COLORS.gold} strokeWidth={3} />
        <circle r={66} fill="none" stroke={COLORS.goldDeep} strokeWidth={1.4} />
        {/* cruciform halo bars */}
        <line x1={-78} y1={0} x2={78} y2={0} stroke={COLORS.gold} strokeWidth={2} opacity={0.5} />
        <line x1={0} y1={-78} x2={0} y2={20} stroke={COLORS.gold} strokeWidth={2} opacity={0.5} />
      </g>
      {/* robe + figure line art */}
      <g strokeLinecap="round" strokeLinejoin="round">
        <DrawnPath progress={progress} d="M150 110 a30 34 0 1 0 60 0 a30 34 0 1 0 -60 0" stroke={COLORS.inkSoft} strokeWidth={2.4} />
        {/* hair */}
        <DrawnPath progress={progress} d="M150 120 q-12 30 -4 60 M210 120 q12 30 4 60" stroke={COLORS.inkSoft} strokeWidth={2} />
        {/* shoulders + robe */}
        <DrawnPath progress={progress} d="M150 168 C120 200 96 360 110 520 L250 520 C264 360 240 200 210 168" stroke={COLORS.inkSoft} strokeWidth={2.4} />
        {/* robe folds */}
        <DrawnPath progress={progress} d="M150 220 Q160 360 150 510 M210 220 Q200 360 210 510 M180 200 L180 510" stroke={COLORS.blue} strokeWidth={1.6} opacity={0.7} />
        {/* blessing hand */}
        <DrawnPath progress={progress} d="M214 250 q40 -16 52 -54" stroke={COLORS.inkSoft} strokeWidth={2.2} />
        {/* staff */}
        <DrawnPath progress={progress} d="M120 150 L120 520" stroke={COLORS.goldDeep} strokeWidth={2.2} />
        <DrawnPath progress={progress} d="M120 150 q0 -18 16 -18 q16 0 16 16" stroke={COLORS.goldDeep} strokeWidth={2.2} />
      </g>
    </svg>
  );
};

export const IconScene: React.FC = () => {
  const frame = useCurrentFrame();
  const frameProg = interpolate(frame, [8, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const figProg = interpolate(frame, [25, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground tint="#F1ECE0" />

      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 90 }}>
        {/* text side */}
        <div style={{ width: 560 }}>
          <div style={{ fontFamily: SERIF, fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: COLORS.ochre, marginBottom: 14 }}>
            Step Two
          </div>
          <div style={{ fontFamily: SERIF_DISPLAY, fontSize: 92, fontWeight: 600, color: COLORS.ink, lineHeight: 1.05 }}>
            <AnimatedWords text="The Sacred Icon" delay={10} stagger={3} />
          </div>
          <div style={{ height: 2, width: 240, background: `linear-gradient(90deg, ${COLORS.gold}, transparent)`, margin: "22px 0" }} />
          <div style={{ fontFamily: SANS, fontSize: 24, color: COLORS.inkSoft, lineHeight: 1.6, opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            Frame the figure in gilded ornament. A cruciform halo,
            a blessing hand and a shepherd's staff turn a portrait
            into an object of devotion.
          </div>
        </div>

        {/* framed icon */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <OrnateFrame progress={frameProg} />
          <div style={{ position: "absolute", top: 80 }}>
            <IconFigure progress={figProg} />
          </div>
        </div>
      </AbsoluteFill>

      <Particles count={24} seed="icon" />
    </AbsoluteFill>
  );
};
