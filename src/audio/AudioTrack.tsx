import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { DURATION_IN_FRAMES, ENABLE_AUDIO, FPS, SCENES } from "../theme";

/**
 * Full audio bed, synced to the visuals:
 *  - music.mp3      cinematic piano + swelling strings (dark -> hopeful)
 *  - voiceover.mp3  deep male narration across the full 30s
 *  - ambience.mp3   wind/thunder fading to birds at sunrise
 *
 * Disabled by default (see ENABLE_AUDIO in theme.ts) so the composition renders
 * even before you've added the files to /public/audio. Drop the three files in
 * and flip ENABLE_AUDIO to true.
 */
export const AudioTrack: React.FC = () => {
  if (!ENABLE_AUDIO) {
    return null;
  }

  const fade = (frame: number) =>
    interpolate(
      frame,
      [0, FPS, DURATION_IN_FRAMES - FPS, DURATION_IN_FRAMES],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  return (
    <>
      {/* Music swells louder in the hopeful closing */}
      <Audio
        src={staticFile("audio/music.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, SCENES.closing.start, DURATION_IN_FRAMES],
            [0.55, 0.7, 0.95],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ) * fade(f)
        }
      />

      {/* Voiceover sits on top, clear and forward */}
      <Audio src={staticFile("audio/voiceover.mp3")} volume={1} />

      {/* Ambience: loud wind in the storm, ducking under the sunrise birds */}
      <Sequence durationInFrames={DURATION_IN_FRAMES} name="Ambience">
        <Audio
          src={staticFile("audio/ambience.mp3")}
          volume={(f) =>
            interpolate(
              f,
              [0, SCENES.cross.start, SCENES.closing.start],
              [0.5, 0.35, 0.25],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) * fade(f)
          }
        />
      </Sequence>
    </>
  );
};
