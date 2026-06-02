import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SANS, SERIF, SERIF_DISPLAY } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { DrawnPath } from "../components/DrawnPath";
import { AnimatedWords } from "../components/AnimatedText";

const CARDS = [
  {
    n: "I",
    title: "Jesus First",
    body: "Place the divine figure on the exact central axis.",
    color: COLORS.goldDeep,
  },
  {
    n: "II",
    title: "The Disciples",
    body: "Arrange the figures in a natural, flowing semicircle.",
    color: COLORS.blueDeep,
  },
  {
    n: "III",
    title: "Fill the Space",
    body: "Balance foreground and mid-ground so no void remains.",
    color: COLORS.red,
  },
];

const Diagram: React.FC = () => {
  const frame = useCurrentFrame();
  // canvas coords 0..1000 x 0..420
  const W = 1000;
  const H = 420;
  const cx = W / 2;
  const horizon = H * 0.42;

  const perspProg = interpolate(frame, [6, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goldProg = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arcProg = interpolate(frame, [50, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const haloProg = interpolate(frame, [40, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const haloPulse = 1 + Math.sin(frame / 16) * 0.04;

  // disciple dots along a semicircle
  const dots = 6;
  const radius = 250;
  const dotEls = new Array(dots).fill(0).map((_, i) => {
    const t = i / (dots - 1);
    const a = Math.PI * (0.12 + t * 0.76); // lower semicircle spread
    const x = cx + Math.cos(a) * radius * (i < dots / 2 ? -1 : 1) * 0 + (t - 0.5) * 2 * radius;
    const y = horizon + Math.sin(a) * 70 + 40;
    const appear = spring({ frame: frame - 55 - i * 4, fps: 30, config: { damping: 200 } });
    return { x, y, appear, i };
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* frame */}
      <rect x="2" y="2" width={W - 4} height={H - 4} fill="rgba(255,255,255,0.35)" stroke={COLORS.goldDeep} strokeWidth={2} rx={6} />

      {/* vanishing-point perspective lines */}
      {[
        `M0 0 L${cx} ${horizon}`,
        `M${W} 0 L${cx} ${horizon}`,
        `M0 ${H} L${cx} ${horizon}`,
        `M${W} ${H} L${cx} ${horizon}`,
        `M0 ${horizon} L${W} ${horizon}`,
      ].map((d, i) => (
        <DrawnPath key={i} progress={perspProg} d={d} stroke={COLORS.gridStrong} strokeWidth={1.2} strokeDasharray={undefined} />
      ))}

      {/* golden-section vertical guides */}
      {[0.382, 0.618].map((g, i) => (
        <DrawnPath key={i} progress={goldProg} d={`M${W * g} 0 L${W * g} ${H}`} stroke={COLORS.gold} strokeWidth={1.4} />
      ))}
      {[0.382, 0.618].map((g, i) => (
        <DrawnPath key={`h${i}`} progress={goldProg} d={`M0 ${H * g} L${W} ${H * g}`} stroke={COLORS.gold} strokeWidth={0.8} opacity={0.5} />
      ))}

      {/* semicircle guide */}
      <DrawnPath
        progress={arcProg}
        d={`M${cx - radius} ${horizon + 40} Q${cx} ${horizon + 180} ${cx + radius} ${horizon + 40}`}
        fill="none"
        stroke={COLORS.blue}
        strokeWidth={2}
      />

      {/* disciple markers */}
      {dotEls.map((d) => (
        <g key={d.i} opacity={d.appear} transform={`translate(${d.x} ${d.y}) scale(${d.appear})`}>
          <circle r={12} fill={COLORS.blue} opacity={0.18} />
          <circle r={7} fill="none" stroke={COLORS.blueDeep} strokeWidth={2} />
          <circle r={2.5} fill={COLORS.blueDeep} />
        </g>
      ))}

      {/* central halo + figure */}
      <g transform={`translate(${cx} ${horizon}) scale(${haloPulse})`} opacity={haloProg}>
        <circle r={70} fill={COLORS.goldLight} opacity={0.22} />
        <circle r={48} fill={COLORS.goldLight} opacity={0.3} />
        {new Array(20).fill(0).map((_, i) => {
          const a = (i / 20) * Math.PI * 2;
          return (
            <line key={i} x1={Math.cos(a) * 30} y1={Math.sin(a) * 30} x2={Math.cos(a) * 64} y2={Math.sin(a) * 64} stroke={COLORS.gold} strokeWidth={1.4} opacity={0.7} />
          );
        })}
        <circle r={26} fill="none" stroke={COLORS.goldDeep} strokeWidth={2.5} />
        {/* tiny robed figure */}
        <path d="M0 -14 a8 8 0 1 0 0.01 0 M-14 46 Q0 -2 14 46 Z" fill={COLORS.inkSoft} opacity={0.85} />
      </g>

      {/* center axis */}
      <DrawnPath progress={goldProg} d={`M${cx} 0 L${cx} ${H}`} stroke={COLORS.goldDeep} strokeWidth={1.6} />
    </svg>
  );
};

const Card: React.FC<{ index: number; total: number; data: (typeof CARDS)[number] }> = ({
  index,
  data,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 70 - index * 10, fps, config: { damping: 200, mass: 0.8 } });
  const y = interpolate(s, [0, 1], [40, 0]);

  return (
    <div
      style={{
        flex: 1,
        opacity: s,
        transform: `translateY(${y}px)`,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(2px)",
        border: `1px solid ${COLORS.paper3}`,
        borderTop: `3px solid ${data.color}`,
        borderRadius: 10,
        padding: "22px 26px",
        boxShadow: "0 18px 40px rgba(40,30,12,0.12)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: SERIF_DISPLAY, fontSize: 38, color: data.color, fontWeight: 700 }}>
          {data.n}
        </span>
        <span style={{ fontFamily: SERIF, fontSize: 38, color: COLORS.ink, fontWeight: 600 }}>
          {data.title}
        </span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 21, color: COLORS.inkSoft, marginTop: 8, lineHeight: 1.45 }}>
        {data.body}
      </div>
    </div>
  );
};

export const CompositionScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div
        style={{
          position: "absolute",
          top: 54,
          width: "100%",
          textAlign: "center",
          fontFamily: SERIF_DISPLAY,
          fontWeight: 600,
          fontSize: 64,
          color: COLORS.ink,
        }}
      >
        <AnimatedWords text="The Three Rules of Composition" delay={4} stagger={2} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 150,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1180,
          height: 470,
        }}
      >
        <Diagram />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 46,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1480,
          display: "flex",
          gap: 26,
        }}
      >
        {CARDS.map((c, i) => (
          <Card key={i} index={i} total={CARDS.length} data={c} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
