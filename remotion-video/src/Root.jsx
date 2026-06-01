import React from 'react';
import { Composition } from 'remotion';
import { ThiefOnTheCross } from './ThiefOnTheCross';

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="ThiefOnTheCross"
        component={ThiefOnTheCross}
        durationInFrames={900} // 30 seconds @ 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
}
