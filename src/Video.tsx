import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Audio,
  staticFile,
} from 'remotion';
import {TIMING, SIGNS, COLORS, s} from './constants';

// Scene components
import {ColdOpenHook} from './components/scenes/ColdOpenHook';
import {TitleReveal} from './components/scenes/TitleReveal';
import {SignSection} from './components/scenes/SignSection';
import {Conclusion} from './components/scenes/Conclusion';

// Global overlay components
import {FilmGrain} from './components/FilmGrain';
import {CrossParticles} from './components/CrossParticles';
import {Vignette} from './components/Vignette';
import {ColorGrade} from './components/ColorGrade';

// ─── Scene preview prop ────────────────────────────────────────────────────
interface VideoProps {
  // Set via defaultProps in Root.tsx — allows rendering individual scenes for fast preview.
  // Leave undefined to render the full 10-minute video.
  previewScene?: 'coldOpen' | 'title' | 'sign1' | 'sign2' | 'sign3' | 'sign4' | 'sign5' | 'conclusion';
}

// ─── Background music volume automation ───────────────────────────────────
// Describes the emotional arc of the music:
//  • Opens with tense/dramatic underscore
//  • Swells during title reveal
//  • Settles to atmospheric bed during signs (narrator can be heard)
//  • Builds again toward conclusion
//  • Fades out gracefully
const useVolumeAutomation = () => {
  const frame = useCurrentFrame();

  return interpolate(
    frame,
    [
      0,
      s(2),          // fade in
      s(12),         // cold open peak
      s(15),         // transition
      s(20),         // title swell
      s(30),         // settle for narrator
      s(525),        // pre-conclusion build
      s(550),        // conclusion peak
      s(610),        // fade out
      s(TIMING.total),
    ],
    [
      0,
      0.55,
      0.80,
      0.45,
      0.90,
      0.35,          // under narrator (keep low so voice can be heard)
      0.35,
      0.85,
      0.60,
      0,
    ],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
};

// ─── Main composition ────────────────────────────────────────────────────
export const ChristianVideo: React.FC<VideoProps> = ({previewScene}) => {
  const volume = useVolumeAutomation();

  // Preview mode: render a single scene directly (no time offset)
  if (previewScene) {
    const sceneMap: Record<string, React.ReactNode> = {
      coldOpen:   <ColdOpenHook />,
      title:      <TitleReveal />,
      sign1:      <SignSection {...SIGNS[0]} />,
      sign2:      <SignSection {...SIGNS[1]} />,
      sign3:      <SignSection {...SIGNS[2]} />,
      sign4:      <SignSection {...SIGNS[3]} />,
      sign5:      <SignSection {...SIGNS[4]} />,
      conclusion: <Conclusion />,
    };
    return (
      <AbsoluteFill style={{background: COLORS.darkBg}}>
        {sceneMap[previewScene]}
        <FilmGrain opacity={0.035} />
        <Vignette intensity={0.65} />
      </AbsoluteFill>
    );
  }

  // ─── Full video composition ──────────────────────────────────────────
  return (
    <AbsoluteFill style={{background: COLORS.darkBg}}>

      {/*
        ══════════════════════════════════════════════════════════════════
        BACKGROUND MUSIC
        ══════════════════════════════════════════════════════════════════
        1. Download a royalty-free track (see README for recommended sources)
        2. Save to: public/audio/background.mp3
        3. Uncomment the <Audio> block below.

        Recommended tracks (search on these platforms):
        • Epidemic Sound: "Eternal Light" / "Infinite Peace" / "Sacred"
        • Artlist: "Divine" / "Celestial" / "Beyond the Stars"
        • Pixabay: "Emotional Piano" / "Cinematic Orchestral Intro"

        The track should have:
        - Tense, dramatic beginning (first 30s)
        - Hopeful, uplifting orchestral mid-section (30s–8min)
        - Soft, peaceful resolution (final 2min)
        ══════════════════════════════════════════════════════════════════

      <Audio
        src={staticFile('audio/background.mp3')}
        volume={volume}
        loop
        startFrom={0}
      />
      */}

      {/*
        ══════════════════════════════════════════════════════════════════
        VOICE-OVER
        ══════════════════════════════════════════════════════════════════
        Record the narrator lines from SIGNS[n].narratorLines in constants.ts
        using a deep, compassionate male voice (or use ElevenLabs AI voice).

        Recommended ElevenLabs voices:
        - "Adam" (deep, authoritative, warm)
        - "Daniel" (British, thoughtful, calm)
        - "Josh" (young, passionate)

        Save individual scene voice files to:
        public/audio/vo-cold-open.mp3
        public/audio/vo-sign-1.mp3  ... vo-sign-5.mp3
        public/audio/vo-conclusion.mp3

        Then add per-scene <Audio> components inside each <Sequence>.
        ══════════════════════════════════════════════════════════════════
      */}

      {/* ── Persistent cross particle atmosphere ──────────────────────────── */}
      <CrossParticles count={40} baseOpacity={0.15} />

      {/* ── SCENE 1: Cold Open Hook (0–15s) ──────────────────────────────── */}
      <Sequence
        from={s(TIMING.coldOpen.start)}
        durationInFrames={s(TIMING.coldOpen.dur)}
        name="ColdOpenHook"
      >
        <ColdOpenHook />
      </Sequence>

      {/* ── SCENE 2: Title Reveal (15–30s) ───────────────────────────────── */}
      <Sequence
        from={s(TIMING.title.start)}
        durationInFrames={s(TIMING.title.dur)}
        name="TitleReveal"
      >
        <TitleReveal />
      </Sequence>

      {/* ── SCENES 3–7: The 5 Signs (30–530s) ───────────────────────────── */}
      {SIGNS.map((sign, i) => (
        <Sequence
          key={sign.number}
          from={s(TIMING.signs[i].start)}
          durationInFrames={s(TIMING.signs[i].dur)}
          name={`Sign${sign.number}_${sign.title}`}
        >
          <SignSection {...sign} />
        </Sequence>
      ))}

      {/* ── SCENE 8: Conclusion & CTA (530–620s) ─────────────────────────── */}
      <Sequence
        from={s(TIMING.conclusion.start)}
        durationInFrames={s(TIMING.conclusion.dur)}
        name="Conclusion"
      >
        <Conclusion />
      </Sequence>

      {/* ══ GLOBAL OVERLAYS (always rendered on top) ═══════════════════════ */}

      {/* Cinematic color grade */}
      <ColorGrade preset="cinematic-dark" intensity={0.9} />

      {/* Organic film grain */}
      <FilmGrain opacity={0.032} blendMode="overlay" />

      {/* Vignette */}
      <Vignette intensity={0.6} />

    </AbsoluteFill>
  );
};
