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
import { GoldenSpiral } from "../components/GoldenSpiral";
import { Particles } from "../components/Particles";
import { Laurel } from "../components/Ornaments";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spiralProg = interpolate(frame, [0, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleS = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const laurelProg = interpolate(frame, [25, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finFade = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", opacity: 0.4 }}>
          <GoldenSpiral progress={spiralProg} size={620} showGrid={false} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: titleS, transform: `scale(${interpolate(titleS, [0, 1], [0.9, 1])})` }}>
          <Laurel progress={laurelProg} size={90} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: SERIF_DISPLAY, fontSize: 96, fontWeight: 600, color: COLORS.ink, lineHeight: 1 }}>
              Designing
            </div>
            <div style={{ fontFamily: SERIF_DISPLAY, fontSize: 96, fontStyle: "italic", color: COLORS.goldDeep, lineHeight: 1 }}>
              the Divine
            </div>
          </div>
          <Laurel progress={laurelProg} size={90} flip />
        </div>

        <div style={{ fontFamily: SERIF, fontSize: 30, letterSpacing: 6, color: COLORS.ochre, marginTop: 30, opacity: finFade }}>
          ~ composed with sacred geometry ~
        </div>
      </AbsoluteFill>

      <Particles count={46} seed="outro" />
    </AbsoluteFill>
  );
};
