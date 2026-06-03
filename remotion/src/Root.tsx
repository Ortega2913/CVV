import React from "react";
import { Composition } from "remotion";
import { CVVideo } from "./compositions/CVVideo";
import { WIDTH, HEIGHT, FPS, TOTAL_FRAMES } from "./compositions/constants";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="CVVideo"
        component={CVVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
}
