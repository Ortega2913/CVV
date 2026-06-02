// ─────────────────────────────────────────────────────────────────────────────
// Remotion Root — registers all compositions
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Composition, registerRoot } from "remotion";
import { BibleLandsProphecy } from "./Video";
import { TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from "./constants";

// Load only the weights we actually use — cuts network requests from ~150 → ~8
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

loadInter("normal", { weights: ["300", "400", "600"], subsets: ["latin"] });
loadPlayfair("normal", { weights: ["400", "700"], subsets: ["latin"] });
loadPlayfair("italic", { weights: ["400", "700"], subsets: ["latin"] });

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

registerRoot(RemotionRoot);
