# Designing the Divine — Motion Graphics

A [Remotion](https://www.remotion.dev/) re-build of the *"Designing the Divine —
How to design a Renaissance masterpiece"* presentation, enhanced with animated
motion graphics, hand-drawn SVG line art, data charts and smooth scene
transitions.

**Output:** `out/designing-the-divine.mp4` — 1920×864, 30 fps, ~31.5 s.

## Scenes

1. **Title** — staggered serif title reveal, self-drawing golden-ratio spiral,
   classical column & compass sketches, floating gold dust.
2. **The Central Question** — flowing blue/red fabric drapes, Renaissance arch,
   highlighted question, laurel branches.
3. **The Three Rules of Composition** — animated diagram with vanishing-point
   perspective lines, golden-section guides, a glowing cruciform halo, a
   semicircle of disciple markers, plus three principle cards.
4. **The Sacred Icon** — a self-drawing ornate gilded frame and iconographic
   figure (cruciform halo, blessing hand, shepherd's staff).
5. **Physical Traits** — animated face line art with proportion guides, a
   checklist with drawn checkmarks, a golden-ratio donut chart and animated
   "scholarly consensus" bar graphs.
6. **Outro** — closing title framed by laurels over a golden spiral.

Transitions use `@remotion/transitions` (fade, slide, wipe, clock-wipe) for
smooth motion between scenes.

## Develop / Render

```bash
npm install
npm run dev      # open Remotion Studio
npm run render   # render out/designing-the-divine.mp4
```

### Note on this environment
The render runs through a TLS-intercepting proxy whose CA Chromium does not
trust, so `remotion.config.ts` sets `setChromiumIgnoreCertificateErrors(true)`
to allow Google Fonts (gstatic) to load. Remove this line in a normal
environment if you prefer strict certificate validation.
