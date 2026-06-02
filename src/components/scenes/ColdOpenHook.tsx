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
import {DramaticText} from '../DramaticText';
import {GlowEffect} from '../GlowEffect';
import {LightRays} from '../LightRays';

/*
  COLD OPEN HOOK — 15 seconds (0-450 frames)
  Hook viewer in the first 3 seconds.

  Timeline:
  0:00 – 0:01  (f0–30)   Pure black. Heartbeat implied. Just silence.
  0:01 – 0:03  (f30–90)  Phone screen glow emerges. Chaotic playlist visible.
  0:03 – 0:05  (f90–150) "What if God told you..." fades in
  0:05 – 0:07  (f150–210) DIVINE LIGHT BURST — flash overwhelms screen
  0:07 – 0:10  (f210–300) "TO DELETE YOUR ENTIRE PLAYLIST" slams in
  0:10 – 0:13  (f300–390) "RIGHT NOW?" springs in. Gold particles cascade.
  0:13 – 0:15  (f390–450) Fade to white → transition to title

  Midjourney prompt for phone screen content:
  "Close-up smartphone screen showing chaotic playlist: rap, trap, explicit music, dark background,
   red notifications, screen glow illuminating hands in dark room, cinematic, moody, 8k"
*/

// Simulated phone screen with chaotic playlist
const PhoneScreen: React.FC<{opacity: number; scale: number}> = ({opacity, scale}) => {
  const tracks = [
    {title: 'Blood Money', artist: 'Trap God', explicit: true},
    {title: 'No Boundaries', artist: 'Dark Wave', explicit: false},
    {title: 'Lust Season', artist: 'Vice', explicit: true},
    {title: 'Hollow Inside', artist: 'Night Shift', explicit: false},
    {title: 'Rage & Ruin', artist: 'Wreckage', explicit: true},
  ];

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        width: 320,
        background: 'linear-gradient(180deg, #0d0d0d 0%, #111118 100%)',
        borderRadius: 36,
        padding: '40px 0 20px',
        boxShadow: `0 0 80px rgba(59,130,246,0.4), 0 0 200px rgba(59,130,246,0.2), inset 0 0 30px rgba(255,255,255,0.03)`,
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Notch */}
      <div style={{
        width: 100, height: 28, background: '#0d0d0d',
        borderRadius: 14, margin: '0 auto 16px',
        border: '1px solid rgba(255,255,255,0.06)',
      }} />

      {/* App header */}
      <div style={{
        padding: '0 20px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{fontFamily: FONTS.body, fontSize: 18, fontWeight: 700, color: '#fff'}}>
          My Playlist
        </div>
        <div style={{
          background: '#ef4444', color: '#fff',
          fontFamily: FONTS.body, fontSize: 11, fontWeight: 700,
          padding: '2px 8px', borderRadius: 10,
        }}>
          247 songs
        </div>
      </div>

      {/* Track list */}
      {tracks.map((t, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: i === 0 ? 'rgba(239,68,68,0.08)' : 'transparent',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 6, flexShrink: 0,
            background: `linear-gradient(135deg, hsl(${i * 40},50%,20%), hsl(${i * 40 + 20},60%,15%))`,
          }} />
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{
              fontFamily: FONTS.body, fontSize: 13, fontWeight: 600,
              color: i === 0 ? '#ef4444' : '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {t.title} {t.explicit && <span style={{fontSize: 9, background: '#666', padding: '1px 3px', borderRadius: 2}}>E</span>}
            </div>
            <div style={{fontFamily: FONTS.body, fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2}}>
              {t.artist}
            </div>
          </div>
          {i === 0 && (
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: '#ef4444',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#fff', flexShrink: 0,
            }}>▶</div>
          )}
        </div>
      ))}

      {/* "Now Playing" bar */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(239,68,68,0.12)',
        display: 'flex', alignItems: 'center', gap: 10,
        borderTop: '1px solid rgba(239,68,68,0.2)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: 'linear-gradient(135deg, #8b0000, #ef4444)',
          flexShrink: 0,
        }} />
        <div style={{flex: 1}}>
          <div style={{fontFamily: FONTS.body, fontSize: 12, fontWeight: 600, color: '#ef4444'}}>
            Blood Money
          </div>
          <div style={{height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4}}>
            <div style={{width: '38%', height: '100%', background: '#ef4444', borderRadius: 2}} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Flash effect — sudden overwhelming divine light
const DivineLightFlash: React.FC<{frame: number}> = ({frame}) => {
  // Flash peaks at frame 0, fades out over 30 frames
  const intensity = interpolate(frame, [0, 3, 30], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `rgba(255, 252, 240, ${intensity * 0.95})`,
        pointerEvents: 'none',
      }}
    />
  );
};

export const ColdOpenHook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ─── Phase timings ────────────────────────────────────────────────────────
  const PHASE = {
    blackout:     { in: 0,   out: 30  }, // f0–30: pure black
    phoneGlow:    { in: 30,  out: 90  }, // f30–90: phone appears
    question:     { in: 90,  out: 150 }, // f90–150: first question text
    divineFLash:  { in: 150, out: 175 }, // f150–175: white flash
    slamText1:    { in: 175, out: 300 }, // f175–300: "TO DELETE"
    slamText2:    { in: 300, out: 390 }, // f300–390: "RIGHT NOW?"
    fadeToWhite:  { in: 390, out: 450 }, // f390–450: fade out
  };

  // ─── Phone screen ─────────────────────────────────────────────────────────
  const phoneOpacity = interpolate(
    frame,
    [PHASE.phoneGlow.in, PHASE.phoneGlow.in + 20, PHASE.divineFLash.in, PHASE.divineFLash.in + 10],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const phoneScale = spring({
    fps,
    frame: Math.max(0, frame - PHASE.phoneGlow.in),
    config: {damping: 200, stiffness: 60},
    from: 0.7,
    to: 1,
  });

  // ─── Blue phone glow on background ────────────────────────────────────────
  const bgGlowOpacity = interpolate(
    frame,
    [PHASE.phoneGlow.in, PHASE.phoneGlow.in + 30, PHASE.divineFLash.in, PHASE.divineFLash.in + 5],
    [0, 0.5, 0.5, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── Question text ("What if God told you...") ────────────────────────────
  const questionOpacity = interpolate(
    frame,
    [PHASE.question.in, PHASE.question.in + 20, PHASE.divineFLash.in - 10, PHASE.divineFLash.in],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── After-flash: dramatic dark background surge ──────────────────────────
  const postFlashBgOpacity = interpolate(
    frame,
    [PHASE.divineFLash.out, PHASE.divineFLash.out + 10],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── Gold light rays (after flash) ────────────────────────────────────────
  const raysOpacity = interpolate(
    frame,
    [PHASE.divineFLash.out, PHASE.divineFLash.out + 30, PHASE.slamText2.out],
    [0, 0.6, 0.3],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // ─── Final fade to white ──────────────────────────────────────────────────
  const fadeToWhite = interpolate(
    frame,
    [PHASE.fadeToWhite.in, PHASE.fadeToWhite.out],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{background: COLORS.darkBg, overflow: 'hidden'}}>

      {/* ── Pre-flash: blue phone glow background ─────────────────────────── */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 55%, rgba(59,130,246,0.25) 0%, transparent 80%)',
          opacity: bgGlowOpacity,
        }}
      />

      {/* ── Phone Screen ──────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phoneOpacity,
        }}
      >
        <PhoneScreen opacity={1} scale={phoneScale} />
      </AbsoluteFill>

      {/* ── Question text ──────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '10%',
          opacity: questionOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.scripture,
            fontSize: 50,
            fontStyle: 'italic',
            fontWeight: 400,
            color: COLORS.offWhite,
            textAlign: 'center',
            maxWidth: '70%',
            lineHeight: 1.4,
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          }}
        >
          "What if God told you to delete your entire playlist...{' '}
          <span
            style={{
              color: COLORS.goldBright,
              textShadow: `0 0 30px ${COLORS.gold}`,
            }}
          >
            right now?"
          </span>
        </div>
      </AbsoluteFill>

      {/* ── Divine Light Flash ────────────────────────────────────────────── */}
      <Sequence from={PHASE.divineFLash.in} durationInFrames={PHASE.divineFLash.out - PHASE.divineFLash.in}>
        <DivineLightFlash frame={frame - PHASE.divineFLash.in} />
      </Sequence>

      {/* ── Post-flash scene: dark with gold accent ───────────────────────── */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${COLORS.darkBg} 0%, #0a0520 50%, ${COLORS.darkBg} 100%)`,
          opacity: postFlashBgOpacity,
        }}
      />

      {/* ── Light rays from center ────────────────────────────────────────── */}
      {frame >= PHASE.divineFLash.out && (
        <div style={{opacity: raysOpacity}}>
          <LightRays color={COLORS.gold} intensity={0.5} numRays={14} originX={50} originY={40} />
        </div>
      )}

      {/* ── Gold glow pulse in center ─────────────────────────────────────── */}
      {frame >= PHASE.divineFLash.out && (
        <div style={{opacity: raysOpacity * 0.8}}>
          <GlowEffect color={COLORS.gold} intensity={0.4} blur={120} x="50%" y="40%" />
        </div>
      )}

      {/* ── Main hook text slam ───────────────────────────────────────────── */}
      {frame >= PHASE.slamText1.in && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {/* "GOD TOLD ME TO" — smaller */}
          <DramaticText
            text="God Told Me To..."
            style="tracking-reveal"
            delay={PHASE.slamText1.in}
            fontSize={52}
            color={COLORS.offWhite}
            glowColor={COLORS.gold}
          />

          {/* "DELETE THIS" — massive slam */}
          <DramaticText
            text="DELETE THIS"
            style="slam-in"
            delay={PHASE.slamText1.in + 12}
            fontSize={180}
            color={COLORS.white}
            glowColor={COLORS.gold}
          />
        </AbsoluteFill>
      )}

      {/* ── "Right Now?" ─────────────────────────────────────────────────── */}
      {frame >= PHASE.slamText2.in && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '14%',
          }}
        >
          <DramaticText
            text="Right now?"
            style="scale-reveal"
            delay={PHASE.slamText2.in}
            fontSize={110}
            color={COLORS.goldBright}
            glowColor={COLORS.gold}
            fontFamily={FONTS.scripture}
          />
        </AbsoluteFill>
      )}

      {/* ── Fade to white for transition ──────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: COLORS.gloryYellow,
          opacity: fadeToWhite,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
