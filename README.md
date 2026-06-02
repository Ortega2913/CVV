# Bible Lands Today: Clues to Prophecy
### A Cinematic Remotion Documentary — 1080p · 30fps · ~5 min 6 sec

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Open the Remotion Studio (live preview)
npm start

# 3. Render to MP4 (H.264)
npm run render

# 4. Render high-quality (lower CRF = better quality, larger file)
npm run render:hq
```

---

## Project Structure

```
.
├── src/
│   ├── Root.tsx               # Registers the composition, loads fonts
│   ├── Video.tsx              # Main sequencer — all 18 scenes live here
│   ├── constants.ts           # FPS, colors, fonts, scene timing, image URLs
│   └── components/
│       ├── SceneContainer.tsx # Fade in/out + vignette + film grain wrapper
│       ├── KenBurnsImage.tsx  # Slow zoom/pan motion on still images
│       ├── NarratorText.tsx   # Bottom-third subtitle bar
│       ├── BibleVerse.tsx     # Gold-bordered animated scripture card
│       ├── TitleCard.tsx      # Epic animated title with particle glow
│       ├── MapAnimation.tsx   # SVG geopolitical map with animated nations
│       ├── SplitScreen.tsx    # Side-by-side ancient vs modern split
│       ├── Credits.tsx        # Scrolling end credits
│       ├── DroneOverlay.tsx   # Aerial telemetry UI overlay
│       ├── Vignette.tsx       # Radial dark-edge vignette
│       └── FilmGrain.tsx      # Animated SVG film grain texture
├── public/
│   └── audio/
│       ├── background-music.mp3   ← Add your orchestral track here
│       ├── narrator-01.mp3        ← Scene 1 narrator (or TTS output)
│       └── narrator-03.mp3 … narrator-17.mp3
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

---

## Replacing Placeholder Assets

### Images
All images use Unsplash URLs (free for development). For production, replace
the URLs in `src/constants.ts` → `IMG` object with licensed stock footage or
local files via `staticFile("images/my-photo.jpg")`.

```ts
// Example — local file
import { staticFile } from "remotion";
export const IMG = {
  JERUSALEM_DRONE: staticFile("images/jerusalem-drone.jpg"),
  // ...
};
```

Place local files in `/public/images/`.

### Narrator Audio
Generate MP3 files with a TTS service and place them in `public/audio/`:

| File | Scene |
|------|-------|
| `narrator-01.mp3` | Opening Jerusalem drone |
| `narrator-03.mp3` | Modern Tel Aviv |
| `narrator-04.mp3` | Isaiah 66:8 / Independence |
| `narrator-05.mp3` | Archaeological dig |
| `narrator-06.mp3` | Western Wall |
| `narrator-07.mp3` | Negev Desert |
| `narrator-08.mp3` | Temple Institute |
| `narrator-09.mp3` | Rabbi interview |
| `narrator-10.mp3` | Geopolitical map |
| `narrator-11.mp3` | Current events |
| `narrator-12.mp3` | Dead Sea |
| `narrator-13.mp3` | Luke 21:28 |
| `narrator-14.mp3` | CTA montage |
| `narrator-15.mp3` | Mount of Olives |
| `narrator-16.mp3` | Split screen |
| `narrator-17.mp3` | Matthew 24:42 |

**TTS options:** ElevenLabs, Murf.ai, Play.ht — use a deep, calm male voice.

### Background Music
Place a single continuous orchestral track at `public/audio/background-music.mp3`.

**Royalty-free sources:**
- [Pixabay Music](https://pixabay.com/music/) — search "epic orchestral documentary"
- [Free Music Archive](https://freemusicarchive.org)
- [Musopen](https://musopen.org) — public-domain classical
- [Uppbeat](https://uppbeat.io) — "cinematic documentary" category

Volume is automated in `Video.tsx` → `musicVolume()` — swells at dramatic
moments, ducks under narration.

---

## Customising Timing

Scene durations are in `src/constants.ts` → `S` object.
Formula: `durationInFrames = Math.round(wordCount / 155 * 60 * 30)`

After changing a duration, update all subsequent `from` values and `TOTAL_FRAMES`.

---

## Render Settings

```bash
# Standard render
npx remotion render BibleLandsProphecy out/final.mp4 --codec=h264

# High quality
npx remotion render BibleLandsProphecy out/final.mp4 --codec=h264 --crf=18

# ProRes for editing
npx remotion render BibleLandsProphecy out/final.mov --codec=prores
```

---

## Architecture Notes

- All animation derived from `useCurrentFrame()` — no external state.
- Every component is standalone and reusable in any Remotion project.
- Add scenes: append a `<Sequence>` in `Video.tsx`, add timing to `S` in `constants.ts`.
- Fonts (Inter + Playfair Display) loaded in `Root.tsx` via `@remotion/google-fonts`.

---

## License
Code: MIT. Images: Unsplash placeholder only — replace for production.
Music and narration: your responsibility to license appropriately.
