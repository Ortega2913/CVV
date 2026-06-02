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

const TRAITS = [
  { label: "Middle Eastern", note: "Levantine descent", consensus: 0.95 },
  { label: "30–33 years old", note: "at his ministry", consensus: 0.88 },
  { label: "Wavy, dark hair", note: "shoulder length", consensus: 0.74 },
  { label: "Neat, full beard", note: "well kept", consensus: 0.81 },
];

const FaceSketch: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={360} height={460} viewBox="0 0 360 460" fill="none">
    {/* golden proportion guides over the face */}
    {[0.382, 0.5, 0.618].map((g, i) => (
      <DrawnPath key={i} progress={interpolate(progress, [0.3, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} d={`M40 ${40 + g * 360} L320 ${40 + g * 360}`} stroke={COLORS.gold} strokeWidth={1} opacity={0.4} />
    ))}
    <DrawnPath progress={progress} d="M180 50 L180 410" stroke={COLORS.gold} strokeWidth={1} opacity={0.35} />
    <g strokeLinecap="round" strokeLinejoin="round" stroke={COLORS.inkSoft}>
      {/* face oval */}
      <DrawnPath progress={progress} d="M180 70 C120 70 96 140 100 210 C104 280 140 360 180 380 C220 360 256 280 260 210 C264 140 240 70 180 70 Z" strokeWidth={2.4} />
      {/* hair */}
      <DrawnPath progress={progress} d="M104 200 C80 120 130 50 180 52 C230 50 280 120 256 200 C262 150 240 96 180 96 C120 96 98 150 104 200 Z" strokeWidth={2} />
      <DrawnPath progress={progress} d="M104 200 C92 280 96 330 120 360 M256 200 C268 280 264 330 240 360" strokeWidth={1.8} />
      {/* eyes */}
      <DrawnPath progress={progress} d="M140 200 q14 -12 30 0 M190 200 q16 -12 30 0" strokeWidth={2} />
      <circle cx={155} cy={203} r={3} fill={COLORS.inkSoft} opacity={progress > 0.6 ? 1 : 0} />
      <circle cx={205} cy={203} r={3} fill={COLORS.inkSoft} opacity={progress > 0.6 ? 1 : 0} />
      {/* nose + brows */}
      <DrawnPath progress={progress} d="M180 210 L172 250 q8 8 18 2" strokeWidth={2} />
      <DrawnPath progress={progress} d="M138 188 q16 -8 32 -2 M188 186 q16 -6 34 2" strokeWidth={1.6} />
      {/* beard */}
      <DrawnPath progress={progress} d="M120 300 C140 380 220 380 240 300 C236 350 200 392 180 392 C160 392 124 350 120 300 Z" strokeWidth={2} stroke={COLORS.inkSoft} />
      {/* mouth */}
      <DrawnPath progress={progress} d="M158 296 q22 10 44 0" strokeWidth={1.8} />
    </g>
  </svg>
);

const ChecklistItem: React.FC<{ index: number; data: (typeof TRAITS)[number] }> = ({ index, data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 40 - index * 16, fps, config: { damping: 200, mass: 0.7 } });
  const x = interpolate(s, [0, 1], [-30, 0]);
  const check = spring({ frame: frame - 50 - index * 16, fps, config: { damping: 200 } });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: s, transform: `translateX(${x}px)`, marginBottom: 22 }}>
      <svg width={44} height={44} viewBox="0 0 44 44">
        <circle cx={22} cy={22} r={20} fill="rgba(255,255,255,0.7)" stroke={COLORS.gold} strokeWidth={2} />
        <DrawnPath progress={check} d="M13 23 L19 30 L32 15" fill="none" stroke={COLORS.green} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <div style={{ fontFamily: SERIF, fontSize: 36, color: COLORS.ink, fontWeight: 600, lineHeight: 1.1 }}>{data.label}</div>
        <div style={{ fontFamily: SANS, fontSize: 18, color: COLORS.inkSoft }}>{data.note}</div>
      </div>
    </div>
  );
};

// Donut chart — "golden proportion" 61.8%.
const DonutChart: React.FC = () => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [60, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const target = 0.618;
  const value = prog * target;
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <svg width={200} height={200} viewBox="0 0 200 200">
      <circle cx={100} cy={100} r={r} fill="none" stroke={COLORS.paper3} strokeWidth={20} />
      <circle
        cx={100}
        cy={100}
        r={r}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={20}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        transform="rotate(-90 100 100)"
      />
      <text x={100} y={94} textAnchor="middle" fontFamily={SERIF_DISPLAY} fontSize={40} fontWeight={700} fill={COLORS.ink}>
        {Math.round(value * 100)}%
      </text>
      <text x={100} y={120} textAnchor="middle" fontFamily={SANS} fontSize={15} fill={COLORS.inkSoft}>
        golden ratio
      </text>
    </svg>
  );
};

// Horizontal consensus bars per trait.
const ConsensusBars: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: 420 }}>
      <div style={{ fontFamily: SANS, fontSize: 17, letterSpacing: 2, textTransform: "uppercase", color: COLORS.ochre, marginBottom: 14 }}>
        Scholarly consensus
      </div>
      {TRAITS.map((t, i) => {
        const p = interpolate(frame, [70 + i * 8, 110 + i * 8], [0, t.consensus], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 16, color: COLORS.inkSoft, marginBottom: 4 }}>
              <span>{t.label}</span>
              <span>{Math.round(p * 100)}%</span>
            </div>
            <div style={{ height: 12, background: COLORS.paper3, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${COLORS.goldDeep}, ${COLORS.gold})` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TraitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const faceProg = interpolate(frame, [10, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: SERIF_DISPLAY, fontSize: 64, fontWeight: 600, color: COLORS.ink }}>
        Physical Traits of the Figure
      </div>

      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 60, paddingTop: 70 }}>
        {/* face */}
        <div style={{ filter: "drop-shadow(0 18px 30px rgba(40,30,12,0.15))" }}>
          <FaceSketch progress={faceProg} />
        </div>

        {/* checklist */}
        <div>
          {TRAITS.map((t, i) => (
            <ChecklistItem key={i} index={i} data={t} />
          ))}
        </div>

        {/* charts */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <DonutChart />
          <ConsensusBars />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
