import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import {COLORS, FONTS, s} from '../../constants';
import {SignCard} from '../SignCard';
import {ScriptureReveal} from '../ScriptureReveal';
import {NarratorText} from '../NarratorText';
import {DramaticText} from '../DramaticText';
import {GlowEffect} from '../GlowEffect';
import {LightRays} from '../LightRays';
import {PlaylistVisual} from '../PlaylistVisual';
import {ThreeDScene} from '../three/ThreeDScene';

/*
  SIGN SECTION — 100 seconds each (3000 frames)
  Reusable component for each of the 5 signs.

  Per-sign timeline (in frames within the section):
  0:00 – 0:10  (f0–300)    Entry: big 3D number orbits in + sign title slam
  0:10 – 0:20  (f300–600)  Visual: symbolic scene / image area establishes
  0:20 – 0:40  (f600–1200) Narrator lines 1-3 with visuals + retention hooks
  0:40 – 0:55  (f1200–1650) Scripture reveal in gold
  0:55 – 1:20  (f1650–2400) Narrator continues + additional visual moments
  1:20 – 1:35  (f2400–2700) Retention hook (visual surprise / zoom burst)
  1:35 – 1:40  (f2700–3000) Exit: fade + preview next number
*/

interface SignSectionProps {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  scripture: string;
  scriptureRef: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  narratorLines: string[];
  imagePrompt: string; // AI image prompt — see comment in each section
}

// Hero visual area — stylized placeholder. Replace with actual AI-generated image.
const HeroVisual: React.FC<{
  number: number;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  frame: number;
}> = ({number, primaryColor, accentColor, glowColor, frame}) => {
  const pulse = Math.sin((frame / 45) * Math.PI) * 0.08 + 0.92;

  // Each sign gets a unique symbolic visual built from CSS
  const visuals: Record<number, React.ReactNode> = {
    1: (
      /* Sign 1: Phone in dark room — person awake at 3am */
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        background: `linear-gradient(200deg, #030510 0%, ${primaryColor} 50%, #040814 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Bedroom backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(59,130,246,0.15) 0%, transparent 60%)',
        }} />
        {/* Phone glow suggestion */}
        <div style={{
          width: 200, height: 360, background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20,
          boxShadow: `0 0 60px rgba(59,130,246,${0.2 * pulse}), 0 0 120px rgba(59,130,246,0.1)`,
          display: 'flex', flexDirection: 'column', padding: 10, gap: 6,
        }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              height: 30, borderRadius: 4,
              background: `rgba(255,255,255,${0.04 + i * 0.015})`,
              border: i === 0 ? '1px solid rgba(239,68,68,0.3)' : 'none',
            }} />
          ))}
        </div>
        {/* "3:00 AM" overlay */}
        <div style={{
          position: 'absolute', top: '15%', right: '20%',
          fontFamily: FONTS.body, fontSize: 52, fontWeight: 300,
          color: 'rgba(147,197,253,0.6)', letterSpacing: '0.1em',
          textShadow: '0 0 30px rgba(147,197,253,0.4)',
        }}>3:00 AM</div>
        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 137.508) % 100}%`,
            top: `${(i * 71) % 60}%`,
            width: 2, height: 2, borderRadius: '50%',
            background: 'white',
            opacity: 0.2 + (Math.sin(frame * 0.05 + i) * 0.15),
          }} />
        ))}
      </div>
    ),
    2: (
      /* Sign 2: Church worship — one person disconnected */
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        background: `linear-gradient(180deg, #0a1a0d 0%, ${primaryColor} 40%, #050a0e 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Warm church light shafts */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,200,80,0.12) 0%, transparent 60%)',
        }} />
        {/* Crowd silhouettes with raised hands */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 15, alignItems: 'flex-end',
          padding: '0 10%',
        }}>
          {[...Array(11)].map((_, i) => {
            const isCenter = i === 5;
            const raisedArms = !isCenter && (i % 2 === 0);
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                {raisedArms && (
                  <div style={{
                    display: 'flex', gap: 20,
                  }}>
                    <div style={{width: 6, height: 60, background: `rgba(255,200,80,${0.4 - i * 0.02})`, borderRadius: 3, transform: 'rotate(-20deg)', transformOrigin: 'bottom' }} />
                    <div style={{width: 6, height: 60, background: `rgba(255,200,80,${0.4 - i * 0.02})`, borderRadius: 3, transform: 'rotate(20deg)', transformOrigin: 'bottom' }} />
                  </div>
                )}
                <div style={{
                  width: isCenter ? 28 : 22,
                  height: isCenter ? 100 : 80,
                  background: isCenter
                    ? 'rgba(100,120,140,0.4)'
                    : `rgba(255,200,80,${0.15 + (10 - Math.abs(i - 5)) * 0.02})`,
                  borderRadius: '50% 50% 0 0',
                }} />
              </div>
            );
          })}
        </div>
        <div style={{
          position: 'absolute', bottom: '28%', left: '43%',
          fontFamily: FONTS.body, fontSize: 13, fontWeight: 600,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.1em',
        }}>↑ disconnected</div>
      </div>
    ),
    3: (
      /* Sign 3: Music → thoughts split */
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex',
      }}>
        {/* Left: dark/secular */}
        <div style={{
          flex: 1,
          background: `linear-gradient(135deg, #1a0518 0%, #2a0a2a 100%)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 12, padding: 20,
          borderRight: '2px solid rgba(255,255,255,0.1)',
        }}>
          {['Rage', 'Lust', 'Fear', 'Emptiness', 'Pride'].map((word, i) => (
            <div key={i} style={{
              fontFamily: FONTS.body, fontSize: 22, fontWeight: 700,
              color: `rgba(239,68,68,${0.7 - i * 0.1})`,
              transform: `rotate(${-3 + i * 2}deg)`,
              textShadow: '0 0 15px rgba(239,68,68,0.5)',
            }}>{word}</div>
          ))}
          <div style={{
            position: 'absolute', bottom: '10%',
            fontFamily: FONTS.body, fontSize: 13,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em',
          }}>Secular Lyrics ↓</div>
        </div>
        {/* Right: divine/worship */}
        <div style={{
          flex: 1,
          background: `linear-gradient(135deg, #0d1a0a 0%, #1a2e10 100%)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 12, padding: 20,
        }}>
          {['Peace', 'Joy', 'Love', 'Purpose', 'Faith'].map((word, i) => (
            <div key={i} style={{
              fontFamily: FONTS.body, fontSize: 22, fontWeight: 700,
              color: `rgba(${i === 0 ? '245,158,11' : '250,204,21'},${0.9 - i * 0.1})`,
              transform: `rotate(${2 - i * 1.5}deg)`,
              textShadow: `0 0 15px ${COLORS.gold}88`,
            }}>{word}</div>
          ))}
          <div style={{
            position: 'absolute', bottom: '10%',
            fontFamily: FONTS.body, fontSize: 13,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em',
          }}>Worship Lyrics ↓</div>
        </div>
      </div>
    ),
    4: (
      /* Sign 4: Divine light + music notes */
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        background: `linear-gradient(180deg, ${primaryColor} 0%, #0a0d1a 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 3, height: '70%',
          background: `linear-gradient(180deg, ${COLORS.goldLight} 0%, transparent 100%)`,
          filter: 'blur(4px)',
          boxShadow: `0 0 30px ${COLORS.gold}`,
        }} />
        {/* Musical note particles */}
        {['♩','♪','♫','♬','♩','♪'].map((note, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${20 + i * 12}%`,
            top: `${20 + Math.sin(frame * 0.03 + i) * 15}%`,
            fontFamily: FONTS.body,
            fontSize: 36 + (i % 3) * 12,
            color: COLORS.goldLight,
            opacity: 0.3 + Math.cos(frame * 0.04 + i * 0.7) * 0.2,
            textShadow: `0 0 20px ${COLORS.gold}`,
            transform: `rotate(${Math.sin(frame * 0.02 + i) * 15}deg)`,
          }}>{note}</div>
        ))}
        <div style={{
          fontFamily: FONTS.scripture,
          fontSize: 120, fontStyle: 'italic',
          color: COLORS.gold,
          opacity: 0.08,
          position: 'absolute',
        }}>♫</div>
      </div>
    ),
    5: (
      /* Sign 5: Prayer → breakthrough */
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex',
      }}>
        {/* Left: dark/dry */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(180deg, #0a0a12 0%, #1a1008 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
          borderRight: '2px solid rgba(255,255,255,0.08)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Cracked earth pattern */}
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${10 + i * 15}%`, top: `${60 + (i % 2) * 15}%`,
              width: `${20 + i * 5}%`, height: 1,
              background: 'rgba(255,255,255,0.06)',
              transform: `rotate(${i * 30}deg)`,
            }} />
          ))}
          <div style={{fontSize: 70, opacity: 0.5}}>🙏</div>
          <div style={{
            fontFamily: FONTS.body, fontSize: 16, color: 'rgba(255,255,255,0.25)',
            textAlign: 'center', letterSpacing: '0.08em',
          }}>Dry Season</div>
        </div>
        {/* Right: breakthrough */}
        <div style={{
          flex: 1,
          background: `linear-gradient(180deg, ${glowColor}22 0%, #0d1a0a 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '80%', height: '60%',
            background: `radial-gradient(ellipse, ${glowColor}30 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }} />
          <div style={{fontSize: 70, filter: `drop-shadow(0 0 20px ${glowColor})`}}>🌅</div>
          <div style={{
            fontFamily: FONTS.body, fontSize: 16, color: COLORS.goldLight,
            textAlign: 'center', letterSpacing: '0.08em',
          }}>Breakthrough</div>
        </div>
      </div>
    ),
  };

  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
      {visuals[number] ?? visuals[1]}
      {/*
        ═══════════════════════════════════════════════════════════════════
        TO REPLACE WITH AI-GENERATED IMAGE:

        1. Use the imagePrompt property from SIGNS data in constants.ts
           with Midjourney, Grok Imagine, or DALL-E 3

        2. Save the image to: public/images/sign-{number}-hero.jpg
           (1920x1080, JPG quality 95)

        3. Replace this entire <div> with:
           <Img src={staticFile(`images/sign-${number}-hero.jpg`)}
                style={{width:'100%', height:'100%', objectFit:'cover'}} />

        4. Import Img from 'remotion' at the top of this file.
        ═══════════════════════════════════════════════════════════════════
      */}
    </div>
  );
};

// Retention hook — visual surprise every 8-12 seconds to prevent drop-off
const RetentionHook: React.FC<{
  frame: number;
  accentColor: string;
  glowColor: string;
  type: 'zoom-burst' | 'color-flash' | 'particle-burst';
}> = ({frame, accentColor, glowColor, type}) => {
  const localF = Math.max(0, frame);
  const intensity = interpolate(localF, [0, 5, 30, 45], [0, 1, 1, 0], {extrapolateRight: 'clamp'});

  if (type === 'zoom-burst') {
    return (
      <AbsoluteFill style={{
        background: `radial-gradient(circle, ${glowColor}${Math.round(intensity * 0.25 * 255).toString(16).padStart(2,'0')} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
    );
  }
  if (type === 'color-flash') {
    return (
      <AbsoluteFill style={{
        background: accentColor,
        opacity: intensity * 0.15,
        pointerEvents: 'none',
      }} />
    );
  }
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 50%, ${glowColor}44 0%, transparent 50%)`,
      opacity: intensity,
      filter: 'blur(40px)',
      pointerEvents: 'none',
    }} />
  );
};

export const SignSection: React.FC<SignSectionProps> = ({
  number,
  title,
  subtitle,
  description,
  scripture,
  scriptureRef,
  primaryColor,
  accentColor,
  glowColor,
  narratorLines,
  imagePrompt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ─── Section phase timings (frames within this 3000-frame section) ────────
  const PH = {
    entry:          { in: 0,    out: 300  },  // 0–10s: SignCard entry
    visual:         { in: 180,  out: 900  },  // 6–30s: hero visual
    narrator1:      { in: 270,  out: 540  },  // 9–18s: narrator lines 1-3
    narrator2:      { in: 540,  out: 870  },  // 18–29s: narrator lines 4-5
    scripture:      { in: 870,  out: 1500 },  // 29–50s: scripture reveal
    narrator3:      { in: 1500, out: 1950 },  // 50–65s: narrator lines 6+
    hook1:          { in: 900,  out: 960  },  // 30s: retention hook #1
    hook2:          { in: 1800, out: 1860 },  // 60s: retention hook #2
    playlist:       { in: 1950, out: 2550 },  // 65–85s: playlist visual
    hook3:          { in: 2400, out: 2460 },  // 80s: retention hook #3
    cta:            { in: 2600, out: 2900 },  // 86–96.7s: pre-exit CTA
    exit:           { in: 2850, out: 3000 },  // 95–100s: fade out
  };

  // ─── Background ───────────────────────────────────────────────────────────
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const exitFade = interpolate(frame, [PH.exit.in, PH.exit.out], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // ─── Hero visual ──────────────────────────────────────────────────────────
  const visualOpacity = interpolate(
    frame,
    [PH.visual.in, PH.visual.in + 30, PH.scripture.in + 60, PH.scripture.in + 90],
    [0, 1, 1, 0.3],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── Build narrator lines with timing ─────────────────────────────────────
  const framesPerLine = 90; // ~3 seconds per line
  const narratorData = narratorLines.map((text, i) => ({
    text,
    startFrame: i < 3
      ? PH.narrator1.in + i * framesPerLine
      : i < 5
      ? PH.narrator2.in + (i - 3) * framesPerLine
      : PH.narrator3.in + (i - 5) * framesPerLine,
    durationFrames: 85,
    highlight: [], // Key words to highlight gold — add per line if desired
  }));

  // ─── Sign card entry ──────────────────────────────────────────────────────
  const cardOpacity = interpolate(
    frame,
    [PH.entry.in, PH.entry.in + 10, PH.visual.in + 60, PH.visual.in + 90],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── Playlist transition ───────────────────────────────────────────────────
  const playlistOpacity = interpolate(
    frame,
    [PH.playlist.in, PH.playlist.in + 30, PH.cta.in, PH.cta.in + 30],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── Light glow ──────────────────────────────────────────────────────────
  const glowPulse = interpolate(
    frame,
    [PH.scripture.in, PH.scripture.in + 90],
    [0, 0.6],
    {extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>

      {/* ── Background ────────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 30%, ${primaryColor} 0%, ${COLORS.darkBg} 70%)`,
          opacity: bgOpacity,
        }}
      />

      {/* ── Hero visual (right side, blurred edges) ───────────────────────── */}
      <AbsoluteFill style={{opacity: visualOpacity}}>
        <div style={{
          position: 'absolute',
          right: 0, top: 0, bottom: 0,
          width: '55%',
          overflow: 'hidden',
        }}>
          <HeroVisual
            number={number}
            primaryColor={primaryColor}
            accentColor={accentColor}
            glowColor={glowColor}
            frame={frame}
          />
          {/* Bleed-left mask so visual blends into background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(90deg, ${COLORS.darkBg} 0%, transparent 35%, transparent 85%, ${COLORS.darkBg} 100%)`,
          }} />
        </div>
      </AbsoluteFill>

      {/* ── Accent glow behind scripture ─────────────────────────────────── */}
      {frame >= PH.scripture.in && (
        <div style={{opacity: glowPulse}}>
          <GlowEffect color={glowColor} intensity={0.35} blur={140} x="50%" y="50%" />
        </div>
      )}

      {/* ── Sign card: big number + title ────────────────────────────────── */}
      <AbsoluteFill
        style={{
          opacity: cardOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '6%',
          paddingRight: '50%',
        }}
      >
        <SignCard
          number={number}
          title={title}
          subtitle={subtitle}
          accentColor={accentColor}
          glowColor={glowColor}
          delay={PH.entry.in}
        />
      </AbsoluteFill>

      {/* ── Narrator lines ───────────────────────────────────────────────── */}
      <NarratorText lines={narratorData} fontSize={36} position="lower-third" />

      {/* ── Scripture reveal ────────────────────────────────────────────── */}
      {frame >= PH.scripture.in && (
        <ScriptureReveal
          verse={scripture}
          reference={scriptureRef}
          delay={PH.scripture.in}
          duration={PH.scripture.out - PH.scripture.in}
          position="center"
        />
      )}

      {/* ── Playlist visual (mid-section visual break) ──────────────────── */}
      <AbsoluteFill
        style={{
          opacity: playlistOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {frame >= PH.playlist.in && (
          <PlaylistVisual
            type={number === 1 || number === 5 ? 'split' : 'secular'}
            delay={PH.playlist.in}
            activeIndex={1}
          />
        )}
      </AbsoluteFill>

      {/* ── Retention hooks (visual surprises) ───────────────────────────── */}
      {frame >= PH.hook1.in && frame < PH.hook1.out && (
        <RetentionHook frame={frame - PH.hook1.in} accentColor={accentColor} glowColor={glowColor} type="zoom-burst" />
      )}
      {frame >= PH.hook2.in && frame < PH.hook2.out && (
        <RetentionHook frame={frame - PH.hook2.in} accentColor={accentColor} glowColor={glowColor} type="particle-burst" />
      )}
      {frame >= PH.hook3.in && frame < PH.hook3.out && (
        <RetentionHook frame={frame - PH.hook3.in} accentColor={accentColor} glowColor={glowColor} type="color-flash" />
      )}

      {/* ── Pre-exit CTA text ─────────────────────────────────────────────── */}
      {frame >= PH.cta.in && number < 5 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '5%',
          }}
        >
          <DramaticText
            text={`Sign #${number + 1} Coming Up...`}
            style="tracking-reveal"
            delay={PH.cta.in}
            fontSize={30}
            color={`${accentColor}`}
            glowColor={glowColor}
            fontFamily={FONTS.body}
          />
        </AbsoluteFill>
      )}

      {/* ── Exit: fade to dark ──────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: COLORS.darkBg,
          opacity: exitFade,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
