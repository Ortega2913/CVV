/**
 * Generates 5 cinematic/painterly 1920×1080 images for the video.
 * Techniques: fBm noise, tenebrism lighting, silhouette crowds,
 * volumetric god-rays, multi-pass layering.
 */
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../public');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const W = 1920, H = 1080;

function save(canvas, name) {
  const buf = canvas.toBuffer('image/jpeg', { quality: 92 });
  writeFileSync(join(OUT, name), buf);
  console.log('✓', name, `(${(buf.length / 1024).toFixed(0)} KB)`);
}

// ── Seeded RNG & noise ───────────────────────────────────────────────────────
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

function makeValueNoise(rng, G = 12) {
  const t = Float32Array.from({ length: G * G }, () => rng());
  const lerp = (a, b, t) => a + (b - a) * t;
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  return (x, y) => {
    const xi = Math.floor(x) % G, yi = Math.floor(y) % G;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const i = (xi + G) % G, j = (yi + G) % G;
    return lerp(
      lerp(t[i + j * G], t[(i + 1) % G + j * G], fade(xf)),
      lerp(t[i + ((j + 1) % G) * G], t[(i + 1) % G + ((j + 1) % G) * G], fade(xf)),
      fade(yf)
    );
  };
}

// Fractal Brownian Motion
function fbm(noise, x, y, octaves = 5, lacunarity = 2.0, gain = 0.5) {
  let v = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    v += noise(x * freq, y * freq) * amp;
    max += amp; amp *= gain; freq *= lacunarity;
  }
  return v / max;
}

// Draw a silhouette human figure (arms spread on cross)
function drawCrucifiedFigure(ctx, cx, cy, scale, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = scale * 0.12;
  ctx.lineCap = 'round';
  // head
  ctx.beginPath();
  ctx.arc(cx, cy - scale * 0.55, scale * 0.11, 0, Math.PI * 2);
  ctx.fill();
  // torso
  ctx.beginPath();
  ctx.moveTo(cx, cy - scale * 0.42);
  ctx.lineTo(cx, cy + scale * 0.22);
  ctx.stroke();
  // arms
  ctx.beginPath();
  ctx.moveTo(cx - scale * 0.32, cy - scale * 0.28);
  ctx.lineTo(cx + scale * 0.32, cy - scale * 0.28);
  ctx.stroke();
  // legs
  ctx.beginPath();
  ctx.moveTo(cx, cy + scale * 0.22);
  ctx.lineTo(cx - scale * 0.12, cy + scale * 0.60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy + scale * 0.22);
  ctx.lineTo(cx + scale * 0.12, cy + scale * 0.60);
  ctx.stroke();
  ctx.restore();
}

// Draw a cross timber
function drawCross(ctx, cx, cy, w, h, color) {
  ctx.fillStyle = color;
  const bw = w * 0.14, bh = h;
  const aw = w, ah = h * 0.15;
  const ayOff = h * 0.22;
  ctx.fillRect(cx - bw / 2, cy - h * 0.12, bw, bh);
  ctx.fillRect(cx - aw / 2, cy + ayOff, aw, ah);
}

// Crowd silhouette strip along the bottom
function drawCrowd(ctx, rng, y, count, baseH, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const x = (i / count) * W + rng() * 40 - 20;
    const personH = baseH * (0.7 + rng() * 0.5);
    const px = x + rng() * 10;
    const py = y - personH;
    // body
    ctx.fillRect(px - 6, py, 13, personH * 0.65);
    // head
    ctx.beginPath();
    ctx.arc(px, py - 7, 8, 0, Math.PI * 2);
    ctx.fill();
    // spear / staff occasionally
    if (rng() > 0.65) {
      ctx.fillRect(px + 10, py - personH * 0.4, 2, personH * 0.9);
    }
  }
  ctx.restore();
}

// Radial gradient helper
function rg(ctx, cx, cy, r0, r1, stops) {
  const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

// Linear gradient helper
function lg(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

// God-rays from a point
function drawGodRays(ctx, ox, oy, count, len, spread, baseAlpha, color) {
  for (let i = 0; i < count; i++) {
    const angle = Math.PI / 2 + (i - count / 2) * spread;
    const halfW = 0.012 + Math.random() * 0.025;
    ctx.save();
    ctx.globalAlpha = baseAlpha * (0.4 + Math.random() * 0.6);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + Math.cos(angle - halfW) * len, oy + Math.sin(angle - halfW) * len);
    ctx.lineTo(ox + Math.cos(angle + halfW) * len, oy + Math.sin(angle + halfW) * len);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 1: art-hook.jpg  — Cosmic night, lone star, silhouetted hill
// ════════════════════════════════════════════════════════════════════════════
function genHook() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(11);
  const noise = makeValueNoise(rng);

  // Deep space background
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [
    [0,    '#010108'],
    [0.4,  '#04050f'],
    [0.7,  '#080412'],
    [1,    '#100408'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Nebula clouds using fBm
  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const nx = x / 320, ny = y / 320;
      const n = fbm(noise, nx, ny, 6);
      const gn = fbm(noise, nx + 3.7, ny + 1.1, 4);
      const idx = (y * W + x) * 4;
      // Purple/gold nebula mix
      d[idx]     = Math.min(255, d[idx]     + n * 30 + gn * 15);
      d[idx + 1] = Math.min(255, d[idx + 1] + n * 10 + gn *  8);
      d[idx + 2] = Math.min(255, d[idx + 2] + n * 50 + gn * 20);
      // Mirror pixel
      const idx2 = ((y + 1) * W + x) * 4;
      if (idx2 + 3 < d.length) { d[idx2] = d[idx]; d[idx2+1] = d[idx+1]; d[idx2+2] = d[idx+2]; }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Milky way band
  ctx.save();
  ctx.globalAlpha = 0.09;
  ctx.fillStyle = lg(ctx, W * 0.1, H, W * 0.9, 0, [
    [0,    'rgba(160,180,255,0)'],
    [0.3,  'rgba(200,215,255,0.9)'],
    [0.5,  'rgba(220,230,255,1)'],
    [0.7,  'rgba(200,215,255,0.9)'],
    [1,    'rgba(160,180,255,0)'],
  ]);
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // Stars — many small
  for (let i = 0; i < 700; i++) {
    const sx = rng() * W, sy = rng() * H * 0.82;
    const sr = rng() * 1.2 + 0.2;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,252,240,${(rng() * 0.5 + 0.3).toFixed(2)})`;
    ctx.fill();
  }

  // THE STAR — bright focal star (symbolising Christ)
  const starX = W * 0.5, starY = H * 0.28;
  // Outer halo
  ctx.fillStyle = rg(ctx, starX, starY, 0, 180, [
    [0,   'rgba(255,240,180,0.35)'],
    [0.3, 'rgba(255,220,120,0.15)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(0, 0, W, H);
  // Cross-hair diffraction spikes
  ctx.save();
  ctx.strokeStyle = 'rgba(255,245,200,0.7)';
  ctx.lineWidth = 0.8;
  for (const angle of [0, Math.PI / 2, Math.PI / 4, Math.PI * 3 / 4]) {
    ctx.beginPath();
    ctx.moveTo(starX - Math.cos(angle) * 90, starY - Math.sin(angle) * 90);
    ctx.lineTo(starX + Math.cos(angle) * 90, starY + Math.sin(angle) * 90);
    ctx.stroke();
  }
  ctx.restore();
  // Core
  ctx.beginPath();
  ctx.arc(starX, starY, 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,252,220,1)';
  ctx.fill();

  // Hill silhouette
  ctx.fillStyle = '#06020a';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.84);
  ctx.bezierCurveTo(W * 0.2,  H * 0.76, W * 0.4,  H * 0.80, W * 0.5,  H * 0.81);
  ctx.bezierCurveTo(W * 0.62, H * 0.82, W * 0.78, H * 0.75, W,        H * 0.82);
  ctx.lineTo(W, H);
  ctx.fill();

  // Vignette
  ctx.fillStyle = rg(ctx, W/2, H/2, H*0.25, W*0.85, [
    [0, 'rgba(0,0,0,0)'], [0.6, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.55)'],
  ]);
  ctx.fillRect(0, 0, W, H);

  save(canvas, 'art-hook.jpg');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 2: art-golgotha.jpg — Three crosses, crowd, crimson sunset, god-rays
// ════════════════════════════════════════════════════════════════════════════
function genGolgotha() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(77);
  const noise = makeValueNoise(rng);

  // Sky: deep purple-indigo overhead → crimson → orange/gold at horizon
  ctx.fillStyle = lg(ctx, 0, 0, 0, H * 0.70, [
    [0,    '#0c0220'],
    [0.18, '#220630'],
    [0.38, '#6a0e18'],
    [0.58, '#c42808'],
    [0.78, '#e86010'],
    [0.90, '#f09030'],
    [1,    '#f8c050'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Cloud layer using noise
  const cloudData = ctx.getImageData(0, 0, W, H);
  const cd = cloudData.data;
  for (let y = 0; y < H * 0.68; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const nx = x / 380, ny = y / 220;
      const n = fbm(noise, nx, ny + 0.5, 5);
      const weight = Math.max(0, n - 0.42) * 2.5;
      const idx = (y * W + x) * 4;
      // Dark storm cloud tint
      const r = cd[idx], g = cd[idx+1], b = cd[idx+2];
      cd[idx]   = r - weight * 80;
      cd[idx+1] = g - weight * 60;
      cd[idx+2] = b - weight * 40;
      const idx2 = ((y+1)*W+x)*4;
      if (idx2+3 < cd.length) { cd[idx2]=cd[idx]; cd[idx2+1]=cd[idx+1]; cd[idx2+2]=cd[idx+2]; }
    }
  }
  ctx.putImageData(cloudData, 0, 0);

  // Sun disk
  const sunX = W * 0.58, sunY = H * 0.67;
  ctx.fillStyle = rg(ctx, sunX, sunY, 0, 200, [
    [0,    'rgba(255,255,210,0.95)'],
    [0.1,  'rgba(255,220,80,0.75)'],
    [0.35, 'rgba(240,120,10,0.4)'],
    [0.65, 'rgba(180,40,0,0.12)'],
    [1,    'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // God rays from sun
  drawGodRays(ctx, sunX, sunY, 22, 900, 0.20, 0.07, 'rgba(255,200,60,1)');

  // Atmospheric haze at horizon
  ctx.fillStyle = lg(ctx, 0, H * 0.60, 0, H * 0.72, [
    [0, 'rgba(240,140,40,0)'], [1, 'rgba(240,170,60,0.3)'],
  ]);
  ctx.fillRect(0, H * 0.60, W, H * 0.12);

  // GROUND — dark rocky Golgotha hill
  const groundColor = '#0e0808';
  ctx.fillStyle = groundColor;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.70);
  ctx.bezierCurveTo(W * 0.08, H * 0.64, W * 0.22, H * 0.61, W * 0.38, H * 0.64);
  ctx.bezierCurveTo(W * 0.50, H * 0.67, W * 0.56, H * 0.72, W * 0.63, H * 0.70);
  ctx.bezierCurveTo(W * 0.74, H * 0.67, W * 0.86, H * 0.62, W,        H * 0.68);
  ctx.lineTo(W, H);
  ctx.fill();

  // Rocky ground texture
  for (let i = 0; i < 2400; i++) {
    const rx = rng() * W, ry = H * 0.68 + rng() * H * 0.32;
    const n = fbm(noise, rx / 160, ry / 160, 3);
    if (n > 0.45) {
      ctx.beginPath();
      ctx.ellipse(rx, ry, rng()*8+2, rng()*4+1, rng()*Math.PI, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${50+n*30},${25+n*15},${10+n*8},${rng()*0.35+0.1})`;
      ctx.fill();
    }
  }

  // THREE CROSSES on the hill crest
  const crossPositions = [
    { x: W * 0.32, y: H * 0.52, w: 70,  h: 160, figColor: '#3a1a0a' },
    { x: W * 0.50, y: H * 0.46, w: 88,  h: 190, figColor: '#c8a040' }, // Jesus — gold
    { x: W * 0.68, y: H * 0.52, w: 70,  h: 160, figColor: '#3a1a0a' },
  ];

  // Glow behind center cross (divine light)
  ctx.fillStyle = rg(ctx, W * 0.50, H * 0.44, 0, 280, [
    [0,   'rgba(255,230,120,0.35)'],
    [0.3, 'rgba(220,160,40,0.15)'],
    [0.7, 'rgba(180,80,10,0.06)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(0, 0, W, H);

  for (const { x, y, w, h, figColor } of crossPositions) {
    drawCross(ctx, x, y, w, h, '#2a1005');
    drawCrucifiedFigure(ctx, x, y - h * 0.05, h * 0.80, figColor);
  }

  // Crowd of onlookers
  drawCrowd(ctx, rng, H * 0.78, 55, 55, '#0a0606', 0.85);
  drawCrowd(ctx, rng, H * 0.88, 40, 35, '#080404', 0.7);

  // Roman soldiers with spears (foreground)
  drawCrowd(ctx, rng, H * 0.74, 12, 65, '#150808', 0.95);

  // Screen vignette
  ctx.fillStyle = rg(ctx, W/2, H/2, H*0.2, W*0.82, [
    [0, 'rgba(0,0,0,0)'], [0.55, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.5)'],
  ]);
  ctx.fillRect(0, 0, W, H);

  save(canvas, 'art-golgotha.jpg');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 3: art-darkness.jpg — Supernatural darkness over the land (Luke 23:44)
// ════════════════════════════════════════════════════════════════════════════
function genDarkness() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(666);
  const noise = makeValueNoise(rng);

  // Near-black base
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [
    [0,   '#020006'],
    [0.3, '#0d0208'],
    [0.6, '#180208'],
    [1,   '#050002'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Boiling storm-cloud texture
  const cd = ctx.getImageData(0, 0, W, H);
  const dd = cd.data;
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const nx = x / 260, ny = y / 260;
      const n  = fbm(noise, nx + 1.1, ny + 0.3, 7);
      const n2 = fbm(noise, nx + 5.7, ny + 2.9, 4);
      const idx = (y * W + x) * 4;
      dd[idx]   = Math.min(255, dd[idx]   + n * 55 + n2 * 15);
      dd[idx+1] = Math.min(255, dd[idx+1] + n * 12 + n2 * 5);
      dd[idx+2] = Math.min(255, dd[idx+2] + n * 30 + n2 * 10);
      const idx2 = ((y+1)*W+x)*4;
      if (idx2+3 < dd.length) { dd[idx2]=dd[idx]; dd[idx2+1]=dd[idx+1]; dd[idx2+2]=dd[idx+2]; }
    }
  }
  ctx.putImageData(cd, 0, 0);

  // Blood-red pulse at centre (where Jesus hangs)
  ctx.fillStyle = rg(ctx, W/2, H*0.4, 0, 500, [
    [0,   'rgba(140,10,10,0.55)'],
    [0.25,'rgba(100,5,5,0.3)'],
    [0.55,'rgba(50,0,0,0.1)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Lightning branches
  const drawLightning = (x0, y0, len, branches, alpha) => {
    if (len < 18 || branches < 0) return;
    ctx.save();
    ctx.strokeStyle = `rgba(200,170,255,${alpha})`;
    ctx.lineWidth = branches === 3 ? 1.5 : 0.8;
    ctx.shadowColor = 'rgba(180,150,255,0.6)';
    ctx.shadowBlur = 8;
    const angle = Math.PI/2 + (rng()-0.5)*0.8;
    const x1 = x0 + Math.cos(angle)*(len*(0.5+rng()*0.5));
    const y1 = y0 + Math.sin(angle)*(len*(0.5+rng()*0.5));
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.restore();
    if (rng() > 0.45) drawLightning(x1,y1,len*0.55,branches-1,alpha*0.7);
    drawLightning(x1,y1,len*0.65,branches-1,alpha*0.8);
  };
  drawLightning(W*0.70, H*0.03, 260, 3, 0.55);
  drawLightning(W*0.22, H*0.00, 200, 3, 0.4);

  // Silhouette cross barely visible
  ctx.save();
  ctx.globalAlpha = 0.35;
  drawCross(ctx, W/2, H*0.45, 100, 210, '#1a0808');
  drawCrucifiedFigure(ctx, W/2, H*0.38, H*0.28, '#0a0404');
  ctx.restore();

  // Ground
  ctx.fillStyle = '#060005';
  ctx.beginPath();
  ctx.moveTo(0,H); ctx.lineTo(0,H*0.80);
  ctx.bezierCurveTo(W*0.2,H*0.74,W*0.4,H*0.78,W*0.55,H*0.76);
  ctx.bezierCurveTo(W*0.7,H*0.74,W*0.85,H*0.79,W,H*0.77);
  ctx.lineTo(W,H); ctx.fill();

  // Heavy vignette
  ctx.fillStyle = rg(ctx, W/2, H/2, H*0.15, W*0.75, [
    [0,'rgba(0,0,0,0)'],[0.45,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0.75)'],
  ]);
  ctx.fillRect(0,0,W,H);

  save(canvas, 'art-darkness.jpg');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 4: art-paradise.jpg — Heaven breaking open, brilliant shafts of light
// ════════════════════════════════════════════════════════════════════════════
function genParadise() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(333);
  const noise = makeValueNoise(rng);

  // Base dark cloud sky
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [
    [0,   '#050810'],
    [0.4, '#0a1020'],
    [0.7, '#101828'],
    [1,   '#060810'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Cloud texture (darker storm rolling apart)
  const cd = ctx.getImageData(0, 0, W, H);
  const dd = cd.data;
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const nx = x/300, ny = y/280;
      const n = fbm(noise, nx+2.1, ny+0.8, 6);
      const distFromCenter = Math.abs(x/W - 0.5) * 2;
      const weight = Math.max(0, n - 0.38) * (0.5 + distFromCenter * 1.5);
      const idx = (y*W+x)*4;
      dd[idx]   = Math.min(255, dd[idx]   + weight*60);
      dd[idx+1] = Math.min(255, dd[idx+1] + weight*70);
      dd[idx+2] = Math.min(255, dd[idx+2] + weight*90);
      const idx2 = ((y+1)*W+x)*4;
      if (idx2+3<dd.length){dd[idx2]=dd[idx];dd[idx2+1]=dd[idx+1];dd[idx2+2]=dd[idx+2];}
    }
  }
  ctx.putImageData(cd, 0, 0);

  // Heaven opening: aperture of pure white-gold light
  const hx = W*0.5, hy = H*0.35;

  // Outer warm glow
  ctx.fillStyle = rg(ctx, hx, hy, 0, W*0.7, [
    [0,   'rgba(255,240,180,0.4)'],
    [0.2, 'rgba(240,200,100,0.2)'],
    [0.5, 'rgba(180,140,40,0.08)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(0,0,W,H);

  // Mid glow
  ctx.fillStyle = rg(ctx, hx, hy, 0, 450, [
    [0,   'rgba(255,248,220,0.7)'],
    [0.15,'rgba(255,230,160,0.5)'],
    [0.4, 'rgba(220,180,80,0.2)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(0,0,W,H);

  // Core brilliance (nearly white)
  ctx.fillStyle = rg(ctx, hx, hy, 0, 160, [
    [0,    'rgba(255,255,255,1)'],
    [0.05, 'rgba(255,255,240,0.98)'],
    [0.15, 'rgba(255,248,200,0.85)'],
    [0.35, 'rgba(255,230,150,0.5)'],
    [0.6,  'rgba(220,180,80,0.15)'],
    [1,    'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(0,0,W,H);

  // God rays fanning down
  drawGodRays(ctx, hx, hy, 28, 1100, 0.18, 0.08, 'rgba(255,240,180,1)');

  // Bright cloud edges catching the light
  for (let i=0; i<24; i++) {
    const cx = W*(0.1+rng()*0.8);
    const cy = H*(0.1+rng()*0.55);
    const dist = Math.sqrt((cx-hx)**2+(cy-hy)**2);
    const glow = Math.max(0, 1 - dist/550);
    ctx.save();
    ctx.globalAlpha = glow * (0.15 + rng()*0.2);
    ctx.fillStyle = `rgba(255,248,220,1)`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 200+rng()*180, 60+rng()*70, rng()*0.5, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // Dark cloud banks framing the opening
  for (const side of [-1, 1]) {
    const cx = W*(side===1 ? 0.12 : 0.88);
    ctx.fillStyle = rg(ctx, cx, H*0.3, 0, 550, [
      [0, 'rgba(12,14,30,0.85)'],[0.5,'rgba(12,14,30,0.4)'],[1,'rgba(0,0,0,0)'],
    ]);
    ctx.fillRect(0,0,W,H);
  }

  // Ground catching light
  ctx.fillStyle = lg(ctx, 0, H*0.82, 0, H, [
    [0,'rgba(180,140,60,0.12)'],[1,'rgba(0,0,0,0.8)'],
  ]);
  ctx.fillRect(0, H*0.82, W, H*0.18);

  // Hill silhouette
  ctx.fillStyle = '#050408';
  ctx.beginPath();
  ctx.moveTo(0,H); ctx.lineTo(0,H*0.83);
  ctx.bezierCurveTo(W*0.15,H*0.77,W*0.35,H*0.81,W*0.5,H*0.82);
  ctx.bezierCurveTo(W*0.65,H*0.83,W*0.8,H*0.76,W,H*0.81);
  ctx.lineTo(W,H); ctx.fill();

  // Cross silhouette at centre of light
  ctx.save();
  ctx.globalAlpha = 0.75;
  drawCross(ctx, W*0.5, H*0.62, 90, 200, '#08050a');
  ctx.restore();

  save(canvas, 'art-paradise.jpg');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 5: art-dawn.jpg — Golden Judean dawn, olive trees, star of hope
// ════════════════════════════════════════════════════════════════════════════
function genDawn() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(999);
  const noise = makeValueNoise(rng);

  // Sky gradient: pre-dawn navy → rose → gold at horizon
  ctx.fillStyle = lg(ctx, 0, 0, 0, H*0.70, [
    [0,    '#03060e'],
    [0.18, '#0a1438'],
    [0.40, '#2a1860'],
    [0.60, '#7a2a80'],
    [0.75, '#c84030'],
    [0.88, '#e87018'],
    [1,    '#f8b030'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Cirrus clouds
  const cd = ctx.getImageData(0, 0, W, H);
  const dd = cd.data;
  for (let y = 0; y < H*0.65; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const nx = x/420, ny = y/180;
      const n = fbm(noise, nx, ny+3.5, 4);
      const weight = Math.max(0, n - 0.50) * 1.8;
      const idx = (y*W+x)*4;
      dd[idx]   = Math.min(255, dd[idx]   + weight*80);
      dd[idx+1] = Math.min(255, dd[idx+1] + weight*50);
      dd[idx+2] = Math.min(255, dd[idx+2] + weight*40);
      const idx2 = ((y+1)*W+x)*4;
      if (idx2+3<dd.length){dd[idx2]=dd[idx];dd[idx2+1]=dd[idx+1];dd[idx2+2]=dd[idx+2];}
    }
  }
  ctx.putImageData(cd, 0, 0);

  // Sunrise glow
  ctx.fillStyle = rg(ctx, W*0.5, H*0.70, 0, 500, [
    [0,   'rgba(255,220,80,0.85)'],
    [0.2, 'rgba(255,150,20,0.5)'],
    [0.5, 'rgba(200,70,0,0.2)'],
    [1,   'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Morning star (Venus)
  const vx = W*0.36, vy = H*0.14;
  ctx.fillStyle = rg(ctx, vx, vy, 0, 45, [
    [0,'rgba(255,250,220,0.5)'],[1,'rgba(0,0,0,0)'],
  ]);
  ctx.fillRect(vx-45, vy-45, 90, 90);
  ctx.beginPath(); ctx.arc(vx, vy, 3.5, 0, Math.PI*2);
  ctx.fillStyle='rgba(255,252,230,1)'; ctx.fill();

  // Stars fading
  for (let i=0; i<180; i++) {
    const sx = rng()*W, sy = rng()*H*0.55;
    const fade = 1 - sy/(H*0.55);
    ctx.beginPath();
    ctx.arc(sx,sy,rng()*1.1+0.2,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,252,240,${(rng()*0.4*fade+0.1*fade).toFixed(2)})`;
    ctx.fill();
  }

  // Distant hills (3 layers, atmospheric perspective)
  const hills = [
    { y:H*0.65, cp1y:H*0.58, cp2y:H*0.60, col:'rgba(50,35,70,0.7)' },
    { y:H*0.72, cp1y:H*0.66, cp2y:H*0.68, col:'rgba(30,22,40,0.85)' },
    { y:H*0.80, cp1y:H*0.74, cp2y:H*0.76, col:'#150e10' },
  ];
  for (const { y, cp1y, col } of hills) {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(0,H);
    ctx.lineTo(0, y);
    const steps = 14;
    for (let i=0; i<=steps; i++) {
      const tx = (i/steps)*W;
      const ty = y + (fbm(noise, tx/600 + rng()*0.1, cp1y/600, 3)-0.5)*60;
      ctx.lineTo(tx, ty);
    }
    ctx.lineTo(W, H); ctx.fill();
  }

  // Olive trees silhouettes
  const drawOlive = (tx, ty, sz) => {
    ctx.fillStyle = '#08060a';
    // trunk
    ctx.fillRect(tx-sz*0.06, ty-sz*0.5, sz*0.12, sz*0.5);
    // foliage blobs
    for (const [ox,oy,rx,ry] of [
      [0,-sz*0.6,sz*0.4,sz*0.55],[sz*0.3,-sz*0.45,sz*0.3,sz*0.4],
      [-sz*0.25,-sz*0.42,sz*0.28,sz*0.38],[sz*0.05,-sz*0.8,sz*0.22,sz*0.28],
    ]) {
      ctx.beginPath();
      ctx.ellipse(tx+ox, ty+oy, rx, ry, (rng()-0.5)*0.6, 0, Math.PI*2);
      ctx.fill();
    }
  };
  drawOlive(W*0.08, H*0.88, 90);
  drawOlive(W*0.14, H*0.92, 70);
  drawOlive(W*0.86, H*0.86, 100);
  drawOlive(W*0.92, H*0.90, 75);

  // Horizon glow band
  ctx.fillStyle = lg(ctx, 0, H*0.66, 0, H*0.72, [
    [0,'rgba(255,170,50,0.35)'],[1,'rgba(255,130,30,0)'],
  ]);
  ctx.fillRect(0, H*0.66, W, H*0.06);

  // Vignette
  ctx.fillStyle = rg(ctx, W/2, H/2, H*0.28, W*0.78, [
    [0,'rgba(0,0,0,0)'],[0.55,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0.45)'],
  ]);
  ctx.fillRect(0,0,W,H);

  save(canvas, 'art-dawn.jpg');
}

// ── Run all ──────────────────────────────────────────────────────────────────
console.log('Painting background art…\n');
genHook();
genGolgotha();
genDarkness();
genParadise();
genDawn();
console.log('\nAll done.');
