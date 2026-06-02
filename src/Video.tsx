// ─────────────────────────────────────────────────────────────────────────────
// BibleLandsProphecy — Main Remotion Composition
// All 18 scenes are sequenced here. Edit narrator text, images, and timing
// in src/constants.ts (scene timings, images) and the individual components.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import { S, TOTAL_FRAMES, IMG } from "./constants";
import { SceneContainer } from "./components/SceneContainer";
import { KenBurnsImage } from "./components/KenBurnsImage";
import { NarratorText } from "./components/NarratorText";
import { BibleVerse } from "./components/BibleVerse";
import { TitleCard } from "./components/TitleCard";
import { MapAnimation } from "./components/MapAnimation";
import { SplitScreen } from "./components/SplitScreen";
import { Credits } from "./components/Credits";
import { DroneOverlay } from "./components/DroneOverlay";

// ─── Narrator copy ────────────────────────────────────────────────────────────
const NARRATION = {
  N01: `In the heart of the Middle East lies a small strip of land that has shaped human history more than any other. These are the Bible Lands — Israel, Jordan, Egypt, Lebanon, and Syria. Here, Abraham walked. Moses led. David conquered. And Jesus taught. But these lands are not just museums of the past. Today, they are living clues to the prophecies written thousands of years ago.`,

  N03: `For nearly 2,000 years, the Jewish people were scattered across the earth — exactly as the prophets foretold. Moses warned in Deuteronomy 28 that they would be uprooted from the land and scattered among the nations. Yet in 1948, against all odds and after the horrors of the Holocaust, Israel was reborn in a single day.`,

  N04: `Isaiah 66:8 asks: "Can a nation be born in a day?" The answer came on May 14, 1948. The regathering of the Jewish people is one of the clearest signs Jesus Himself pointed to in Matthew 24 — the fig tree putting forth leaves. Many Bible scholars believe this generation that saw Israel reborn will not pass until all things are fulfilled.`,

  N05: `Every shovel we put in the ground confirms the Bible. But more than that — the very existence of Israel today is the greatest archaeological discovery of all.`,

  N06: `The prophets spoke of a day when Israel would be re-established, the desert would bloom, and the nations would fix their eyes on Jerusalem.`,

  N07: `In 1900, Mark Twain described Palestine as a desolate country with scarcely a tree or shrub. Today it feeds its own people and exports food to Europe. The desert is literally blooming — just as Isaiah 35:1 prophesied.`,

  N08: `Perhaps the most explosive clue is the Temple. Jesus prophesied its destruction, fulfilled in 70 AD. But Ezekiel, Daniel, and Revelation speak of a future Temple. Today, the Temple Institute has prepared priestly garments, vessels, and trained Levitical priests. The red heifer, essential for purification, has been bred in Israel.`,

  N09: `We are not forcing prophecy. We are simply getting ready, as the Bible commands. The Temple will be rebuilt when God decides the time is right.`,

  N10: `The Bible speaks of specific nations and coalitions in the last days. Ezekiel 38–39 describes a massive invasion from the far north, joined by Persia (modern Iran), Turkey, Libya, and others against a restored Israel. Psalm 83 describes a conspiracy of surrounding nations seeking to wipe Israel off the map.`,

  N11: `We see alliances forming and shifting exactly as described. Iran's nuclear ambitions, Russia's involvement in Syria, and constant pressure on Israel's borders — these are not random. They are stage-setting for prophecy.`,

  N12: `Even the earth itself seems to be preparing. The Dead Sea is mentioned in prophecy as a place of future healing in Ezekiel 47. Today, seismic activity and geological changes are increasing — signs many connect to the coming events described in Zechariah 14.`,

  N13: `These are not signs to cause fear, but to awaken hope. Jesus said in Luke 21:28: "When these things begin to take place, stand up and lift up your heads, because your redemption is drawing near."`,

  N14: `The time is short. Jesus is coming soon. Get ready.`,

  N15: `The same hills where Jesus stood and taught His disciples about the signs of His return still stand today. The Bible Lands are not silent. They are shouting. From the rebirth of Israel to the blooming desert, from preparations for the Temple to the gathering storms around her borders — the clues are everywhere.`,

  N16: `The question is not whether prophecy is being fulfilled. The question is: Are you ready for what comes next?`,

  N17: `"Watch therefore, for you do not know what hour your Lord is coming." — Matthew 24:42`,
};

// ─── Main composition ─────────────────────────────────────────────────────────
export const BibleLandsProphecy: React.FC = () => {
  const frame = useCurrentFrame();

  // Music volume automation — quieter during heavy narration, swell at key moments
  const musicVolume = (f: number): number => {
    // Open with a quiet swell to full, then duck under narration
    return interpolate(
      f,
      [
        0, 30,
        S.JERUSALEM.from + 60, S.TITLE.from,
        S.TITLE.from + 10, S.TITLE.from + S.TITLE.duration,
        S.BEN_GURION.from, S.BEN_GURION.from + 60,
        S.TEMPLE.from, S.TEMPLE.from + 60,
        S.MAP.from, S.MAP.from + 60,
        TOTAL_FRAMES - 90, TOTAL_FRAMES,
      ],
      [
        0, 0.18,
        0.18, 0.55,
        0.55, 0.45,
        0.45, 0.18,
        0.18, 0.20,
        0.20, 0.22,
        0.22, 0,
      ],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* ── Background orchestral score ──────────────────────────────────────
          Replace narrator-bg.mp3 with a royalty-free epic orchestral track.
          Suggested sources: Pixabay, Free Music Archive, Musopen
      ─────────────────────────────────────────────────────────────────────── */}
      <Audio
        src={staticFile("audio/background-music.mp3")}
        volume={musicVolume}
        startFrom={0}
      />

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 01 — Opening Jerusalem drone (30 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.JERUSALEM.from} durationInFrames={S.JERUSALEM.duration}>
        <SceneContainer fadeIn={45} fadeOut={25}>
          <KenBurnsImage src={IMG.JERUSALEM_DRONE} direction="zoom-out" />
          <DroneOverlay location="Jerusalem, Israel" altitude="240m AGL" />
          <NarratorText text={NARRATION.N01} delayIn={35} />
          <Audio
            src={staticFile("audio/narrator-01.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 02 — Title card (5 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.TITLE.from} durationInFrames={S.TITLE.duration}>
        <TitleCard />
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 03 — Modern Tel Aviv (24 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.TEL_AVIV.from} durationInFrames={S.TEL_AVIV.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.TEL_AVIV_SKYLINE} direction="pan-left" />
          <NarratorText text={NARRATION.N03} />
          <Audio
            src={staticFile("audio/narrator-03.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 04 — Isaiah 66:8 / Independence (27 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.BEN_GURION.from} durationInFrames={S.BEN_GURION.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.ISRAEL_FLAG} direction="zoom-in" />
          <NarratorText
            text={NARRATION.N04}
            highlight="Can a nation be born in a day?"
          />
          <BibleVerse
            verse="Can a nation be born in a day?"
            reference="Isaiah 66:8"
            position="lower"
            delayIn={60}
          />
          <Audio
            src={staticFile("audio/narrator-04.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 05 — Archaeological dig (14 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.ARCHAEOLOGIST.from} durationInFrames={S.ARCHAEOLOGIST.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.ARCHAEOLOGY} direction="pan-right" />
          <NarratorText text={NARRATION.N05} />
          <Audio
            src={staticFile("audio/narrator-05.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 06 — Western Wall / flags (12 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.WESTERN_WALL.from} durationInFrames={S.WESTERN_WALL.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.WESTERN_WALL} direction="zoom-in" />
          <NarratorText text={NARRATION.N06} />
          <Audio
            src={staticFile("audio/narrator-06.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 07 — Negev Desert blooming (16 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.NEGEV.from} durationInFrames={S.NEGEV.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.NEGEV_GREEN} direction="pan-up" />
          <NarratorText
            text={NARRATION.N07}
            highlight="Isaiah 35:1"
            verseRef="Isaiah 35:1"
          />
          <Audio
            src={staticFile("audio/narrator-07.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 08 — Temple Institute (21 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.TEMPLE.from} durationInFrames={S.TEMPLE.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.TEMPLE_MOUNT} direction="zoom-out" />
          <NarratorText text={NARRATION.N08} />
          <Audio
            src={staticFile("audio/narrator-08.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 09 — Rabbi interview (13 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.RABBI.from} durationInFrames={S.RABBI.duration}>
        <SceneContainer vignetteIntensity={0.5}>
          <KenBurnsImage src={IMG.WESTERN_WALL} direction="zoom-in" />
          {/* Simulated interview lower-third */}
          <InterviewLowerThird
            name="Rabbi Yisrael Ariel"
            title="Temple Institute Founder, Jerusalem"
          />
          <NarratorText text={NARRATION.N09} />
          <Audio
            src={staticFile("audio/narrator-09.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 10 — Animated geopolitical map (21 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.MAP.from} durationInFrames={S.MAP.duration}>
        <MapAnimation narrator={NARRATION.N10} />
        <Sequence from={0} durationInFrames={S.MAP.duration}>
          <Audio
            src={staticFile("audio/narrator-10.mp3")}
            startFrom={0}
            volume={1}
          />
        </Sequence>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 11 — Current geopolitical events (14 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.CURRENT_EVENTS.from} durationInFrames={S.CURRENT_EVENTS.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.JERUSALEM_WALLS} direction="pan-left" />
          <NarratorText text={NARRATION.N11} />
          <Audio
            src={staticFile("audio/narrator-11.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 12 — Dead Sea / Ezekiel 47 (18 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.DEAD_SEA.from} durationInFrames={S.DEAD_SEA.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.DEAD_SEA} direction="zoom-out" />
          <NarratorText
            text={NARRATION.N12}
            highlight="Ezekiel 47"
            verseRef="Ezekiel 47"
          />
          <Audio
            src={staticFile("audio/narrator-12.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 13 — Luke 21:28 / Homes reading Bible (15 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.BIBLE_READING.from} durationInFrames={S.BIBLE_READING.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.BIBLE_OPEN} direction="zoom-in" />
          <NarratorText
            text={NARRATION.N13}
            highlight="your redemption is drawing near"
          />
          <BibleVerse
            verse="When these things begin to take place, stand up and lift up your heads, because your redemption is drawing near."
            reference="Luke 21:28"
            position="lower"
            delayIn={55}
          />
          <Audio
            src={staticFile("audio/narrator-13.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 14 — Interview montage / CTA (8 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.INTERVIEWS.from} durationInFrames={S.INTERVIEWS.duration}>
        <SceneContainer vignetteIntensity={0.7}>
          <KenBurnsImage src={IMG.JERUSALEM_DRONE} direction="zoom-in" />
          <NarratorText
            text={NARRATION.N14}
            fontSize={46}
          />
          <Audio
            src={staticFile("audio/narrator-14.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 15 — Mount of Olives closing narration (23 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.MOUNT_OLIVES.from} durationInFrames={S.MOUNT_OLIVES.duration}>
        <SceneContainer>
          <KenBurnsImage src={IMG.MOUNT_OLIVES} direction="zoom-out" />
          <DroneOverlay location="Mount of Olives, Jerusalem" />
          <NarratorText text={NARRATION.N15} />
          <Audio
            src={staticFile("audio/narrator-15.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 16 — Split screen: ancient vs modern (10 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.SPLIT_SCREEN.from} durationInFrames={S.SPLIT_SCREEN.duration}>
        <SplitScreen
          leftSrc={IMG.ANCIENT_SCROLL}
          rightSrc={IMG.JERUSALEM_DRONE}
          leftLabel="Written in Scripture"
          rightLabel="Fulfilled Today"
          narrator={NARRATION.N16}
        />
        <Sequence from={0} durationInFrames={S.SPLIT_SCREEN.duration}>
          <Audio
            src={staticFile("audio/narrator-16.mp3")}
            startFrom={0}
            volume={1}
          />
        </Sequence>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 17 — Final text: Matthew 24:42 (15 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.FINAL_TEXT.from} durationInFrames={S.FINAL_TEXT.duration}>
        <SceneContainer fadeIn={30} fadeOut={30}>
          <KenBurnsImage src={IMG.SUNRISE_JERUSALEM} direction="zoom-out" />
          <AbsoluteFill style={{ background: "rgba(5,12,24,0.6)" }} />
          <BibleVerse
            verse="Watch therefore, for you do not know what hour your Lord is coming."
            reference="Matthew 24:42"
            position="center"
            delayIn={25}
          />
          <Audio
            src={staticFile("audio/narrator-17.mp3")}
            startFrom={0}
            volume={1}
          />
        </SceneContainer>
      </Sequence>

      {/* ════════════════════════════════════════════════════════════════════
          SCENE 18 — Credits with aerial shots (20 s)
      ════════════════════════════════════════════════════════════════════ */}
      <Sequence from={S.CREDITS.from} durationInFrames={S.CREDITS.duration}>
        <Credits backgroundSrc={IMG.JERUSALEM_WALLS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ─── Interview lower-third bar ────────────────────────────────────────────────
const InterviewLowerThird: React.FC<{ name: string; title: string }> = ({
  name,
  title,
}) => {
  const frame = useCurrentFrame();
  const slideX = interpolate(frame, [15, 45], [-500, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "0 0 220px 72px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateX(${slideX}px)`,
          borderLeft: `4px solid #D4AF37`,
          paddingLeft: 20,
        }}
      >
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 24,
            color: "#F5F0E8",
            margin: "0 0 4px",
            fontWeight: 600,
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 16,
            color: "#D4AF37",
            margin: 0,
            letterSpacing: "0.08em",
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
          }}
        >
          {title}
        </p>
      </div>
    </AbsoluteFill>
  );
};
