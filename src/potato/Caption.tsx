import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Blob, BlobShape, lerpShape, SHAPES } from "./Blob";

/**
 * Lower-third caption whose background MORPHS from one shape into the pill as it
 * enters (and back out as it leaves). The words spring in with a stagger.
 */
export const Caption: React.FC<{
  text: string;
  appearAt: number;
  disappearAt: number;
  top: string;
  bg?: string;
  textColor?: string;
  fromShape?: BlobShape;
  emoji?: "heart" | "none";
}> = ({
  text,
  appearAt,
  disappearAt,
  top,
  bg = "#ffce4f",
  textColor = "#3a2410",
  fromShape = SHAPES.star,
  emoji = "none",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt;

  if (frame < appearAt - 2 || frame > disappearAt + 16) return null;

  // Entrance: morph fromShape -> pill, with a springy scale.
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const morphIn = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit morph back toward a small blob + fade.
  const exit = interpolate(frame, [disappearAt, disappearAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shape = lerpShape(
    lerpShape(fromShape, SHAPES.pill, morphIn),
    SHAPES.blob,
    exit
  );

  const opacity = interpolate(enter, [0, 1], [0, 1]) * (1 - exit);
  const scale = interpolate(enter, [0, 1], [0.6, 1]) * (1 - exit * 0.25);

  const words = text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        width: 760,
        height: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={760}
        height={280}
        viewBox="0 0 760 280"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <filter id="capShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.35" />
          </filter>
        </defs>
        <Blob
          shape={shape}
          cx={380}
          cy={140}
          base={92}
          fill={bg}
          filter="url(#capShadow)"
        />
        {/* subtle top highlight for a glossy sticker look */}
        <Blob shape={shape} cx={380} cy={128} base={86} fill="rgba(255,255,255,0.18)" />
      </svg>

      <div
        style={{
          position: "relative",
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
        }}
      >
        {words.map((w, i) => {
          const wEnter = spring({
            frame: local - 4 - i * 3,
            fps,
            config: { damping: 13, stiffness: 160, mass: 0.6 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translateY(${interpolate(
                  wEnter,
                  [0, 1],
                  [26, 0]
                )}px) scale(${interpolate(wEnter, [0, 1], [0.7, 1])})`,
                opacity: wEnter,
                fontFamily:
                  "'Arial Rounded MT Bold', 'Poppins', 'Trebuchet MS', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 60,
                color: textColor,
                textShadow: "0 1px 0 rgba(255,255,255,0.4)",
                letterSpacing: -1,
              }}
            >
              {w}
            </span>
          );
        })}
        {emoji === "heart" && (
          <svg width={56} height={56} viewBox="0 0 32 32">
            <path
              d="M16 28 C 16 28 2 19 2 10 C 2 5 6 2 10 2 C 13 2 15 4 16 6 C 17 4 19 2 22 2 C 26 2 30 5 30 10 C 30 19 16 28 16 28 Z"
              fill="#ff5d7e"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
