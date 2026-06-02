import React from "react";
import { Composition } from "remotion";
import { PlaylistDeletion } from "./PlaylistDeletion";

export const Root: React.FC = () => {
  return (
    <Composition
      id="PlaylistDeletion"
      component={PlaylistDeletion}
      durationInFrames={1350}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
