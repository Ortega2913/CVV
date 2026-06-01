import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/assets');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const W = 1920, H = 1080;

// ── helpers ──────────────────────────────────────────────────────────────────

function save(canvas, name) {
  const buf = canvas.toBuffer('image/png');
  writeFileSync(join(OUT, name), buf);
  console.log('✓', name, `(${(buf.length / 1024).toFixed(0)} KB)`);
}

// Seeded pseudo-random (mulberry32)
function makeRng(seed) {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simple 2D value noise
function makeNoise(rng, gridSize = 8) {
  const G = gridSize;
  const vals = Array.from({ length: G * G }, () => rng());
  const lerp = (a, b, t) => a + t * (b - a);
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  return (nx, ny) => {
    const xi = Math.floor(nx) % G, yi = Math.floor(ny) % G;
    const xf = nx - Math.floor(nx), yf = ny - Math.floor(ny);
    const v00 = vals[((xi) % G) + ((yi) % G) * G];
    const v10 = vals[((xi + 1) % G) + ((yi) % G) * G];
    const v01 = vals[((xi) % G) + ((yi + 1) % G) * G];
    const v11 = vals[((xi + 1) % G) + ((yi + 1) % G) * G];
    return lerp(lerp(v00, v10, fade(xf)), lerp(v01, v11, fade(xf)), fade(yf));
  };
}

// Radial gradient helper
function radialGrad(ctx, cx, cy, r0, r1, stops) {
  const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

// Linear gradient helper
function linearGrad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

// Draw stars
function drawStars(ctx, rng, count, brightness = 1) {
  for (let i = 0; i < count; i++) {
    const x = rng() * W, y = rng() * H * 0.75;
    const r = rng() * 1.6 + 0.3;
    const op = (rng() * 0.6 + 0.35) * brightness;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${op.toFixed(2)})`;
    ctx.fill();
  }
}

// Draw a cloud bank (layered ellipses)
function drawClouds(ctx, rng, yBase, count, color, alpha) {
  for (let i = 0; i < count; i++) {
    const x = rng() * W * 1.4 - W * 0.2;
    const y = yBase + rng() * 180 - 90;
    const rx = rng() * 320 + 160;
    const ry = rng() * 90 + 40;
    ctx.save();
    ctx.globalAlpha = (rng() * 0.3 + 0.15) * alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ── Image 1: bg-hook.png ─────────────────────────────────────────────────────
// Deep cosmic night sky with nebula glow — for the Hook scene
function genHook() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(42);
  const noise = makeNoise(rng);

  // Base: very dark midnight gradient
  const sky = linearGrad(ctx, 0, 0, 0, H, [
    [0,   '#03040f'],
    [0.4, '#080b1e'],
    [0.75,'#0f0818'],
    [1,   '#1a0808'],
  ]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Nebula glow — central golden cloud
  const nebula = radialGrad(ctx, W * 0.5, H * 0.42, 0, 500, [
    [0,   'rgba(201,160,60,0.22)'],
    [0.3, 'rgba(130,60,20,0.12)'],
    [0.6, 'rgba(40,10,60,0.08)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, W, H);

  // Secondary purple nebula
  const neb2 = radialGrad(ctx, W * 0.2, H * 0.25, 0, 300, [
    [0,   'rgba(80,20,120,0.18)'],
    [0.5, 'rgba(40,10,80,0.08)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = neb2;
  ctx.fillRect(0, 0, W, H);

  // Milky way band — diagonal smear
  ctx.save();
  ctx.globalAlpha = 0.07;
  const band = linearGrad(ctx, 0, H, W, 0, [
    [0,   'rgba(180,200,255,0)'],
    [0.3, 'rgba(200,220,255,0.8)'],
    [0.5, 'rgba(220,230,255,1)'],
    [0.7, 'rgba(200,215,255,0.8)'],
    [1,   'rgba(180,200,255,0)'],
  ]);
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // Stars — lots of them
  drawStars(ctx, rng, 500, 1);

  // A few bright star glints with cross-hairs
  for (let i = 0; i < 8; i++) {
    const sx = rng() * W, sy = rng() * H * 0.6;
    const size = rng() * 3 + 2;
    ctx.save();
    ctx.globalAlpha = rng() * 0.5 + 0.3;
    ctx.strokeStyle = 'rgba(255,245,200,0.8)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(sx - size * 4, sy); ctx.lineTo(sx + size * 4, sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx, sy - size * 4); ctx.lineTo(sx, sy + size * 4); ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,248,210,${rng() * 0.4 + 0.5})`;
    ctx.fill();
  }

  // Distant hill silhouette at bottom
  ctx.fillStyle = '#060409';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.88);
  ctx.bezierCurveTo(W * 0.15, H * 0.80, W * 0.35, H * 0.85, W * 0.5, H * 0.86);
  ctx.bezierCurveTo(W * 0.65, H * 0.87, W * 0.8, H * 0.78, W, H * 0.84);
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  save(canvas, 'bg-hook.png');
}

// ── Image 2: bg-golgotha.png ─────────────────────────────────────────────────
// Sunset at Golgotha — warm dramatic sky, rocky hill, for the Crosses scene
function genGolgotha() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(7);

  // Sky gradient — sunset crimson to deep purple overhead
  const sky = linearGrad(ctx, 0, 0, 0, H * 0.72, [
    [0,    '#0d0520'],
    [0.15, '#2a0d35'],
    [0.35, '#7a1520'],
    [0.55, '#c23a0a'],
    [0.72, '#e86010'],
    [0.85, '#f09030'],
    [1,    '#f5c060'],
  ]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Sun disc on horizon
  const sunY = H * 0.68;
  const sun = radialGrad(ctx, W * 0.62, sunY, 0, 120, [
    [0,    'rgba(255,250,200,0.9)'],
    [0.15, 'rgba(255,220,80,0.7)'],
    [0.4,  'rgba(240,140,20,0.4)'],
    [0.7,  'rgba(200,60,0,0.15)'],
    [1,    'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, H);

  // God rays from sun
  ctx.save();
  for (let i = 0; i < 14; i++) {
    const angle = (-Math.PI / 2) + (i - 7) * 0.18;
    const len = 700 + rng() * 300;
    const cx = W * 0.62, cy = sunY;
    ctx.save();
    ctx.globalAlpha = rng() * 0.06 + 0.02;
    ctx.fillStyle = 'rgba(255,200,80,1)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const spread = 0.04 + rng() * 0.05;
    ctx.lineTo(cx + Math.cos(angle - spread) * len, cy + Math.sin(angle - spread) * len);
    ctx.lineTo(cx + Math.cos(angle + spread) * len, cy + Math.sin(angle + spread) * len);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // Cloud layers
  drawClouds(ctx, rng, H * 0.22, 18, '#8b1515', 0.6);
  drawClouds(ctx, rng, H * 0.32, 14, '#c04010', 0.5);
  drawClouds(ctx, rng, H * 0.18, 10, '#3a0a20', 0.7);

  // Distant horizon haze
  const haze = linearGrad(ctx, 0, H * 0.62, 0, H * 0.72, [
    [0, 'rgba(240,140,40,0)'],
    [1, 'rgba(240,160,50,0.25)'],
  ]);
  ctx.fillStyle = haze;
  ctx.fillRect(0, H * 0.62, W, H * 0.1);

  // Ground / hill — dark rocky
  ctx.fillStyle = '#100808';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.72);
  ctx.bezierCurveTo(W * 0.1, H * 0.65, W * 0.25, H * 0.62, W * 0.38, H * 0.64);
  ctx.bezierCurveTo(W * 0.5, H * 0.66, W * 0.55, H * 0.70, W * 0.62, H * 0.69);
  ctx.bezierCurveTo(W * 0.72, H * 0.67, W * 0.85, H * 0.63, W, H * 0.69);
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  // Rocky texture on ground (noise-based dots)
  const noiseR = makeNoise(rng);
  for (let i = 0; i < 2200; i++) {
    const x = rng() * W;
    const groundY = H * 0.69 + rng() * H * 0.31;
    const n = noiseR(x / 180, groundY / 180);
    if (n > 0.42) {
      ctx.beginPath();
      ctx.arc(x, groundY, rng() * 3 + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${60 + n * 40}, ${30 + n * 20}, ${10 + n * 10}, ${rng() * 0.3 + 0.1})`;
      ctx.fill();
    }
  }

  // Ground shadow / vignette bottom
  const gv = linearGrad(ctx, 0, H * 0.75, 0, H, [
    [0, 'rgba(0,0,0,0)'],
    [1, 'rgba(0,0,0,0.55)'],
  ]);
  ctx.fillStyle = gv;
  ctx.fillRect(0, H * 0.75, W, H * 0.25);

  // Edge vignette
  const vig = radialGrad(ctx, W / 2, H / 2, H * 0.3, W * 0.75, [
    [0,   'rgba(0,0,0,0)'],
    [0.6, 'rgba(0,0,0,0)'],
    [1,   'rgba(0,0,0,0.45)'],
  ]);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  save(canvas, 'bg-golgotha.png');
}

// ── Image 3: bg-cry.png ──────────────────────────────────────────────────────
// The darkness — Luke 23:44: "darkness over the whole land" — stormy red-black
function genCry() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(13);

  // Nearly black, deep blood-red tones
  const sky = linearGrad(ctx, 0, 0, 0, H, [
    [0,    '#020004'],
    [0.3,  '#120208'],
    [0.6,  '#230510'],
    [0.85, '#0e0205'],
    [1,    '#050010'],
  ]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Ominous red glow behind clouds (where the sun should be)
  const glow = radialGrad(ctx, W * 0.5, H * 0.55, 0, 450, [
    [0,   'rgba(120,10,10,0.5)'],
    [0.3, 'rgba(80,5,5,0.25)'],
    [0.7, 'rgba(40,0,0,0.1)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Heavy storm clouds — layered
  drawClouds(ctx, rng, H * 0.15, 22, '#0a0005', 1.8);
  drawClouds(ctx, rng, H * 0.35, 18, '#180308', 1.5);
  drawClouds(ctx, rng, H * 0.25, 14, '#250510', 1.3);
  drawClouds(ctx, rng, H * 0.08, 10, '#050003', 2.0);

  // Lightning crack — thin branching line
  const lx = W * 0.65, ly0 = H * 0.05;
  ctx.save();
  ctx.strokeStyle = 'rgba(200,180,255,0.6)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(200,180,255,0.8)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(lx, ly0);
  let cx2 = lx, cy2 = ly0;
  for (let i = 0; i < 12; i++) {
    cx2 += (rng() - 0.5) * 60;
    cy2 += 30 + rng() * 30;
    ctx.lineTo(cx2, cy2);
    if (rng() > 0.7) {
      ctx.moveTo(cx2, cy2);
      const bx = cx2 + (rng() - 0.5) * 80, by = cy2 + 40 + rng() * 60;
      ctx.lineTo(bx, by);
      ctx.moveTo(cx2, cy2);
    }
  }
  ctx.stroke();
  ctx.restore();

  // A few faint stars peeking through
  drawStars(ctx, rng, 30, 0.3);

  // Ground — nearly invisible
  ctx.fillStyle = '#080005';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.78);
  ctx.bezierCurveTo(W * 0.2, H * 0.72, W * 0.45, H * 0.76, W * 0.6, H * 0.74);
  ctx.bezierCurveTo(W * 0.75, H * 0.72, W * 0.88, H * 0.77, W, H * 0.75);
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  // Brooding vignette
  const vig = radialGrad(ctx, W / 2, H / 2, 200, W * 0.8, [
    [0,   'rgba(0,0,0,0)'],
    [0.5, 'rgba(0,0,0,0.1)'],
    [1,   'rgba(0,0,0,0.7)'],
  ]);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  save(canvas, 'bg-cry.png');
}

// ── Image 4: bg-paradise.png ─────────────────────────────────────────────────
// Heaven opening — brilliant golden-white light breaks through storm clouds
function genParadise() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(99);

  // Base deep blue/grey sky
  const sky = linearGrad(ctx, 0, 0, 0, H, [
    [0,    '#0a0c18'],
    [0.35, '#141828'],
    [0.6,  '#1e2038'],
    [1,    '#080810'],
  ]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Storm clouds around edges
  drawClouds(ctx, rng, H * 0.1, 16, '#0a0c20', 2.0);
  drawClouds(ctx, rng, H * 0.6, 12, '#0c0e22', 1.5);

  // LEFT cloud bank (dark, parting)
  ctx.save();
  ctx.fillStyle = '#0d1025';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(W * 0.28, 0);
  ctx.bezierCurveTo(W * 0.32, H * 0.2, W * 0.25, H * 0.5, W * 0.18, H * 0.7);
  ctx.bezierCurveTo(W * 0.1, H * 0.85, 0, H * 0.9, 0, H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // RIGHT cloud bank (dark, parting)
  ctx.save();
  ctx.fillStyle = '#0e1128';
  ctx.beginPath();
  ctx.moveTo(W, 0); ctx.lineTo(W * 0.72, 0);
  ctx.bezierCurveTo(W * 0.68, H * 0.22, W * 0.74, H * 0.5, W * 0.82, H * 0.7);
  ctx.bezierCurveTo(W * 0.9, H * 0.85, W, H * 0.9, W, H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Central heaven burst — multi-layer golden-white light
  const heavenCore = radialGrad(ctx, W / 2, H * 0.38, 0, 180, [
    [0,    'rgba(255,255,240,1)'],
    [0.08, 'rgba(255,252,200,0.95)'],
    [0.2,  'rgba(255,240,150,0.8)'],
    [0.4,  'rgba(240,210,100,0.5)'],
    [0.65, 'rgba(200,160,60,0.2)'],
    [1,    'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = heavenCore;
  ctx.fillRect(0, 0, W, H);

  const heavenMid = radialGrad(ctx, W / 2, H * 0.38, 0, 500, [
    [0,    'rgba(255,240,180,0.6)'],
    [0.3,  'rgba(230,190,80,0.3)'],
    [0.6,  'rgba(180,130,40,0.1)'],
    [1,    'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = heavenMid;
  ctx.fillRect(0, 0, W, H);

  const heavenFar = radialGrad(ctx, W / 2, H * 0.38, 0, 900, [
    [0,    'rgba(255,230,150,0.3)'],
    [0.4,  'rgba(200,160,60,0.12)'],
    [0.7,  'rgba(140,100,30,0.05)'],
    [1,    'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = heavenFar;
  ctx.fillRect(0, 0, W, H);

  // Light beams / shafts
  for (let i = 0; i < 20; i++) {
    const angle = Math.PI / 2 + (i - 10) * 0.14;
    const len = 600 + rng() * 400;
    const spread = 0.015 + rng() * 0.025;
    ctx.save();
    ctx.globalAlpha = rng() * 0.08 + 0.02;
    ctx.fillStyle = 'rgba(255,240,180,1)';
    ctx.beginPath();
    ctx.moveTo(W / 2, H * 0.38);
    ctx.lineTo(W / 2 + Math.cos(angle - spread) * len, H * 0.38 + Math.sin(angle - spread) * len);
    ctx.lineTo(W / 2 + Math.cos(angle + spread) * len, H * 0.38 + Math.sin(angle + spread) * len);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Cloud edges catching the light (bright rims)
  drawClouds(ctx, rng, H * 0.3, 8, 'rgba(255,240,180,0.4)', 1.0);
  drawClouds(ctx, rng, H * 0.45, 6, 'rgba(255,220,120,0.25)', 0.8);

  // Glow on ground
  const groundGlow = radialGrad(ctx, W / 2, H, 0, W * 0.8, [
    [0,   'rgba(200,160,60,0.2)'],
    [0.4, 'rgba(150,100,30,0.05)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = groundGlow;
  ctx.fillRect(0, 0, W, H);

  save(canvas, 'bg-paradise.png');
}

// ── Image 5: bg-dawn.png ─────────────────────────────────────────────────────
// New dawn — peaceful golden sunrise, rolling Judean hills — for CTA
function genDawn() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(55);

  // Sky: deep night to warm golden horizon
  const sky = linearGrad(ctx, 0, 0, 0, H * 0.68, [
    [0,    '#030814'],
    [0.2,  '#0a1535'],
    [0.45, '#1e2a60'],
    [0.65, '#6a3a80'],
    [0.8,  '#c25030'],
    [0.9,  '#e8801a'],
    [1,    '#f5b030'],
  ]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Venus / morning star
  ctx.beginPath();
  ctx.arc(W * 0.35, H * 0.12, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,248,220,0.95)';
  ctx.fill();
  const vGlow = radialGrad(ctx, W * 0.35, H * 0.12, 0, 30, [
    [0, 'rgba(255,248,220,0.4)'],
    [1, 'rgba(255,248,220,0)'],
  ]);
  ctx.fillStyle = vGlow;
  ctx.fillRect(W * 0.35 - 30, H * 0.12 - 30, 60, 60);

  // Stars fading
  drawStars(ctx, rng, 120, 0.55);

  // Thin dawn cirrus clouds
  drawClouds(ctx, rng, H * 0.18, 10, 'rgba(200,100,180,0.5)', 0.7);
  drawClouds(ctx, rng, H * 0.28, 8, 'rgba(220,140,60,0.4)', 0.8);
  drawClouds(ctx, rng, H * 0.12, 6, 'rgba(100,80,160,0.5)', 0.6);

  // Sunrise glow at horizon
  const sunGlow = radialGrad(ctx, W * 0.5, H * 0.68, 0, 380, [
    [0,    'rgba(255,220,100,0.9)'],
    [0.15, 'rgba(255,160,30,0.6)'],
    [0.4,  'rgba(220,90,10,0.3)'],
    [0.7,  'rgba(160,40,0,0.1)'],
    [1,    'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, W, H);

  // Distant hills — layers
  // Far hills (lighter, hazy)
  ctx.fillStyle = 'rgba(30,20,50,0.7)';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.68);
  ctx.bezierCurveTo(W * 0.1, H * 0.62, W * 0.2, H * 0.60, W * 0.32, H * 0.63);
  ctx.bezierCurveTo(W * 0.44, H * 0.66, W * 0.52, H * 0.60, W * 0.62, H * 0.62);
  ctx.bezierCurveTo(W * 0.72, H * 0.64, W * 0.84, H * 0.58, W, H * 0.63);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Mid hills
  ctx.fillStyle = '#12100e';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.74);
  ctx.bezierCurveTo(W * 0.08, H * 0.68, W * 0.18, H * 0.70, W * 0.28, H * 0.72);
  ctx.bezierCurveTo(W * 0.38, H * 0.74, W * 0.48, H * 0.68, W * 0.58, H * 0.71);
  ctx.bezierCurveTo(W * 0.7,  H * 0.74, W * 0.83, H * 0.67, W, H * 0.72);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Foreground dark hill
  ctx.fillStyle = '#0a0808';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.82);
  ctx.bezierCurveTo(W * 0.15, H * 0.76, W * 0.30, H * 0.80, W * 0.45, H * 0.78);
  ctx.bezierCurveTo(W * 0.60, H * 0.76, W * 0.75, H * 0.80, W, H * 0.77);
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  // Horizon reflection band
  const hrz = linearGrad(ctx, 0, H * 0.65, 0, H * 0.72, [
    [0, 'rgba(250,160,40,0.3)'],
    [1, 'rgba(250,160,40,0)'],
  ]);
  ctx.fillStyle = hrz;
  ctx.fillRect(0, H * 0.65, W, H * 0.07);

  // Vignette
  const vig = radialGrad(ctx, W / 2, H / 2, H * 0.25, W * 0.72, [
    [0,   'rgba(0,0,0,0)'],
    [0.55,'rgba(0,0,0,0)'],
    [1,   'rgba(0,0,0,0.4)'],
  ]);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  save(canvas, 'bg-dawn.png');
}

// ── Run all ──────────────────────────────────────────────────────────────────
console.log('Generating background images…\n');
genHook();
genGolgotha();
genCry();
genParadise();
genDawn();
console.log('\nDone.');
