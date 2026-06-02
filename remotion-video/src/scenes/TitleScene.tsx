import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SERIF, SERIF_DISPLAY } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { Particles } from "../components/Particles";
import { GoldenSpiral } from "../components/GoldenSpiral";
import { ColumnSketch, CompassSketch } from "../components/Ornaments";
import { AnimatedLetters } from "../components/AnimatedText";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const spiralProg = interpolate(frame, [10, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ornProg = interpolate(frame, [25, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ruleW = spring({ frame: frame - 55, fps, config: { damping: 200 } });
  const subFade = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* faint hero spiral, off to the right */}
      <div
        style={{
          position: "absolute",
          right: width * 0.04,
          top: height * 0.12,
          opacity: 0.5,
        }}
      >
        <GoldenSpiral progress={spiralProg} size={520} />
      </div>

      {/* flanking sketches */}
      <div style={{ position: "absolute", left: 70, top: 120, opacity: 0.7 }}>
        <ColumnSketch progress={ornProg} size={130} />
      </div>
      <div style={{ position: "absolute", left: width * 0.30, bottom: 70, opacity: 0.8 }}>
        <CompassSketch progress={ornProg} size={150} />
      </div>

      {/* title block */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: COLORS.ochre,
            opacity: interpolate(frame, [0, 25], [0, 1], {
              extrapolateRight: "clamp",
            }),
            marginBottom: 8,
          }}
        >
          A Study in Sacred Proportion
        </div>

        <div
          style={{
            fontFamily: SERIF_DISPLAY,
            fontWeight: 600,
            fontSize: 132,
            color: COLORS.ink,
            lineHeight: 1.02,
            textShadow: "0 2px 0 rgba(255,255,255,0.4)",
          }}
        >
          <AnimatedLetters text="Designing" delay={18} />
        </div>
        <div
          style={{
            fontFamily: SERIF_DISPLAY,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 132,
            color: COLORS.goldDeep,
            lineHeight: 1.02,
            marginTop: -18,
          }}
        >
          <AnimatedLetters text="the Divine" delay={34} />
        </div>

        <div
          style={{
            height: 2,
            width: interpolate(ruleW, [0, 1], [0, 520]),
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            marginTop: 26,
          }}
        />

        <div
          style={{
            fontFamily: SERIF,
            fontSize: 32,
            color: COLORS.inkSoft,
            letterSpacing: 2,
            marginTop: 18,
            opacity: subFade,
          }}
        >
          How the Renaissance masters composed the heavens
        </div>
      </AbsoluteFill>

      <Particles count={40} />
    </AbsoluteFill>
  );
};
