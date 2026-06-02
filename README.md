# 5 Signs God Is Asking You To Delete Your Playlist
### Production-Ready Remotion 4.x YouTube Video Project

> **Cinematic Christian documentary** — 10 min 20 sec · 1920×1080 · 30fps  
> Built with Remotion 4, Three.js, React Three Fiber, and After Effects-level animations.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Preview in browser (live, interactive scrubbing)
npm start

# 3. Render full video (takes 20-60min depending on CPU)
npm run build

# 4. Render a specific scene only (much faster for iteration)
npx remotion render src/index.ts ColdOpenPreview out/cold-open.mp4
npx remotion render src/index.ts Sign1Preview    out/sign-1.mp4
npx remotion render src/index.ts TitlePreview    out/title.mp4
npx remotion render src/index.ts ConclusionPreview out/conclusion.mp4

# 5. Export thumbnail/still
npm run still
```

---

## Project Structure

```
src/
├── index.ts                      <- Entry point (registers root)
├── Root.tsx                      <- Composition definitions
├── Video.tsx                     <- Main composition (scene sequencing + audio)
├── constants.ts                  <- All timing, colors, fonts, sign data
└── components/
    ├── FilmGrain.tsx             <- Animated SVG film grain overlay
    ├── Vignette.tsx              <- Cinematic edge darkening
    ├── LightRays.tsx             <- Radial divine light rays
    ├── GlowEffect.tsx            <- Pulsing radial bloom glow
    ├── ColorGrade.tsx            <- CSS color grading presets
    ├── DramaticText.tsx          <- 6 text animation styles
    ├── ScriptureReveal.tsx       <- Gold scripture with mask-wipe reveal
    ├── NarratorText.tsx          <- Lower-third with word highlighting
    ├── CrossParticles.tsx        <- Floating cross particle field
    ├── PlaylistVisual.tsx        <- Spotify-style playlist UI component
    ├── SignCard.tsx              <- Big number + title with 3D CSS orbit
    ├── three/
    │   ├── FloatingCross.tsx     <- 3D cross mesh (Three.js)
    │   ├── CameraRig.tsx         <- Camera movement controller
    │   └── ThreeDScene.tsx       <- Scene presets (title, sign, worship-field)
    └── scenes/
        ├── ColdOpenHook.tsx      <- Scene 1: 0-15s hook
        ├── TitleReveal.tsx       <- Scene 2: 15-30s title
        ├── SignSection.tsx       <- Scenes 3-7: each of 5 signs (100s each)
        └── Conclusion.tsx        <- Scene 8: 530-620s outro + CTA
```

---

## Video Timeline

| Scene | Time | Duration | Description |
|-------|------|----------|-------------|
| Cold Open Hook | 0:00 | 15s | Phone screen -> divine flash -> "DELETE THIS" |
| Title Reveal | 0:15 | 15s | 3D cross orbit + epic title animation |
| Sign 1 | 0:30 | 1:40 | Constant Conviction & Restlessness |
| Sign 2 | 2:10 | 1:40 | Worship Music Feels Distant |
| Sign 3 | 3:50 | 1:40 | Lyrics Shape Your Thoughts |
| Sign 4 | 5:30 | 1:40 | Holy Spirit Brings Songs to Mind |
| Sign 5 | 7:10 | 1:40 | No Spiritual Peace or Breakthrough |
| Conclusion | 8:50 | 1:30 | Transformation + CTA |

---

## Adding Real Assets

### Background Music

1. Download a royalty-free track from:
   - Epidemic Sound (search "Eternal Light" or "Sacred Orchestral")
   - Artlist (search "Divine" or "Cinematic Faith")
   - Pixabay (free, search "Emotional Cinematic")

2. Track arc: tense/dramatic (0-30s) -> hopeful/uplifting (30s-8min) -> peaceful (final 2min)

3. Save as: `public/audio/background.mp3`

4. Uncomment the Audio block in `src/Video.tsx` (around line 60)

### Voice-Over

Record with a deep, compassionate male voice — or use AI:

**ElevenLabs AI Voices (recommended):**
- Voice: "Adam" (deep, authoritative, warm)
- URL: https://elevenlabs.io
- Settings: Stability 0.65, Similarity 0.80

**Script per sign:** see `narratorLines` in `src/constants.ts`

Save files to:
```
public/audio/vo-cold-open.mp3
public/audio/vo-sign-1.mp3   ...through vo-sign-5.mp3
public/audio/vo-conclusion.mp3
```

Then add inside each Sequence in Video.tsx:
```tsx
<Audio src={staticFile('audio/vo-sign-1.mp3')} volume={1} />
```

### AI-Generated Hero Images

Each sign has an `imagePrompt` in `src/constants.ts`. Use with:

**Midjourney (best quality):**
```
/imagine [paste imagePrompt] --ar 16:9 --v 6.1 --style raw
```

**Grok Imagine (free):**
- Go to x.com -> Grok -> Image tab -> paste the prompt

**DALL-E 3 (via ChatGPT Plus):**
- "Create this image: [paste imagePrompt]"

Save to `public/images/sign-{N}-hero.jpg` (1920x1080, JPG 95 quality)

Then in `SignSection.tsx`, replace `<HeroVisual>` with:
```tsx
import {Img, staticFile} from 'remotion';

<Img
  src={staticFile(`images/sign-${number}-hero.jpg`)}
  style={{width: '100%', height: '100%', objectFit: 'cover'}}
/>
```

---

## Customization Guide

### Changing Colors
Edit `COLORS` in `src/constants.ts`:
- Dark backgrounds: `#060810` to `#1a0a2e` (deep navy to purple)
- Gold accents: `#f59e0b` to `#fcd34d` (amber to pale gold)

### Adjusting Timing
All scene durations are in `TIMING` in `src/constants.ts`. Change `dur` values (seconds).

### Changing the Channel Name
Search `"Stay in the Word"` in `src/components/scenes/Conclusion.tsx`.

### DramaticText Animation Styles
- `scale-reveal` — scales from 2.5x down (titles)
- `tracking-reveal` — letter-spacing expands (chapter titles)
- `glitch` — RGB channel split (retention hooks)
- `word-cascade` — each word falls in with stagger (narration)
- `slam-in` — bouncy spring from 4x (emphasis)
- `glow-pulse` — pulsing text glow (scripture)

---

## Render Commands

### For YouTube upload
```bash
npx remotion render src/index.ts ChristianYouTubeVideo out/final.mp4 \
  --codec h264 --crf 18 --pixel-format yuv420p --video-bitrate 8000000
```

### Draft/preview (faster)
```bash
npx remotion render src/index.ts ChristianYouTubeVideo out/draft.mp4 \
  --jpeg-quality 80 --crf 28 --scale 0.5
```

### Faster render with concurrency
```bash
npx remotion render src/index.ts ChristianYouTubeVideo out/final.mp4 \
  --concurrency 8
```

---

## YouTube Video Description Template

```
God spoke to me about my playlist and it changed everything.

5 clear signs that God is asking you to delete your playlist
and why obedience in this area brings breakthrough.

Scriptures Referenced:
- Romans 8:6
- Psalm 40:3
- Philippians 4:8
- John 14:26
- Isaiah 26:3

Timestamps:
0:00 Has God Been Speaking About Your Music?
0:15 What This Video Is About
0:30 Sign 1: Constant Conviction & Restlessness
2:10 Sign 2: Worship Music Feels Distant
3:50 Sign 3: Lyrics Are Shaping Your Thoughts
5:30 Sign 4: The Holy Spirit Brings Songs to Mind
7:10 Sign 5: No Spiritual Peace or Breakthrough
8:50 What God Is Saying To You Today

Drop your testimony in the comments below!
```

---

## Tech Stack

| Package | Purpose |
|---------|---------|
| remotion 4.x | Core video framework |
| @remotion/three | Three.js canvas integration |
| @remotion/google-fonts | Web font loading |
| @react-three/fiber | React renderer for Three.js |
| @react-three/drei | Three.js utility components |
| three 0.160 | 3D graphics engine |
| TypeScript 5.x | Type safety |

---

*Built to glorify God and retain every viewer He brings to the video.*
*"Whatever you do, work at it with all your heart, as working for the Lord." -- Colossians 3:23*
