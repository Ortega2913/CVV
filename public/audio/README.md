# Audio assets

Drop these three files here, then set `ENABLE_AUDIO = true` in `src/theme.ts`:

| File            | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `music.mp3`     | Cinematic piano + swelling orchestral strings (dark → hopeful).    |
| `voiceover.mp3` | Deep male voiceover, ~30s, synced to the script.                   |
| `ambience.mp3`  | Wind / distant thunder fading to peaceful birds at sunrise.        |

Volumes and fades are already automated in `src/audio/AudioTrack.tsx`.

### Voiceover script (for timing)

- **0–5s (Hook):** "One man went to heaven… without ever going to church."
- **5–22s (Main):** "He only had seconds left. No good works. No baptism.
  Just one honest cry: 'Jesus, remember me.' And Jesus replied,
  'Today you will be with me in Paradise.'"
- **22–30s (Closing):** "Salvation is a gift, not a reward."
