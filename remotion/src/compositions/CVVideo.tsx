import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "./Background";
import { IntroScene } from "./IntroScene";
import { ExperienceScene } from "./ExperienceScene";
import { SkillsScene } from "./SkillsScene";
import { AimsScene } from "./AimsScene";
import { HobbiesScene } from "./HobbiesScene";
import { OutroScene } from "./OutroScene";
import { SceneWrapper } from "./Transitions";
import {
  INTRO_START,
  TAGLINE_START,
  EXPERIENCE_START,
  SKILLS_START,
  AIMS_START,
  HOBBIES_START,
  OUTRO_START,
  TOTAL_FRAMES,
} from "./constants";

export function CVVideo() {
  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif" }}>
      {/* Persistent background */}
      <Background />

      {/* Scene: Intro / Hero */}
      <SceneWrapper startFrame={INTRO_START} endFrame={EXPERIENCE_START - 1}>
        <IntroScene startFrame={INTRO_START} />
      </SceneWrapper>

      {/* Scene: Work Experience */}
      <SceneWrapper startFrame={EXPERIENCE_START} endFrame={SKILLS_START - 1}>
        <ExperienceScene startFrame={EXPERIENCE_START} />
      </SceneWrapper>

      {/* Scene: Skills */}
      <SceneWrapper startFrame={SKILLS_START} endFrame={AIMS_START - 1}>
        <SkillsScene startFrame={SKILLS_START} />
      </SceneWrapper>

      {/* Scene: Aims */}
      <SceneWrapper startFrame={AIMS_START} endFrame={HOBBIES_START - 1}>
        <AimsScene startFrame={AIMS_START} />
      </SceneWrapper>

      {/* Scene: Hobbies */}
      <SceneWrapper startFrame={HOBBIES_START} endFrame={OUTRO_START - 1}>
        <HobbiesScene startFrame={HOBBIES_START} />
      </SceneWrapper>

      {/* Scene: Outro / Contact */}
      <SceneWrapper startFrame={OUTRO_START} endFrame={TOTAL_FRAMES - 1}>
        <OutroScene startFrame={OUTRO_START} />
      </SceneWrapper>
    </AbsoluteFill>
  );
}
