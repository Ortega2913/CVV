import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import HookScene from './scenes/HookScene';
import ReenactmentScene from './scenes/ReenactmentScene';
import PrayerPointScene from './scenes/PrayerPointScene';
import CrushedScene from './scenes/CrushedScene';
import ProphecyScene from './scenes/ProphecyScene';
import EmotionalCloseScene from './scenes/EmotionalCloseScene';
import ChallengeScene from './scenes/ChallengeScene';
import FinalShotScene from './scenes/FinalShotScene';
import {
  TOTAL_FRAMES,
  SCENE_HOOK_START,
  SCENE_HOOK_END,
  SCENE_REENACT_START,
  SCENE_REENACT_END,
  SCENE_PRAYER_START,
  SCENE_PRAYER_END,
  SCENE_CRUSHED_START,
  SCENE_CRUSHED_END,
  SCENE_PROPHECY_START,
  SCENE_PROPHECY_END,
  SCENE_CLOSE_START,
  SCENE_CLOSE_END,
  SCENE_CHALLENGE_START,
  SCENE_CHALLENGE_END,
  SCENE_FINAL_START,
  SCENE_FINAL_END,
} from './constants';

export const GethsemaneVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#000000'}}>

      {/* ── 1. HOOK 0–12s ─────────────────────────── */}
      <Sequence
        from={SCENE_HOOK_START}
        durationInFrames={SCENE_HOOK_END - SCENE_HOOK_START}
        name="Hook"
      >
        <HookScene />
      </Sequence>

      {/* ── 2. REENACTMENT 12–20s ─────────────────── */}
      <Sequence
        from={SCENE_REENACT_START}
        durationInFrames={SCENE_REENACT_END - SCENE_REENACT_START}
        name="Reenactment"
      >
        <ReenactmentScene />
      </Sequence>

      {/* ── 3a. POINT 1 — Prayer 20–60s ───────────── */}
      <Sequence
        from={SCENE_PRAYER_START}
        durationInFrames={SCENE_PRAYER_END - SCENE_PRAYER_START}
        name="Point1 Prayer"
      >
        <PrayerPointScene />
      </Sequence>

      {/* ── 3b. POINT 2 — Crushed 60–100s ─────────── */}
      <Sequence
        from={SCENE_CRUSHED_START}
        durationInFrames={SCENE_CRUSHED_END - SCENE_CRUSHED_START}
        name="Point2 Crushed"
      >
        <CrushedScene />
      </Sequence>

      {/* ── 3c. POINT 3 — Prophecy 100–140s ──────── */}
      <Sequence
        from={SCENE_PROPHECY_START}
        durationInFrames={SCENE_PROPHECY_END - SCENE_PROPHECY_START}
        name="Point3 Prophecy"
      >
        <ProphecyScene />
      </Sequence>

      {/* ── 4. EMOTIONAL CLOSE 140–170s ───────────── */}
      <Sequence
        from={SCENE_CLOSE_START}
        durationInFrames={SCENE_CLOSE_END - SCENE_CLOSE_START}
        name="Emotional Close"
      >
        <EmotionalCloseScene />
      </Sequence>

      {/* ── 5. CHALLENGE 170–190s ─────────────────── */}
      <Sequence
        from={SCENE_CHALLENGE_START}
        durationInFrames={SCENE_CHALLENGE_END - SCENE_CHALLENGE_START}
        name="Challenge"
      >
        <ChallengeScene />
      </Sequence>

      {/* ── 6. FINAL SHOT 190–220s ────────────────── */}
      <Sequence
        from={SCENE_FINAL_START}
        durationInFrames={SCENE_FINAL_END - SCENE_FINAL_START}
        name="Final Shot"
      >
        <FinalShotScene />
      </Sequence>

    </AbsoluteFill>
  );
};
