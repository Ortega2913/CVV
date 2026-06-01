import React from 'react';
import {Composition} from 'remotion';
import {GethsemaneVideo} from './Video';
import {VIDEO_FPS, VIDEO_WIDTH, VIDEO_HEIGHT, TOTAL_FRAMES} from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GethsemaneVideo"
        component={GethsemaneVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
