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
// Placeholder image URLs (Unsplash — replace with licensed footage)
// Append ?w=1920&q=85 to get full HD WebP from Unsplash CDN
// ─────────────────────────────────────────────────────────────────────────────
export const IMG = {
  JERUSALEM_DRONE:
    "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1920&q=85",
  JERUSALEM_WALLS:
    "https://images.unsplash.com/photo-1566127992631-137a642a90f4?w=1920&q=85",
  TEL_AVIV_SKYLINE:
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85",
  WESTERN_WALL:
    "https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=1920&q=85",
  NEGEV_DESERT:
    "https://images.unsplash.com/photo-1589396577086-73e8d800e7f9?w=1920&q=85",
  NEGEV_GREEN:
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920&q=85",
  DEAD_SEA:
    "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=1920&q=85",
  MOUNT_OLIVES:
    "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?w=1920&q=85",
  ARCHAEOLOGY:
    "https://images.unsplash.com/photo-1614107151491-6876268cf8a9?w=1920&q=85",
  BIBLE_OPEN:
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&q=85",
  TEMPLE_MOUNT:
    "https://images.unsplash.com/photo-1561049501-1e6b7fd7a5f4?w=1920&q=85",
  MAP_MIDDLE_EAST:
    "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&q=85",
  SUNRISE_JERUSALEM:
    "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=1920&q=85",
  ANCIENT_SCROLL:
    "https://images.unsplash.com/photo-1518346651602-a21e89e6b14e?w=1920&q=85",
  ISRAEL_FLAG:
    "https://images.unsplash.com/photo-1540206395-68808572332f?w=1920&q=85",
} as const;
