import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENES, TRANSITION } from "./theme";
import { HookScene } from "./scenes/HookScene";
import { CrossScene } from "./scenes/CrossScene";
import { ClosingScene } from "./scenes/ClosingScene";
import { LightLeak } from "./effects/LightLeak";
import { FilmGrain } from "./effects/FilmGrain";
import { Vignette } from "./effects/Vignette";
import { AudioTrack } from "./audio/AudioTrack";

/**
 * Faith — "The Repentant Thief" (Luke 23:43)
 * A 30s cinematic vertical short.
 *
 * Timeline:
 *   0s  - 5s   HookScene    — stormy hill, two crosses, dramatic push-in
 *   5s  - 22s  CrossScene   — three crosses, orbit, "Jesus, remember me"
 *   22s - 30s  ClosingScene — sunrise crane-up, "Salvation is a gift" + CTA
 *
 * Global film treatment (grain + vignette) sits on top of everything so the
 * whole piece feels like one continuous graded shot.
 */
export const FaithVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* ---- Synced audio bed (music + voiceover + ambience) ---- */}
      <AudioTrack />

      {/* ---- Scene 1: HOOK ---- */}
      <Sequence
        from={SCENES.hook.start}
        durationInFrames={SCENES.hook.duration + TRANSITION}
        name="Hook"
      >
        <HookScene />
      </Sequence>

      {/* Transition: warm light leak + whoosh into the crosses */}
      <Sequence
        from={SCENES.cross.start - TRANSITION}
        durationInFrames={TRANSITION * 2}
        name="Transition · Hook→Cross"
      >
        <LightLeak warm flip />
      </Sequence>

      {/* ---- Scene 2: MAIN MESSAGE ---- */}
      <Sequence
        from={SCENES.cross.start}
        durationInFrames={SCENES.cross.duration + TRANSITION}
        name="Cross"
      >
        <CrossScene />
      </Sequence>

      {/* Transition: bright hopeful leak into sunrise */}
      <Sequence
        from={SCENES.closing.start - TRANSITION}
        durationInFrames={TRANSITION * 2}
        name="Transition · Cross→Closing"
      >
        <LightLeak warm bright />
      </Sequence>

      {/* ---- Scene 3: CLOSING + CTA ---- */}
      <Sequence
        from={SCENES.closing.start}
        durationInFrames={SCENES.closing.duration}
        name="Closing"
      >
        <ClosingScene />
      </Sequence>

      {/* ---- Global film grade ---- */}
      <Vignette />
      <FilmGrain />
    </AbsoluteFill>
  );
};
