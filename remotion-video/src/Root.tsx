import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

loadPlayfair("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
loadCormorant("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
loadCormorant("italic", { weights: ["500", "600"], subsets: ["latin"] });
loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DesigningTheDivine"
      component={Main}
      durationInFrames={945}
      fps={30}
      width={1920}
      height={864}
    />
  );
};
