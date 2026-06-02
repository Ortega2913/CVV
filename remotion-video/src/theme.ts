// Shared design tokens for "Designing the Divine"
// Warm Renaissance paper palette with gold leaf accents.

export const COLORS = {
  ink: "#1C1A17",
  inkSoft: "#403A30",
  paper: "#F3EFE6",
  paper2: "#EAE3D5",
  paper3: "#E1D8C6",
  gold: "#C8A04B",
  goldLight: "#E3C77A",
  goldDeep: "#9C7A2E",
  ochre: "#B8782E",
  blue: "#3C5E86",
  blueDeep: "#2E4A6B",
  red: "#9E3B2E",
  green: "#6B7A45",
  grid: "rgba(70,58,34,0.06)",
  gridStrong: "rgba(70,58,34,0.12)",
} as const;

export const FPS = 30;

// Fonts are loaded in Root via @remotion/google-fonts.
export const SERIF = "'Cormorant Garamond', Georgia, serif";
export const SERIF_DISPLAY = "'Playfair Display', Georgia, serif";
export const SANS = "'Inter', system-ui, sans-serif";
