import React from "react";

interface Props {
  frame: number;
}

export function Sage({ frame }: Props) {
  const float     = Math.sin(frame * 0.055) * 6;
  const glow      = 0.55 + Math.sin(frame * 0.065 + 1) * 0.45;
  const orbPulse  = 0.4  + Math.sin(frame * 0.13)  * 0.6;
  const runeAlpha = 0.4  + Math.sin(frame * 0.09 + 2) * 0.3;

  // Five orbiting particles around orb
  const orbitalParticles = Array.from({ length: 5 }, (_, i) => {
    const angle  = (frame * 0.06) + i * ((Math.PI * 2) / 5);
    const radius = 28;
    return {
      cx: 185 + Math.cos(angle) * radius,
      cy:  80 + Math.sin(angle) * radius * 0.5,
      r:   1.5 + (i % 2) * 1,
    };
  });

  // Rune glyphs floating around robe
  const runePositions = [
    { x: 96, y: 230 }, { x: 104, y: 285 }, { x: 98, y: 340 },
    { x: 118, y: 260 }, { x: 108, y: 310 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, calc(-50% + ${float}px))`,
      }}
    >
      <svg
        viewBox="0 0 240 520"
        width={200}
        height={435}
        style={{
          display: "block",
          filter: [
            `drop-shadow(0 0 ${32 * glow}px rgba(70,110,255,0.95))`,
            `drop-shadow(0 0 65px rgba(50,80,200,0.55))`,
            `drop-shadow(0 2px 4px rgba(0,0,0,0.9))`,
          ].join(" "),
        }}
      >
        {/* ─── STAFF ────────────────────────────────────────────── */}
        <rect x="180" y="102" width="8" height="375" rx="4" fill="#3C2A10" />
        {/* Bindings */}
        {[130, 175, 218, 262, 305, 350, 390, 430].map((y) => (
          <rect key={y} x="178" y={y} width="12" height="7" rx="3" fill="#5C4020" />
        ))}
        {/* Spike tip */}
        <path d="M 180 477 L 184 477 L 182 494 Z" fill="#8080D0" />

        {/* ─── ORB ─────────────────────────────────────────────── */}
        {/* Outer aura rings */}
        <circle cx="185" cy="80" r="36" fill={`rgba(50,70,255,${orbPulse * 0.22})`} />
        <circle cx="185" cy="80" r="28" fill={`rgba(70,90,255,${orbPulse * 0.35})`} />
        {/* Core */}
        <circle cx="185" cy="80" r="20" fill="#101860" />
        <circle cx="185" cy="80" r="14" fill="#1E2890" />
        {/* Specular highlights */}
        <circle cx="179" cy="73" r="6" fill="#7088EE" opacity={0.65} />
        <circle cx="186" cy="78" r="3" fill="#A0B8FF" opacity={0.5} />
        {/* Inner star burst */}
        <path d="M 185 66 L 187 76 L 197 78 L 187 80 L 185 90 L 183 80 L 173 78 L 183 76 Z"
          fill="#99BBFF" opacity={orbPulse * 0.75} />
        {/* Orbital particles */}
        {orbitalParticles.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r}
            fill="#6688FF" opacity={orbPulse * 0.7} />
        ))}

        {/* ─── HOOD ─────────────────────────────────────────────── */}
        <path d="M 60 95 Q 58 40 112 28 Q 140 20 165 42 Q 180 58 174 95
                 Q 162 128 112 132 Q 68 128 60 95 Z"
          fill="#060620" />
        {/* Hood inner shadow */}
        <path d="M 68 98 Q 66 52 112 40 Q 158 52 156 98
                 Q 144 120 112 124 Q 76 120 68 98 Z"
          fill="#0A0A30" />

        {/* ─── FACE ─────────────────────────────────────────────── */}
        <ellipse cx="112" cy="96" rx="30" ry="32" fill="#0C0C38" />
        {/* Brow ridge */}
        <path d="M 84 88 Q 112 80 140 88" stroke="#18186A" strokeWidth={3} fill="none" />
        {/* Eyes */}
        <ellipse cx="98"  cy="95" rx="6" ry="5" fill={`rgba(60,130,255,${glow})`} />
        <ellipse cx="126" cy="95" rx="6" ry="5" fill={`rgba(60,130,255,${glow})`} />
        {/* Eye sparkle */}
        <circle cx="99"  cy="93" r="2.5" fill="#AACCFF" opacity={glow * 0.8} />
        <circle cx="127" cy="93" r="2.5" fill="#AACCFF" opacity={glow * 0.8} />
        {/* Eye glow bloom */}
        <ellipse cx="112" cy="95" rx="38" ry="8" fill="#3366FF" opacity={glow * 0.08} />
        {/* Arcane mark on forehead */}
        <path d="M 105 76 L 112 68 L 119 76 L 112 84 Z"
          stroke="#6688FF" strokeWidth={1} fill="none" opacity={runeAlpha} />
        {/* Nose */}
        <path d="M 109 100 L 107 110 L 117 110 L 115 100 Z" fill="#080828" />
        {/* Lips */}
        <path d="M 102 116 Q 112 122 122 116" stroke="#2A2A7A" strokeWidth={1.5} fill="none" />

        {/* ─── MANTLE / COLLAR ─────────────────────────────────── */}
        <path d="M 66 128 Q 56 142 52 165 L 172 165
                 Q 168 142 158 128 Q 136 138 112 140 Q 86 138 66 128 Z"
          fill="#0A0A32" />

        {/* ─── ROBE BODY ───────────────────────────────────────── */}
        {/* Outer robe */}
        <path d="M 68 162 L 42 478 L 182 478 L 156 162 Z" fill="#060620" />
        {/* Left panel highlight */}
        <path d="M 74 168 L 50 462 L 68 462 L 86 174 Z" fill="#0E0E40" />
        {/* Right panel highlight */}
        <path d="M 150 168 L 174 462 L 156 462 L 138 174 Z" fill="#0E0E40" />
        {/* Center seam */}
        <path d="M 102 168 L 96 468 L 128 468 L 122 168 Z" fill="#080830" />
        {/* Hem trim */}
        <rect x="42" y="472" width="140" height="6" rx="2" fill="#2A2A9C" />
        <rect x="42" y="470" width="140" height="4" rx="2" fill="#5555BB" opacity={0.4} />

        {/* ─── ARCANE RUNES ON ROBE ────────────────────────────── */}
        {runePositions.map((pos, i) => (
          <g key={i} opacity={runeAlpha * (0.5 + (i % 3) * 0.2)}>
            <line x1={pos.x}     y1={pos.y - 7} x2={pos.x}     y2={pos.y + 7} stroke="#4466FF" strokeWidth={1} />
            <line x1={pos.x - 7} y1={pos.y}     x2={pos.x + 7} y2={pos.y}     stroke="#4466FF" strokeWidth={1} />
            <circle cx={pos.x} cy={pos.y} r={3} fill="#2244CC" />
          </g>
        ))}

        {/* ─── SASH / BELT ─────────────────────────────────────── */}
        <rect x="88" y="210" width="48" height="14" rx="5" fill="#1E1E7A" />
        <ellipse cx="112" cy="217" rx="10" ry="7" fill="#3A3AAA" />
        <circle cx="112" cy="217" r="4" fill="#5555CC" />

        {/* ─── SLEEVES ─────────────────────────────────────────── */}
        {/* Left sleeve — flowing down */}
        <path d="M 68 168 L 22 328 L 40 336 L 82 180 Z" fill="#060620" />
        <path d="M 72 170 L 28 320 L 36 328 L 78 178 Z" fill="#0E0E40" opacity={0.6} />
        {/* Left hand */}
        <ellipse cx="31" cy="342" rx="14" ry="9" fill="#0C0C38" />
        {/* Casting particles from left hand */}
        {[0, 1, 2, 3].map((i) => {
          const a = frame * 0.12 + i * 1.57;
          return (
            <circle key={i}
              cx={31 + Math.cos(a) * 10}
              cy={336 + Math.sin(a) * 7}
              r={2.5 - i * 0.5}
              fill="#4466FF"
              opacity={(orbPulse - i * 0.18) * 0.9}
            />
          );
        })}

        {/* Right sleeve */}
        <path d="M 156 168 L 202 328 L 184 336 L 142 180 Z" fill="#060620" />
        <path d="M 152 170 L 196 320 L 188 328 L 146 178 Z" fill="#0E0E40" opacity={0.6} />
        {/* Right hand (holding staff) */}
        <ellipse cx="176" cy="220" rx="12" ry="8" fill="#0C0C38" />
      </svg>
    </div>
  );
}
