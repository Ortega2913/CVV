import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Word-by-word staggered reveal with a soft rise + blur clear.
export const AnimatedWords: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  highlight?: string;
  highlightColor?: string;
}> = ({ text, delay = 0, stagger = 4, style, highlight, highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <span style={{ display: "inline", ...style }}>
      {words.map((word, i) => {
        const local = frame - delay - i * stagger;
        const s = spring({
          frame: local,
          fps,
          config: { damping: 200, mass: 0.7 },
        });
        const y = interpolate(s, [0, 1], [28, 0]);
        const blur = interpolate(s, [0, 1], [8, 0]);
        const isHi = highlight
          ? highlight.toLowerCase().includes(word.toLowerCase().replace(/[?.,]/g, ""))
          : false;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              color: isHi ? highlightColor : undefined,
              marginRight: "0.28em",
              whiteSpace: "pre",
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

// Letter-by-letter reveal for hero titles.
export const AnimatedLetters: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 1.6, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split("");

  return (
    <span style={{ display: "inline-flex", ...style }}>
      {letters.map((ch, i) => {
        const local = frame - delay - i * stagger;
        const s = spring({
          frame: local,
          fps,
          config: { damping: 200, mass: 0.6 },
        });
        const y = interpolate(s, [0, 1], [40, 0]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s,
              transform: `translateY(${y}px)`,
              whiteSpace: "pre",
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};
