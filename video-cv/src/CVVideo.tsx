import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  Series,
} from "remotion";

const BG_DARK = "#0f0f1a";
const BG_MID = "#1a1a2e";
const ACCENT = "#e94560";
const TEXT_PRIMARY = "#ffffff";
const TEXT_SECONDARY = "#a0a0b8";
const CARD_BG = "rgba(255,255,255,0.05)";

const fadeSlide = (
  frame: number,
  start: number,
  duration = 22,
  fromY = 24,
  fromX = 0,
) => {
  const f = Math.max(0, frame - start);
  const opts = {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  };
  return {
    opacity: interpolate(f, [0, duration], [0, 1], opts),
    transform: `translate(${interpolate(f, [0, duration], [fromX, 0], opts)}px, ${interpolate(f, [0, duration], [fromY, 0], opts)}px)`,
  };
};

const AccentLine: React.FC<{ startFrame: number; targetWidth: number }> = ({
  startFrame,
  targetWidth,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - startFrame);
  const width = interpolate(f, [0, 35], [0, targetWidth], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width,
        height: 4,
        background: ACCENT,
        borderRadius: 2,
        marginTop: 10,
        marginBottom: 18,
      }}
    />
  );
};

const IntroSection: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG_DARK} 0%, ${BG_MID} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          ...fadeSlide(frame, 0, 25, 0, -60),
          fontFamily: "sans-serif",
          fontSize: 52,
          fontWeight: 800,
          color: TEXT_PRIMARY,
          letterSpacing: 3,
          textTransform: "uppercase",
          lineHeight: 1.1,
        }}
      >
        MANGKARA DAJIED
        <br />
        WANRIEH
      </div>

      <AccentLine startFrame={12} targetWidth={280} />

      <div
        style={{
          ...fadeSlide(frame, 22, 22),
          fontFamily: "sans-serif",
          fontSize: 22,
          color: TEXT_SECONDARY,
          fontStyle: "italic",
          letterSpacing: 0.5,
          maxWidth: 700,
        }}
      >
        "The ALPHA and OMEGA in my own DREAMS"
      </div>

      <div
        style={{
          ...fadeSlide(frame, 38, 22),
          fontFamily: "sans-serif",
          fontSize: 18,
          color: ACCENT,
          marginTop: 18,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        Founder &amp; CEO · GodsofRemoina
      </div>
    </AbsoluteFill>
  );
};

const ExperienceRow: React.FC<{
  year: string;
  role: string;
  startFrame: number;
}> = ({ year, role, startFrame }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...fadeSlide(frame, startFrame, 20, 0, 40),
        display: "flex",
        alignItems: "center",
        background: CARD_BG,
        borderRadius: 12,
        padding: "18px 28px",
        marginBottom: 16,
        border: "1px solid rgba(233,69,96,0.2)",
      }}
    >
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 18,
          color: ACCENT,
          fontWeight: 700,
          minWidth: 130,
        }}
      >
        {year}
      </div>
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 20,
          color: TEXT_PRIMARY,
          fontWeight: 500,
        }}
      >
        {role}
      </div>
    </div>
  );
};

const ExperienceSection: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG_DARK} 0%, ${BG_MID} 100%)`,
        padding: "60px 100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          ...fadeSlide(frame, 0, 18),
          fontFamily: "sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: TEXT_PRIMARY,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        Work Experience
      </div>
      <AccentLine startFrame={8} targetWidth={60} />
      <ExperienceRow year="2010" role="Work in Amazon" startFrame={20} />
      <ExperienceRow year="2013 – 2018" role="Developer" startFrame={40} />
    </AbsoluteFill>
  );
};

const SkillBar: React.FC<{
  name: string;
  pct: number;
  startFrame: number;
}> = ({ name, pct, startFrame }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - startFrame);
  const opacity = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barWidth = interpolate(f, [10, 50], [0, pct], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, marginBottom: 22 }}>
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 17,
          color: TEXT_PRIMARY,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {name}
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: 8,
          height: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${ACCENT}, #f5a623)`,
            borderRadius: 8,
          }}
        />
      </div>
    </div>
  );
};

const SkillsSection: React.FC = () => {
  const frame = useCurrentFrame();

  const techSkills = [
    { name: "Web Development", pct: 100 },
    { name: "Frontend", pct: 75 },
    { name: "Backend", pct: 50 },
    { name: "Full Stack", pct: 50 },
  ];
  const otherSkills = [
    { name: "Singing", pct: 100 },
    { name: "Football", pct: 75 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG_DARK} 0%, ${BG_MID} 100%)`,
        padding: "50px 100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          ...fadeSlide(frame, 0, 18),
          fontFamily: "sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: TEXT_PRIMARY,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        Skills
      </div>
      <AccentLine startFrame={8} targetWidth={60} />

      <div style={{ display: "flex", gap: 80 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 13,
              color: TEXT_SECONDARY,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Technical
          </div>
          {techSkills.map((s, i) => (
            <SkillBar
              key={s.name}
              name={s.name}
              pct={s.pct}
              startFrame={18 + i * 14}
            />
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 13,
              color: TEXT_SECONDARY,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Other
          </div>
          {otherSkills.map((s, i) => (
            <SkillBar
              key={s.name}
              name={s.name}
              pct={s.pct}
              startFrame={18 + i * 14}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CVVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={95} premountFor={30}>
          <IntroSection />
        </Series.Sequence>
        <Series.Sequence offset={-15} durationInFrames={90} premountFor={30}>
          <ExperienceSection />
        </Series.Sequence>
        <Series.Sequence offset={-15} durationInFrames={120} premountFor={30}>
          <SkillsSection />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
