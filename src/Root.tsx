import React from 'react';
import {Composition} from 'remotion';
import {ChristianVideo} from './Video';
import {WIDTH, HEIGHT, FPS, TIMING, s} from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ─── Full 10-minute production video ─────────────────────────────── */}
      <Composition
        id="ChristianYouTubeVideo"
        component={ChristianVideo}
        durationInFrames={s(TIMING.total)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />

      {/* ─── Preview compositions for faster iteration ────────────────────── */}
      <Composition
        id="ColdOpenPreview"
        component={ChristianVideo}
        durationInFrames={s(TIMING.coldOpen.dur)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{previewScene: 'coldOpen'}}
      />

      <Composition
        id="TitlePreview"
        component={ChristianVideo}
        durationInFrames={s(TIMING.title.dur)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{previewScene: 'title'}}
      />

      <Composition
        id="Sign1Preview"
        component={ChristianVideo}
        durationInFrames={s(TIMING.signs[0].dur)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{previewScene: 'sign1'}}
      />

      <Composition
        id="ConclusionPreview"
        component={ChristianVideo}
        durationInFrames={s(TIMING.conclusion.dur)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{previewScene: 'conclusion'}}
      />
    </>
  );
};
