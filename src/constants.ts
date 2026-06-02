// ─────────────────────────────────────────────────────────────────────────────
// Project-wide constants — edit these to tweak timing, colors, and typography
// ─────────────────────────────────────────────────────────────────────────────

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Cinematic color palette: deep navy, warm gold, cream white
export const COLORS = {
  gold: "#D4AF37",
  goldLight: "#F0D060",
  goldDark: "#B8960C",
  cream: "#F5F0E8",
  darkNavy: "#0A1628",
  midNavy: "#132038",
  black: "#000000",
  overlayDark: "rgba(0, 0, 0, 0.75)",
  overlayMid: "rgba(10, 22, 40, 0.65)",
} as const;

// Google Fonts loaded via @remotion/google-fonts
export const FONTS = {
  serif: '"Playfair Display", "Georgia", "Times New Roman", serif',
  sans: '"Inter", "Helvetica Neue", Arial, sans-serif',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Scene timing: each scene defined by { from, duration } in frames at 30 fps
// Word count estimated at 155 words/min → ≈ 11.6 frames per word
// ─────────────────────────────────────────────────────────────────────────────
export const S = {
  JERUSALEM:      { from: 0,    duration: 900 },  // 30 s — opening drone
  TITLE:          { from: 900,  duration: 150 },  //  5 s — title card
  TEL_AVIV:       { from: 1050, duration: 720 },  // 24 s — modern Israel
  BEN_GURION:     { from: 1770, duration: 810 },  // 27 s — Isaiah 66:8
  ARCHAEOLOGIST:  { from: 2580, duration: 420 },  // 14 s — dig site
  WESTERN_WALL:   { from: 3000, duration: 360 },  // 12 s — prayers / flags
  NEGEV:          { from: 3360, duration: 480 },  // 16 s — desert blooms
  TEMPLE:         { from: 3840, duration: 630 },  // 21 s — Temple Institute
  RABBI:          { from: 4470, duration: 390 },  // 13 s — rabbi interview
  MAP:            { from: 4860, duration: 630 },  // 21 s — animated map
  CURRENT_EVENTS: { from: 5490, duration: 420 },  // 14 s — geopolitics
  DEAD_SEA:       { from: 5910, duration: 540 },  // 18 s — Ezekiel 47
  BIBLE_READING:  { from: 6450, duration: 450 },  // 15 s — Luke 21:28
  INTERVIEWS:     { from: 6900, duration: 240 },  //  8 s — montage CTA
  MOUNT_OLIVES:   { from: 7140, duration: 690 },  // 23 s — closing narration
  SPLIT_SCREEN:   { from: 7830, duration: 300 },  // 10 s — ancient vs modern
  FINAL_TEXT:     { from: 8130, duration: 450 },  // 15 s — Matthew 24:42
  CREDITS:        { from: 8580, duration: 600 },  // 20 s — scrolling credits
} as const;

export const TOTAL_FRAMES = 9180; // 306 s ≈ 5 min 6 sec

// ─────────────────────────────────────────────────────────────────────────────
// Background visuals — cinematic CSS gradients (zero-network, offline safe).
// To swap in real footage: replace any value with a staticFile() path or URL.
// ─────────────────────────────────────────────────────────────────────────────
export const IMG = {
  // Jerusalem at golden hour — deep indigo sky → warm amber horizon
  JERUSALEM_DRONE:
    "linear-gradient(175deg, #0d1b3e 0%, #1a2d5a 25%, #4a2810 55%, #8b4e1a 75%, #c8720a 90%, #e8a030 100%)",

  // Ancient stone walls — warm ochre and burnt sienna
  JERUSALEM_WALLS:
    "linear-gradient(160deg, #1a0f05 0%, #3d2210 30%, #6e4020 55%, #9e6030 75%, #c89050 95%)",

  // Tel Aviv coast — electric city blue to Mediterranean teal
  TEL_AVIV_SKYLINE:
    "linear-gradient(170deg, #051828 0%, #0a3050 20%, #0d4870 45%, #1060a0 65%, #2080c0 85%, #40a8d8 100%)",

  // Western Wall — warm sandstone, ancient and holy
  WESTERN_WALL:
    "linear-gradient(165deg, #1c1005 0%, #3a2210 25%, #6a4820 50%, #9a7040 70%, #c8a060 90%)",

  // Negev desert — red-orange dunes baking in sun
  NEGEV_DESERT:
    "linear-gradient(160deg, #200a00 0%, #4a1800 25%, #8a3a10 50%, #c06020 70%, #e08030 90%)",

  // Negev blooming — lush greens cutting through desert sand
  NEGEV_GREEN:
    "linear-gradient(155deg, #0a1a05 0%, #153010 20%, #205020 40%, #3a7830 60%, #60a050 80%, #90c870 100%)",

  // Dead Sea — silver-blue saline stillness with grey shores
  DEAD_SEA:
    "linear-gradient(180deg, #1a2030 0%, #243040 30%, #3a5060 55%, #507080 75%, #6890a0 95%)",

  // Temple Mount — ethereal gold with deep sacred blue
  TEMPLE_MOUNT:
    "linear-gradient(170deg, #0a0f20 0%, #1a1a3a 25%, #2a2040 50%, #5a4010 70%, #b88020 88%, #e0c040 100%)",

  // Archaeology dig — earth tones, red clay, ancient dust
  ARCHAEOLOGY:
    "linear-gradient(165deg, #180800 0%, #3a1a08 30%, #6a3818 55%, #9a6030 75%, #c09050 95%)",

  // Open Bible — warm candlelight parchment
  BIBLE_OPEN:
    "linear-gradient(170deg, #1a1005 0%, #3a2a10 30%, #7a5a28 55%, #c09050 78%, #e0c080 95%)",

  // Mount of Olives — deep purple dawn breaking gold
  MOUNT_OLIVES:
    "linear-gradient(175deg, #0a0515 0%, #1a1028 25%, #3a2040 50%, #6a4020 70%, #b08030 88%, #e0c060 100%)",

  // Sunrise over Jerusalem — rose gold celestial glow
  SUNRISE_JERUSALEM:
    "linear-gradient(180deg, #050210 0%, #1a0820 20%, #3a1028 40%, #8a3020 60%, #c86020 78%, #f09040 92%, #f8c870 100%)",

  // Ancient scroll/manuscript — rich burgundy and aged parchment
  ANCIENT_SCROLL:
    "linear-gradient(160deg, #0f0308 0%, #2a0810 25%, #4a1820 50%, #7a4030 70%, #b08060 88%, #d0b080 100%)",

  // Israel flag — deep blue and white with gold gleam
  ISRAEL_FLAG:
    "linear-gradient(175deg, #05082a 0%, #0a1050 20%, #102080 40%, #1a38c0 60%, #4060d8 80%, #8098e8 100%)",
} as const;
