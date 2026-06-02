import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SERIF, SERIF_DISPLAY } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { ArchSketch, Laurel } from "../components/Ornaments";
import { AnimatedWords } from "../components/AnimatedText";
import { Particles } from "../components/Particles";

// A flowing drape of renaissance fabric rendered with an animated bezier ribbon.
const Drape: React.FC<{ color: string; x: number; delay: number; flip?: boolean }> = ({
  color,
  x,
  delay,
  flip,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const reveal = interpolate(frame - delay, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sway = Math.sin((frame - delay) / 26) * 18;

  return (
    <svg
      width={360}
      height={height}
      viewBox={`0 0 360 ${height}`}
      style={{
        position: "absolute",
        top: 0,
        left: x,
        transform: flip ? "scaleX(-1)" : undefined,
        opacity: reveal,
      }}
    >
      <defs>
        <linearGradient id={`drape-${color}-${x}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.92} />
          <stop offset="1" stopColor={color} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      <path
        d={`M0 0 L${150 + sway} 0
           C${60 + sway} ${height * 0.3}, ${220 - sway} ${height * 0.55}, ${120 + sway} ${height * 0.8}
           C${80} ${height * 0.95}, ${30} ${height}, 0 ${height} Z`}
        fill={`url(#drape-${color}-${x})`}
      />
      <path
        d={`M${150 + sway} 0 C${100 + sway} ${height * 0.32}, ${180 - sway} ${height * 0.5}, ${130 + sway} ${height * 0.8}`}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={3}
      />
    </svg>
  );
};

export const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const archProg = interpolate(frame, [8, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const laurelProg = interpolate(frame, [40, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PaperBackground tint="#EFE7D6" />

      <Drape color={COLORS.blueDeep} x={-40} delay={6} />
      <Drape color={COLORS.red} x={width - 320} delay={14} flip />

      {/* arches behind */}
      <div style={{ position: "absolute", left: width / 2 - 150, top: 60, opacity: 0.4 }}>
        <ArchSketch progress={archProg} size={300} />
      </div>

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "0 16%" }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 30,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: COLORS.ochre,
            marginBottom: 26,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          The Central Question
        </div>
        <div
          style={{
            fontFamily: SERIF_DISPLAY,
            fontWeight: 600,
            fontSize: 96,
            lineHeight: 1.08,
            textAlign: "center",
            color: COLORS.ink,
          }}
        >
          <AnimatedWords
            text="How do you design a"
            delay={14}
            stagger={3}
          />
          <br />
          <AnimatedWords
            text="Renaissance masterpiece?"
            delay={30}
            stagger={3}
            highlight="Renaissance masterpiece?"
            highlightColor={COLORS.goldDeep}
            style={{ fontStyle: "italic" }}
          />
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 40, bottom: 30, opacity: 0.8 }}>
        <Laurel progress={laurelProg} size={120} />
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 30, opacity: 0.8 }}>
        <Laurel progress={laurelProg} size={120} flip />
      </div>

      <Particles count={28} seed="q" />
    </AbsoluteFill>
  );
};
