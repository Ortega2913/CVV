import React from "react";
import { Composition } from "remotion";
import { GospelTestimony } from "./GospelTestimony";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GospelTestimony"
      component={GospelTestimony}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
