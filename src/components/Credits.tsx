import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../constants";
import { KenBurnsImage } from "./KenBurnsImage";
import { Vignette } from "./Vignette";
import { FilmGrain } from "./FilmGrain";

interface CreditBlock {
  role: string;
  name: string;
}

const CREDIT_BLOCKS: CreditBlock[] = [
  { role: "Produced by",              name: "Your Production Company" },
  { role: "Written & Directed by",    name: "Your Name" },
  { role: "Narrated by",              name: "Narrator Name" },
  { role: "Original Score",           name: "Epic Orchestral Music" },
  { role: "Cinematography",           name: "Drone Footage Placeholder" },
  { role: "Archival Research",        name: "Research Team" },
  { role: "Scripture References",     name: "KJV · NIV · ESV" },
  { role: "Historical Consultation",  name: "Biblical Archaeology Advisor" },
  { role: "Graphics & Motion",        name: "Remotion 4.x" },
  { role: "Color Grade",              name: "Cinematic Warm Gold" },
  { role: "Special Thanks",           name: "Temple Institute, Jerusalem" },
];

const CLOSING_VERSE =
  '"Watch therefore, for you do not know what hour your Lord is coming."';
const CLOSING_REF = "Matthew 24:42";

export const Credits: React.FC<{ backgroundSrc: string }> = ({
  backgroundSrc,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOpacity = interpolate(
    frame,
    [0, 30, durationInFrames - 40, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Total scroll height estimate (each block ~90px, gaps ~40px)
  const contentHeight = CREDIT_BLOCKS.length * 130 + 400;
  // Scroll from below screen to above screen
  const scrollY = interpolate(
    frame,
    [0, durationInFrames],
    [1080, -contentHeight],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOpacity, backgroundColor: "#000" }}>
      <KenBurnsImage src={backgroundSrc} direction="zoom-out" />
      <AbsoluteFill style={{ background: "rgba(5,12,24,0.78)" }} />
      <Vignette intensity={0.8} />

      {/* Scrolling content */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            transform: `translateY(${scrollY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            paddingTop: 80,
          }}
        >
          {/* Opening verse */}
          <div style={{ textAlign: "center", marginBottom: 80, maxWidth: 900 }}>
            <GoldRule />
            <p
              style={{
                fontFamily: FONTS.serif,
                fontSize: 38,
                color: COLORS.goldLight,
                fontStyle: "italic",
                lineHeight: 1.75,
                margin: "32px 0 16px",
              }}
            >
              {CLOSING_VERSE}
            </p>
            <p
              style={{
                fontFamily: FONTS.sans,
                fontSize: 18,
                color: COLORS.gold,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 0 32px",
              }}
            >
              — {CLOSING_REF}
            </p>
            <GoldRule />
          </div>

          {/* Credit blocks */}
          {CREDIT_BLOCKS.map((block, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                marginBottom: 48,
                minWidth: 700,
              }}
            >
              <p
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 16,
                  color: COLORS.gold,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  margin: "0 0 6px",
                  opacity: 0.85,
                }}
              >
                {block.role}
              </p>
              <p
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 28,
                  color: COLORS.cream,
                  margin: 0,
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                }}
              >
                {block.name}
              </p>
            </div>
          ))}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 80, opacity: 0.6 }}>
            <GoldRule />
            <p
              style={{
                fontFamily: FONTS.sans,
                fontSize: 14,
                color: COLORS.cream,
                letterSpacing: "0.1em",
                margin: "24px 0 8px",
              }}
            >
              Bible Lands Today: Clues to Prophecy
            </p>
            <p
              style={{
                fontFamily: FONTS.sans,
                fontSize: 13,
                color: COLORS.gold,
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              All Scripture quotations are for documentary and educational use.
            </p>
          </div>
        </div>
      </AbsoluteFill>

      <FilmGrain opacity={0.04} />
    </AbsoluteFill>
  );
};

const GoldRule: React.FC = () => (
  <div
    style={{
      width: 120,
      height: 1,
      background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
      margin: "0 auto",
    }}
  />
);
