/**
 * Generates 10 transparent PNG parallax layers (mg + fg for each scene).
 * Background images are the existing art-*.jpg files.
 *
 * Layer depth convention:
 *   BG (art-*.jpg) → depth 0.25  — sky, distant scenery, slowest
 *   MG (mg-*.png)  → depth 0.70  — hills, trees, crowd
 *   FG (fg-*.png)  → depth 1.30  — rocks, branches, ground, fastest
 */
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../public');
const W = 1920, H = 1080;

function savePNG(canvas, name) {
  const buf = canvas.toBuffer('image/png');
  writeFileSync(join(OUT, name), buf);
  console.log('✓', name, `(${(buf.length / 1024).toFixed(0)} KB)`);
}

// Empty canvas — transparent by default
const mk = () => createCanvas(W, H);

// Seeded RNG
function rng(seed) {
  let s = seed >>> 0;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

// ── Primitives ───────────────────────────────────────────────────────────────

function rock(ctx, cx, cy, rx, ry, color, alpha = 0.9) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  // subtle highlight facet
  ctx.globalAlpha = alpha * 0.25;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  ctx.ellipse(cx - rx * 0.22, cy - ry * 0.28, rx * 0.38, ry * 0.28, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function branch(ctx, x, y, len, angle, width, depth, rand) {
  if (depth === 0 || len < 7) return;
  const x2 = x + Math.cos(angle) * len;
  const y2 = y + Math.sin(angle) * len;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2);
  ctx.lineWidth = width; ctx.stroke();
  const splits = depth > 2 ? 3 : 2;
  for (let i = 0; i < splits; i++) {
    branch(ctx, x2, y2, len * (0.55 + rand() * 0.22),
           angle + (rand() - 0.5) * 1.3, width * 0.62, depth - 1, rand);
  }
}

function hill(ctx, pts, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
  }
  const l = pts[pts.length - 1];
  ctx.lineTo(l[0], l[1]); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function olive(ctx, tx, ty, sz, rand) {
  ctx.fillStyle = '#0c0a08';
  // trunk
  ctx.fillRect(tx - sz * 0.06, ty - sz * 0.5, sz * 0.12, sz * 0.5);
  // foliage blobs
  for (const [ox, oy, rx, ry] of [
    [0, -sz * 0.62, sz * 0.42, sz * 0.58],
    [sz * 0.28, -sz * 0.48, sz * 0.32, sz * 0.42],
    [-sz * 0.28, -sz * 0.46, sz * 0.30, sz * 0.40],
    [sz * 0.06, -sz * 0.86, sz * 0.24, sz * 0.30],
  ]) {
    ctx.beginPath();
    ctx.ellipse(tx + ox, ty + oy, rx, ry, (rand() - 0.5) * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Ground strip with optional texture dots
function ground(ctx, topY, color, alpha = 1, textured = false, rand = null) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, topY);
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = topY + (rand ? (rand() - 0.5) * 16 : 0);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H); ctx.fill();
  if (textured && rand) {
    for (let i = 0; i < 200; i++) {
      const rx = rand() * W, ry = topY + rand() * (H - topY);
      ctx.globalAlpha = alpha * (rand() * 0.2 + 0.05);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(rx, ry, rand() * 2 + 0.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 1 — HOOK  (Night sky)
// ════════════════════════════════════════════════════════════════════════════
function s1MG() {
  const c = mk(); const ctx = c.getContext('2d');
  // Distant smooth rounded hills
  hill(ctx, [
    [0, H * 0.83], [W * 0.15, H * 0.76], [W * 0.32, H * 0.79],
    [W * 0.50, H * 0.81], [W * 0.68, H * 0.78], [W * 0.82, H * 0.75],
    [W, H * 0.80],
  ], '#050210', 0.95);
  savePNG(c, 'mg-hook.png');
}

function s1FG() {
  const c = mk(); const ctx = c.getContext('2d');
  const r = rng(21);
  // Closer jagged hilltop
  hill(ctx, [
    [0, H * 0.89], [W * 0.08, H * 0.85], [W * 0.18, H * 0.88],
    [W * 0.30, H * 0.91], [W * 0.44, H * 0.88], [W * 0.55, H * 0.90],
    [W * 0.68, H * 0.93], [W * 0.80, H * 0.88], [W * 0.92, H * 0.90],
    [W, H * 0.87],
  ], '#030109', 0.97);
  // Scattered rocks
  for (let i = 0; i < 14; i++)
    rock(ctx, r() * W, H * 0.87 + r() * H * 0.12, r() * 28 + 6, r() * 16 + 4, '#060211');
  // Left bare tree
  ctx.strokeStyle = '#030108'; ctx.lineCap = 'round';
  branch(ctx, W * 0.11, H * 0.91, 145, -Math.PI * 0.57, 6, 5, r);
  branch(ctx, W * 0.10, H * 0.95, 90, -Math.PI * 0.48, 4, 4, r);
  // Right bare tree (partial, edge)
  branch(ctx, W * 0.90, H * 0.93, 120, -Math.PI * 0.46, 5, 4, r);
  // Thin floating dust-mote particles (tiny specks at various heights)
  ctx.fillStyle = 'rgba(180,160,220,0.35)';
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.arc(r() * W, H * 0.3 + r() * H * 0.55, r() * 2.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  savePNG(c, 'fg-hook.png');
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2 — GOLGOTHA
// ════════════════════════════════════════════════════════════════════════════
function s2MG() {
  const c = mk(); const ctx = c.getContext('2d');
  const r = rng(77);
  // Rocky hill
  hill(ctx, [
    [0, H * 0.71], [W * 0.10, H * 0.64], [W * 0.24, H * 0.62],
    [W * 0.38, H * 0.64], [W * 0.50, H * 0.67], [W * 0.58, H * 0.70],
    [W * 0.70, H * 0.66], [W * 0.84, H * 0.63], [W, H * 0.68],
  ], '#0d0606', 0.96);
  // Crowd of onlookers on hill
  ctx.fillStyle = '#090404';
  for (let i = 0; i < 52; i++) {
    const px = W * (0.04 + (i / 52) * 0.92) + r() * 28;
    const ph = 28 + r() * 22;
    const py = H * 0.72 - ph * 0.5;
    ctx.fillRect(px - 5, py, 10, ph * 0.65);
    ctx.beginPath(); ctx.arc(px, py - 6, 7, 0, Math.PI * 2); ctx.fill();
    if (r() > 0.6) ctx.fillRect(px + 8, py - ph * 0.3, 2, ph * 0.8); // spear
  }
  savePNG(c, 'mg-golgotha.png');
}

function s2FG() {
  const c = mk(); const ctx = c.getContext('2d');
  const r = rng(88);
  // Large boulders, foreground
  for (const [cx, cy, rx, ry, col] of [
    [W * 0.04, H * 0.96, 95, 56, '#120808'],
    [W * 0.14, H * 0.99, 68, 40, '#0e0606'],
    [W * 0.24, H * 0.97, 44, 26, '#150a08'],
    [W * 0.74, H * 0.97, 52, 30, '#120808'],
    [W * 0.87, H * 0.96, 82, 50, '#0e0606'],
    [W * 0.96, H * 0.99, 48, 28, '#150a08'],
  ]) rock(ctx, cx, cy, rx, ry, col, 0.93);
  // Dried thornbushes
  ctx.strokeStyle = '#0d0606'; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const sx = r() * W, sy = H * 0.92 - r() * 40;
    for (let b = 0; b < 5; b++)
      branch(ctx, sx, sy, 30 + r() * 28, -Math.PI * (0.25 + r() * 0.55), 1.5, 3, r);
  }
  // Dark foreground ground strip
  ground(ctx, H * 0.93, 'rgba(7,3,3,0.90)', 1, true, r);
  // Two foreground soldier silhouettes (larger = closer)
  ctx.fillStyle = '#0a0404';
  for (const sx of [W * 0.38, W * 0.62]) {
    const sh = 95;
    ctx.fillRect(sx - 7, H * 0.88 - sh, 14, sh * 0.65);
    ctx.beginPath(); ctx.arc(sx, H * 0.88 - sh - 8, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(sx + 10, H * 0.88 - sh * 0.4, 2, sh * 0.8); // spear
  }
  savePNG(c, 'fg-golgotha.png');
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 3 — DARKNESS (Luke 23:44)
// ════════════════════════════════════════════════════════════════════════════
function s3MG() {
  const c = mk(); const ctx = c.getContext('2d');
  // Ghost-cross barely visible
  ctx.fillStyle = 'rgba(16,6,6,0.65)';
  ctx.fillRect(W / 2 - 9, H * 0.26, 18, H * 0.50);
  ctx.fillRect(W / 2 - 52, H * 0.41, 104, 16);
  // Figure on cross
  ctx.strokeStyle = 'rgba(14,5,5,0.55)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(W / 2, H * 0.30, 10, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W / 2 - 30, H * 0.40); ctx.lineTo(W / 2 + 30, H * 0.40);
  ctx.moveTo(W / 2, H * 0.35); ctx.lineTo(W / 2, H * 0.62); ctx.stroke();
  // Ground
  hill(ctx, [
    [0, H * 0.80], [W * 0.18, H * 0.74], [W * 0.42, H * 0.78],
    [W * 0.60, H * 0.76], [W * 0.80, H * 0.80], [W, H * 0.77],
  ], '#08030a', 0.90);
  savePNG(c, 'mg-darkness.png');
}

function s3FG() {
  const c = mk(); const ctx = c.getContext('2d');
  const r = rng(666);
  // Thorny branches reaching in from LEFT
  ctx.strokeStyle = '#09040a'; ctx.lineCap = 'round';
  branch(ctx, -15, H * 0.42, 210, 0.18, 5, 5, r);
  branch(ctx, -15, H * 0.58, 170, 0.08, 3.5, 4, r);
  branch(ctx, -15, H * 0.72, 130, 0.25, 3, 4, r);
  // Thorny branches from RIGHT
  branch(ctx, W + 15, H * 0.40, 210, Math.PI * 0.94, 5, 5, r);
  branch(ctx, W + 15, H * 0.62, 160, Math.PI * 0.98, 3.5, 4, r);
  // Dark rocks at bottom
  for (const [cx, cy, rx, ry] of [
    [W * 0.07, H * 0.97, 72, 44], [W * 0.20, H * 0.99, 50, 30],
    [W * 0.73, H * 0.98, 58, 34], [W * 0.92, H * 0.96, 76, 46],
  ]) rock(ctx, cx, cy, rx, ry, '#07030c', 0.88);
  // Foreground dark ground
  ground(ctx, H * 0.91, 'rgba(5,2,7,0.92)', 1, false);
  // Glowing crack in ground (ominous)
  ctx.save();
  ctx.strokeStyle = 'rgba(80,10,10,0.6)';
  ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(120,0,0,0.8)'; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(W * 0.42, H * 0.97); ctx.lineTo(W * 0.50, H * 0.92);
  ctx.lineTo(W * 0.54, H * 0.88); ctx.lineTo(W * 0.57, H * 0.93); ctx.stroke();
  ctx.restore();
  savePNG(c, 'fg-darkness.png');
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 4 — PARADISE (Heaven opening)
// ════════════════════════════════════════════════════════════════════════════
function s4MG() {
  const c = mk(); const ctx = c.getContext('2d');
  const r = rng(333);
  // Mid-level parting clouds (darker sides, bright-edged centre)
  for (let i = 0; i < 20; i++) {
    const cx = r() * W * 1.3 - W * 0.15;
    const cy = H * (0.08 + r() * 0.50);
    const rx = 170 + r() * 210;
    const ry = 45 + r() * 65;
    const distC = Math.abs(cx / W - 0.5) * 2; // 0=center, 1=edge
    const isDark = distC > 0.25;
    ctx.save();
    ctx.globalAlpha = isDark ? 0.50 + r() * 0.28 : 0.14 + r() * 0.14;
    ctx.fillStyle = isDark ? '#0b0d20' : 'rgba(255,245,210,0.5)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (r() - 0.5) * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Mid-ground hill
  hill(ctx, [
    [0, H * 0.85], [W * 0.18, H * 0.80], [W * 0.40, H * 0.83],
    [W * 0.55, H * 0.84], [W * 0.72, H * 0.80], [W * 0.88, H * 0.82], [W, H * 0.81],
  ], '#060408', 0.92);
  savePNG(c, 'mg-paradise.png');
}

function s4FG() {
  const c = mk(); const ctx = c.getContext('2d');
  const r = rng(444);
  // Dark storm cloud wisps — bottom-LEFT corner
  for (let i = 0; i < 10; i++) {
    ctx.save();
    ctx.globalAlpha = 0.55 + r() * 0.32;
    ctx.fillStyle = '#090b1c';
    ctx.beginPath();
    ctx.ellipse(r() * W * 0.45, H * (0.62 + r() * 0.28), 140 + r() * 130, 38 + r() * 52, (r() - 0.5) * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Dark cloud wisps — bottom-RIGHT corner
  for (let i = 0; i < 10; i++) {
    ctx.save();
    ctx.globalAlpha = 0.55 + r() * 0.32;
    ctx.fillStyle = '#0a0c1e';
    ctx.beginPath();
    ctx.ellipse(W * 0.55 + r() * W * 0.45, H * (0.62 + r() * 0.28), 140 + r() * 130, 38 + r() * 52, (r() - 0.5) * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Foreground ground base
  ground(ctx, H * 0.92, 'rgba(5,3,7,0.92)', 1, false);
  for (const [cx, cy, rx, ry] of [
    [W * 0.06, H * 0.97, 62, 36], [W * 0.17, H * 0.99, 42, 24],
    [W * 0.83, H * 0.98, 57, 33], [W * 0.94, H * 0.96, 66, 39],
  ]) rock(ctx, cx, cy, rx, ry, '#080512', 0.88);
  savePNG(c, 'fg-paradise.png');
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 5 — DAWN
// ════════════════════════════════════════════════════════════════════════════
function s5MG() {
  const c = mk(); const ctx = c.getContext('2d');
  const r = rng(999);
  // Rolling hill behind trees
  hill(ctx, [
    [0, H * 0.77], [W * 0.18, H * 0.71], [W * 0.38, H * 0.74],
    [W * 0.55, H * 0.72], [W * 0.72, H * 0.70], [W * 0.88, H * 0.74], [W, H * 0.72],
  ], '#110e0c', 0.94);
  // Mid-distance olive trees
  ctx.fillStyle = '#0e0c0a';
  olive(ctx, W * 0.22, H * 0.86, 82, r);
  olive(ctx, W * 0.33, H * 0.89, 66, r);
  olive(ctx, W * 0.68, H * 0.87, 76, r);
  olive(ctx, W * 0.80, H * 0.85, 90, r);
  savePNG(c, 'mg-dawn.png');
}

function s5FG() {
  const c = mk(); const ctx = c.getContext('2d');
  const r = rng(111);
  ctx.strokeStyle = '#0c0a08'; ctx.lineCap = 'round';
  // LEFT: large close-up olive trunk + branches
  ctx.fillStyle = '#0a0806';
  ctx.fillRect(W * 0.02, H * 0.52, 30, H * 0.48);   // trunk
  ctx.fillRect(W * 0.015, H * 0.46, 38, H * 0.10);  // thick fork
  ctx.lineWidth = 14; branch(ctx, W * 0.035, H * 0.56, 185, -Math.PI * 0.70, 14, 4, r);
  ctx.lineWidth = 11; branch(ctx, W * 0.035, H * 0.63, 155, -Math.PI * 0.54, 11, 4, r);
  // Foliage blobs left tree
  ctx.fillStyle = '#0a0806'; ctx.globalAlpha = 0.92;
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.ellipse(r() * W * 0.26, H * (0.24 + r() * 0.42), 52 + r() * 58, 36 + r() * 44, (r() - 0.5) * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // RIGHT: partial trunk + upper branches
  ctx.fillStyle = '#0c0a08';
  ctx.fillRect(W * 0.954, H * 0.60, 34, H * 0.40);
  ctx.lineWidth = 12; branch(ctx, W * 0.971, H * 0.63, 165, -Math.PI * 0.28, 12, 4, r);
  ctx.fillStyle = '#0c0a08'; ctx.globalAlpha = 0.90;
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.ellipse(W * (0.74 + r() * 0.26), H * (0.20 + r() * 0.44), 44 + r() * 50, 32 + r() * 38, (r() - 0.5) * 1.0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Foreground dark ground
  ground(ctx, H * 0.88, 'rgba(8,6,4,0.93)', 1, false);
  // Rocks mid-lower
  for (const [cx, cy, rx, ry] of [
    [W * 0.30, H * 0.97, 56, 33], [W * 0.42, H * 0.99, 38, 22],
    [W * 0.56, H * 0.98, 46, 27], [W * 0.67, H * 0.97, 62, 36],
  ]) rock(ctx, cx, cy, rx, ry, '#0e0c0a', 0.88);
  // Long grass blades
  ctx.strokeStyle = '#161008'; ctx.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    const gx = W * 0.26 + r() * W * 0.52;
    const gy = H * 0.91 - r() * 18;
    const gh = 22 + r() * 48;
    const gc = (r() - 0.5) * 28;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.quadraticCurveTo(gx + gc, gy - gh * 0.5, gx + gc * 1.6, gy - gh);
    ctx.stroke();
  }
  savePNG(c, 'fg-dawn.png');
}

// ── Run all ───────────────────────────────────────────────────────────────────
console.log('Generating parallax layer PNGs…\n');
s1MG(); s1FG();
s2MG(); s2FG();
s3MG(); s3FG();
s4MG(); s4FG();
s5MG(); s5FG();
console.log('\nDone. 10 layer images generated.');
