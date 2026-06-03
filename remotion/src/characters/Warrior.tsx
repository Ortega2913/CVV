import React from "react";

interface Props {
  frame: number;
}

export function Warrior({ frame }: Props) {
  const breathe = Math.sin(frame * 0.07) * 3.5;
  const glow    = 0.65 + Math.sin(frame * 0.055) * 0.35;
  const eyeGlow = 0.7  + Math.sin(frame * 0.11)  * 0.3;
  const swordShimmer = 0.15 + Math.sin(frame * 0.09) * 0.1;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, calc(-50% + ${breathe}px))`,
      }}
    >
      <svg
        viewBox="0 0 260 520"
        width={260}
        height={520}
        style={{
          display: "block",
          filter: [
            `drop-shadow(0 0 ${28 * glow}px rgba(255,70,0,0.95))`,
            `drop-shadow(0 0 55px rgba(180,30,0,0.55))`,
            `drop-shadow(0 2px 4px rgba(0,0,0,0.9))`,
          ].join(" "),
        }}
      >
        {/* ─── SWORD (rendered behind arm) ─────────────────────── */}
        {/* Blade */}
        <path d="M 210 42 L 205 318 L 215 318 L 214 48 Z" fill="#B0C4D8" />
        {/* Edge highlight */}
        <path d="M 212 42 L 207 318 L 209 318 L 211 48 Z" fill="#DCE8F5" opacity={0.85} />
        {/* Blood groove */}
        <line x1="210" y1="70" x2="210" y2="305" stroke="#8898A8" strokeWidth={1} />
        {/* Crossguard */}
        <rect x="192" y="312" width="52" height="13" rx="5" fill="#9B7A1A" />
        <ellipse cx="192" cy="318" rx="7" ry="9" fill="#BF9A2A" />
        <ellipse cx="244" cy="318" rx="7" ry="9" fill="#BF9A2A" />
        {/* Grip */}
        <rect x="204" y="323" width="15" height="44" rx="4" fill="#4A2E0C" />
        {[330, 342, 354].map((y) => (
          <rect key={y} x="202" y={y} width="19" height="4" rx="2" fill="#6A4E2C" />
        ))}
        {/* Pommel */}
        <ellipse cx="211" cy="371" rx="12" ry="9" fill="#9B7A1A" />
        {/* Blade glow */}
        <path d="M 210 42 L 205 318 L 215 318 L 214 48 Z"
          fill={`rgba(200,225,255,${swordShimmer})`} />

        {/* ─── HELMET ────────────────────────────────────────────── */}
        {/* Back dome */}
        <path d="M 82 92 Q 80 38 128 30 Q 176 38 174 92 Z" fill="#250606" />
        {/* Crest ridge */}
        <rect x="124" y="24" width="8" height="48" rx="3" fill="#7A1515" />
        <ellipse cx="128" cy="22" rx="10" ry="6" fill="#CC2000" />
        {/* Face plate */}
        <path d="M 84 92 Q 82 128 100 138 Q 128 145 156 138 Q 174 128 172 92 Z"
          fill="#1C0404" />
        {/* Brow ridge */}
        <path d="M 84 92 Q 82 78 128 72 Q 174 78 172 92 L 84 92 Z" fill="#2A0707" />
        {/* Cheek guards */}
        <path d="M 84 95 L 68 122 L 84 128 L 90 115 Z" fill="#1C0404" />
        <path d="M 172 95 L 188 122 L 172 128 L 166 115 Z" fill="#1C0404" />
        {/* Visor slits */}
        <path d="M 92 90 L 114 87 L 114 96 L 92 99 Z" fill={`rgba(255,80,0,${eyeGlow})`} />
        <path d="M 142 87 L 164 90 L 164 99 L 142 96 Z" fill={`rgba(255,80,0,${eyeGlow})`} />
        {/* Eye glow bloom */}
        <ellipse cx="103" cy="93" rx="10" ry="5" fill="#FF5500" opacity={eyeGlow * 0.85} />
        <ellipse cx="153" cy="93" rx="10" ry="5" fill="#FF5500" opacity={eyeGlow * 0.85} />
        {/* Chin guard */}
        <path d="M 100 136 L 96 150 L 160 150 L 156 136 Z" fill="#1C0404" />

        {/* ─── GORGET (neck) ───────────────────────────────────── */}
        <rect x="112" y="148" width="32" height="20" rx="4" fill="#200606" />

        {/* ─── PAULDRONS ──────────────────────────────────────── */}
        {/* Left */}
        <path d="M 52 148 Q 28 142 24 166 Q 20 188 58 192 L 88 184 L 88 148 Z"
          fill="#200606" />
        <path d="M 52 148 Q 34 145 32 162 Q 30 178 55 179 L 79 174 L 82 152 Z"
          fill="#2E0808" />
        {/* Left spikes */}
        <path d="M 32 152 L 22 132 L 38 148 Z" fill="#8B1A1A" />
        <path d="M 44 148 L 36 127 L 52 145 Z" fill="#8B1A1A" />
        {/* Right */}
        <path d="M 204 148 Q 228 142 232 166 Q 236 188 198 192 L 168 184 L 168 148 Z"
          fill="#200606" />
        <path d="M 204 148 Q 222 145 224 162 Q 226 178 201 179 L 177 174 L 174 152 Z"
          fill="#2E0808" />
        {/* Right spikes */}
        <path d="M 224 152 L 234 132 L 218 148 Z" fill="#8B1A1A" />
        <path d="M 212 148 L 220 127 L 204 145 Z" fill="#8B1A1A" />

        {/* ─── BREASTPLATE ────────────────────────────────────── */}
        <path d="M 88 148 L 86 288 L 170 288 L 168 148
                 Q 148 136 128 134 Q 108 136 88 148 Z"
          fill="#190404" />
        {/* Chest plate face */}
        <path d="M 96 162 L 128 155 L 160 162 L 158 218 L 128 226 L 98 218 Z"
          fill="#220606" />
        {/* Pec definition */}
        <path d="M 100 168 Q 116 162 128 168 Q 116 184 100 182 Z" fill="#2E0808" />
        <path d="M 156 168 Q 140 162 128 168 Q 140 184 156 182 Z" fill="#2E0808" />
        {/* Center rune */}
        <path d="M 120 195 L 128 183 L 136 195 L 128 212 Z"
          stroke="#FF4400" strokeWidth={1.5} fill="none" opacity={glow} />
        <circle cx="128" cy="198" r="5" fill="#FF5500" opacity={glow * 0.7} />
        {/* Rune side lines */}
        <line x1="96" y1="155" x2="98" y2="285" stroke="#FF4400" strokeWidth={0.5} opacity={glow * 0.35} />
        <line x1="160" y1="155" x2="158" y2="285" stroke="#FF4400" strokeWidth={0.5} opacity={glow * 0.35} />

        {/* ─── ARMS ────────────────────────────────────────────── */}
        {/* Left upper arm */}
        <rect x="60" y="188" width="30" height="72" rx="9" fill="#190404" />
        <rect x="65" y="192" width="20" height="66" rx="6" fill="#220606" />
        {/* Left forearm */}
        <rect x="56" y="258" width="26" height="80" rx="7" fill="#190404" />
        {/* Left gauntlet */}
        <rect x="52" y="335" width="34" height="38" rx="6" fill="#220606" />
        {/* Left fingers (partial fist) */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={54 + i * 7} y="370" width="6" height="18" rx="3" fill="#190404" />
        ))}

        {/* Right upper arm */}
        <rect x="166" y="188" width="30" height="72" rx="9" fill="#190404" />
        <rect x="171" y="192" width="20" height="66" rx="6" fill="#220606" />
        {/* Right forearm */}
        <rect x="170" y="258" width="26" height="80" rx="7" fill="#190404" />
        {/* Right gauntlet (gripping sword) */}
        <rect x="198" y="316" width="20" height="12" rx="4" fill="#220606" />

        {/* ─── WAIST ───────────────────────────────────────────── */}
        <rect x="88" y="284" width="80" height="20" rx="5" fill="#220606" />
        <rect x="114" y="284" width="28" height="20" rx="3" fill="#9B7A1A" />
        <rect x="120" y="287" width="16" height="14" rx="2" fill="#BF9A2A" />

        {/* ─── TASSETS ─────────────────────────────────────────── */}
        <path d="M 88 302 L 82 354 L 114 354 L 118 302 Z" fill="#190404" />
        <path d="M 138 302 L 142 354 L 174 354 L 168 302 Z" fill="#190404" />

        {/* ─── LEGS ─────────────────────────────────────────────── */}
        {/* Left thigh */}
        <rect x="90" y="348" width="46" height="86" rx="9" fill="#190404" />
        <rect x="95" y="352" width="36" height="79" rx="6" fill="#220606" />
        {/* Left shin */}
        <rect x="92" y="432" width="42" height="68" rx="7" fill="#190404" />
        {/* Left sabaton */}
        <path d="M 88 496 L 82 514 L 138 514 L 136 496 Z" fill="#220606" />

        {/* Right thigh */}
        <rect x="120" y="348" width="46" height="86" rx="9" fill="#190404" />
        <rect x="125" y="352" width="36" height="79" rx="6" fill="#220606" />
        {/* Right shin */}
        <rect x="122" y="432" width="42" height="68" rx="7" fill="#190404" />
        {/* Right sabaton */}
        <path d="M 118 496 L 116 514 L 172 514 L 168 496 Z" fill="#220606" />

        {/* ─── GLOBAL EYE BLOOM ────────────────────────────────── */}
        <ellipse cx="128" cy="93" rx="48" ry="10"
          fill="#FF4400" opacity={eyeGlow * 0.08} />
      </svg>
    </div>
  );
}
