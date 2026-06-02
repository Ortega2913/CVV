import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { TextOverlay } from "./TextOverlay";
import { Transition } from "./Transition";
import { FilmGrain } from "./FilmGrain";

// 30s @ 30fps = 900 frames
// S1: 0–89   (0–3s)   = 90 frames
// S2: 90–239  (3–8s)  = 150 frames
// S3: 240–389 (8–13s) = 150 frames
// S4: 390–569 (13–19s)= 180 frames
// S5: 570–719 (19–24s)= 150 frames
// S6: 720–899 (24–30s)= 180 frames

export const GospelTestimony: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#030610" }}>
      {/* Scenes via Sequence (local frame = 0 inside each) */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1 />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <Scene2 />
      </Sequence>
      <Sequence from={240} durationInFrames={150}>
        <Scene3 />
      </Sequence>
      <Sequence from={390} durationInFrames={180}>
        <Scene4 />
      </Sequence>
      <Sequence from={570} durationInFrames={150}>
        <Scene5 />
      </Sequence>
      <Sequence from={720} durationInFrames={180}>
        <Scene6 />
      </Sequence>

      {/* Text overlays use global frame — rendered outside Sequence */}
      <GlobalTextAndEffects />
    </AbsoluteFill>
  );
};

const GlobalTextAndEffects: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Line 1 */}
      <TextOverlay text='I was suicidal at 3am…' startFrame={2} endFrame={55} position="lower-third" />
      <TextOverlay text='then I heard this song.' startFrame={48} endFrame={90} position="lower-third" />

      {/* Line 2 */}
      <TextOverlay
        text='Tears were flowing, my heart was broken…'
        startFrame={95}
        endFrame={175}
        position="lower-third"
      />
      <TextOverlay
        text='"You are not alone."'
        startFrame={170}
        endFrame={238}
        position="lower-third"
        gold
      />

      {/* Line 3 */}
      <TextOverlay
        text="In that moment I felt God's arms wrap around me."
        startFrame={245}
        endFrame={385}
        position="lower-third"
      />

      {/* Line 4 */}
      <TextOverlay
        text="If you're in that dark place right now—"
        startFrame={395}
        endFrame={460}
        position="lower-third"
      />
      <TextOverlay
        text={"God is with you.\nHe loves you even when you can't feel it."}
        startFrame={455}
        endFrame={565}
        position="lower-third"
      />

      {/* Line 5 */}
      <TextOverlay
        text={"Play this worship, cry it out,\nand let Him heal you."}
        startFrame={575}
        endFrame={715}
        position="lower-third"
      />

      {/* Line 6 */}
      <TextOverlay
        text="You're going to make it."
        startFrame={725}
        endFrame={840}
        position="center"
        gold
        large
      />

      {/* Transitions */}
      <Transition startFrame={83} durationFrames={16} type="crossdissolve" />
      <Transition startFrame={233} durationFrames={16} type="lightbloom" />
      <Transition startFrame={383} durationFrames={16} type="lightbloom" />
      <Transition startFrame={563} durationFrames={16} type="fade-warm" />
      <Transition startFrame={713} durationFrames={16} type="particle-burst" />

      {/* Film grain */}
      <FilmGrain opacity={0.045} />

      {/* Global vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)",
          zIndex: 20,
        }}
      />
    </AbsoluteFill>
  );
};
