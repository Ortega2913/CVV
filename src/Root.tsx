// ─────────────────────────────────────────────────────────────────────────────
// Remotion Root — registers all compositions
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Composition } from "remotion";
import { BibleLandsProphecy } from "./Video";
import { TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from "./constants";

// Load Google Fonts at root level so they are available across all scenes
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

loadInter();
loadPlayfair();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BibleLandsProphecy"
        component={BibleLandsProphecy}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />
    </>
  );
};
