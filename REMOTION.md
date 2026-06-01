# Faith — "The Repentant Thief" (Remotion cinematic short)

A production-ready **30s vertical (1080×1920) cinematic short** built with
**Remotion + @remotion/three + @remotion/motion-blur**. Based on Luke 23:43 —
the thief on the cross who was promised Paradise.

> "Today you will be with me in Paradise." — Luke 23:43

## Quick start

```bash
npm install
npm run studio          # open the Remotion Studio preview
npm run render          # render out/faith.mp4 (1080p)
npm run render-4k       # render at 2× scale (4K)
```

## Timeline (exactly 30s @ 30fps = 900 frames)

| Time      | Scene          | What happens                                                                 |
| --------- | -------------- | ---------------------------------------------------------------------------- |
| 0–5s      | `HookScene`    | Stormy sky, two crosses silhouetted on a hill, dramatic push-in + lens flare, bold impact text. |
| 5–22s     | `CrossScene`   | Three crosses revealed. Slow 3D orbit, push-in on the repentant thief, soft glow to Jesus as He speaks. |
| 22–30s    | `ClosingScene` | Sunrise. Empty crosses. Majestic crane-up + god-rays, message, pulsing CTA, the verse. |

Scenes are cross-faded with warm **light-leak + whoosh** transitions (`LightLeak`),
all under ~1.2s.

## Project structure

```
src/
  index.ts                 registerRoot
  Root.tsx                 <Composition id="Faith">
  Video.tsx                main timeline (Sequences + transitions + global grade)
  theme.ts                 timing, palette, easings, ENABLE_AUDIO flag
  scenes/
    HookScene.tsx          0–5s
    CrossScene.tsx         5–22s
    ClosingScene.tsx       22–30s
  three/                   reusable 3D building blocks
    CameraRig.tsx          frame-driven (deterministic) camera controller
    Cross.tsx              wooden cross + abstract figure
    SkyDome.tsx            gradient sky (custom GLSL shader)
    Ground.tsx             Golgotha hill plane
    Lighting.tsx           warm key / cool fill / rim
    LightRays.tsx          volumetric-style god rays
    Dust.tsx               parallaxing 3D dust motes
  effects/                 2D film treatment
    LightLeak.tsx          AE-style transition
    LensFlare.tsx          anamorphic flare
    FilmGrain.tsx          animated SVG grain
    Vignette.tsx           corner darkening
  text/
    CinematicText.tsx      scale + fade + 3D-tilt title animation
  audio/
    AudioTrack.tsx         synced music / VO / ambience (see public/audio)
```

## How the cinematic feel is achieved

- **True 3D + parallax** — every scene is a real Three.js scene (`@remotion/three`).
  Foreground dust, mid-ground crosses, and the sky dome sit at different depths,
  so camera moves produce genuine parallax.
- **Buttery camera moves** — `CameraRig` reads `useCurrentFrame()` and positions
  the camera per-frame using `interpolate` with bezier easings (`theme.ts > EASE`)
  and `spring`, keeping renders deterministic.
- **Motion blur** — `@remotion/motion-blur`'s `CameraMotionBlur` wraps each 3D
  scene for AE-style blur on the moves.
- **Film grade** — animated grain, vignette, graded gradient overlays, lens flares
  and light leaks layered on top.
- **Depth of field** is faked with selective glow/light rather than a postFX pass
  to keep the project dependency-light and fast to render.

## Audio

Audio is **off by default** so the project renders out-of-the-box. Add the three
files described in `public/audio/README.md`, then set `ENABLE_AUDIO = true` in
`src/theme.ts`.
