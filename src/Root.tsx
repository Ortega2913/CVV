import React from "react";
import { Composition } from "remotion";
import { FaithVideo } from "./Video";
import { PotatoPals } from "./potato/PotatoPals";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./theme";

/**
 * Composition registry.
 *  - "Faith"      : the 30s cinematic faith short.
 *  - "PotatoPals" : motion-graphics package over the uploaded 10s potato clip.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Faith"
        component={FaithVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PotatoPals"
        component={PotatoPals}
        durationInFrames={241}
        fps={24}
        width={832}
        height={1504}
      />
    </>
  );
};
