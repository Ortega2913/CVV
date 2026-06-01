import React from "react";
import { Composition } from "remotion";
import { FaithVideo } from "./Video";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./theme";

/**
 * Composition registry. The "Faith" composition is the full 30s short.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Faith"
      component={FaithVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
