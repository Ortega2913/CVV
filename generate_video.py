#!/usr/bin/env python3
"""
Testimony-Style Motion Graphics Video
Worship Hook — kinetic typography + bokeh particles
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from moviepy import VideoClip
import math, random, os

# ── CONFIG ──────────────────────────────────────────────────────────────────
W, H   = 1080, 1920          # 9:16 portrait (TikTok / Reels)
FPS    = 30
OUTPUT = '/home/user/CVV/testimony_video.mp4'

FONT_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FONT_R = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

# Palette
C_BG1  = (3,  5, 18)         # near-black (top)
C_BG2  = (8, 14, 42)         # deep navy  (bottom)
C_TEXT = (235, 238, 255)      # cool white
C_GOLD = (255, 205,  90)      # warm gold
C_PURP = (140,  90, 255)      # purple highlight
C_BLUE = ( 70, 130, 255)      # electric blue

# ── SCENE DEFINITION ────────────────────────────────────────────────────────
#  (lines, duration_s, style)
#  styles: 'normal' | 'accent' | 'quote' | 'big' | 'cta'
SCENES = [
    # --- HOOK ---
    (["I was suicidal",    "at 3am…"],               4.5, 'normal'),
    (["then I heard",      "this song."],              3.5, 'accent'),
    # --- STORY ---
    (["Tears were flowing,","my heart was broken,"],   4.0, 'normal'),
    (["but the lyrics said…"],                         2.5, 'normal'),
    (['"You are not alone."'],                         4.5, 'quote'),
    # --- TURNING POINT ---
    (["In that moment",    "I felt God's arms",
      "wrap around me."],                              5.0, 'normal'),
    # --- VIEWER CTA ---
    (["If you're in that", "dark place right now,",
      "know this:"],                                   4.5, 'normal'),
    (["God is with you."],                             3.5, 'accent'),
    (["He loves you",      "even when you",
      "can't feel it."],                               4.5, 'normal'),
    # --- WORSHIP CTA ---
    (["Play this worship,","cry it out,"],             3.5, 'normal'),
    (["and let Him heal you."],                        3.0, 'accent'),
    # --- CLOSER ---
    (["You're going",      "to make it."],             5.0, 'big'),
    (["Drop a ♥ if this", "gives you hope."],     4.0, 'cta'),
]

# Build cumulative scene start times
scene_starts = []
t = 0.0
for lines, dur, style in SCENES:
    scene_starts.append(t)
    t += dur
TOTAL = t

# ── PARTICLE SYSTEM ──────────────────────────────────────────────────────────
rng = np.random.default_rng(7)
N   = 90
px  = rng.uniform(0, W, N)
py  = rng.uniform(0, H, N)
ps  = rng.uniform(3, 14, N)        # radius
pspd= rng.uniform(0.06, 0.35, N)   # upward drift px/frame
pdx = rng.uniform(-0.12, 0.12, N)  # horizontal drift
pal = rng.uniform(0.08, 0.55, N)   # base alpha
pph = rng.uniform(0, 2*math.pi, N) # phase for twinkle

# 0=blue 1=purple 2=gold
ptype = rng.integers(0, 3, N)
PCOLS = [C_BLUE, C_PURP, C_GOLD]

# ── HELPERS ──────────────────────────────────────────────────────────────────
def ease_in_out(x: float) -> float:
    return x * x * (3 - 2 * x)

def alpha_ramp(local_t: float, dur: float, fade_in=0.45, fade_out=0.45) -> float:
    """0→1 fade-in, hold, 1→0 fade-out, clamped."""
    if local_t < fade_in:
        return ease_in_out(max(0.0, local_t / fade_in))
    if local_t > dur - fade_out:
        return ease_in_out(max(0.0, (dur - local_t) / fade_out))
    return 1.0

def wrap_text_lines(lines, font, max_w):
    """Break lines that are too wide."""
    result = []
    for line in lines:
        if font.getbbox(line)[2] <= max_w:
            result.append(line)
        else:
            words = line.split()
            cur = ""
            for w in words:
                test = (cur + " " + w).strip()
                if font.getbbox(test)[2] <= max_w:
                    cur = test
                else:
                    if cur:
                        result.append(cur)
                    cur = w
            if cur:
                result.append(cur)
    return result

def blend_rgba(base: Image.Image, overlay: Image.Image) -> Image.Image:
    return Image.alpha_composite(base.convert('RGBA'), overlay).convert('RGB')

# ── BACKGROUND GRADIENT (static numpy array) ─────────────────────────────────
def make_gradient() -> np.ndarray:
    rows = np.linspace(0, 1, H)[:, None]
    r = (C_BG1[0] + (C_BG2[0] - C_BG1[0]) * rows).astype(np.uint8)
    g = (C_BG1[1] + (C_BG2[1] - C_BG1[1]) * rows).astype(np.uint8)
    b = (C_BG1[2] + (C_BG2[2] - C_BG1[2]) * rows).astype(np.uint8)
    arr = np.concatenate([r, g, b], axis=1).reshape(H, 1, 3)
    return np.broadcast_to(arr, (H, W, 3)).copy()

GRADIENT = make_gradient()

# ── CENTRAL GLOW (pre-render) ─────────────────────────────────────────────────
def make_glow_layer() -> np.ndarray:
    """Soft radial purple/blue glow in the vertical centre."""
    cx, cy = W // 2, H // 2
    Y, X = np.ogrid[:H, :W]
    dist = np.sqrt((X - cx)**2 + (Y - cy)**2)
    sig  = 480.0
    mask = np.exp(-(dist**2) / (2 * sig**2))         # 0..1
    glow = np.zeros((H, W, 3), dtype=np.float32)
    glow[:,:,0] += mask * 18
    glow[:,:,1] += mask *  8
    glow[:,:,2] += mask * 55
    return glow.astype(np.uint8)

GLOW_LAYER = make_glow_layer()

# ── VIGNETTE (pre-render) ─────────────────────────────────────────────────────
def make_vignette() -> np.ndarray:
    cx, cy = W / 2, H / 2
    Y, X = np.ogrid[:H, :W]
    dist = np.sqrt(((X - cx) / (W / 2))**2 + ((Y - cy) / (H / 2))**2)
    mask = np.clip(1 - dist * 0.65, 0, 1)[:, :, None]   # dark edges
    return mask

VIGNETTE = make_vignette()

# ── PARTICLE DRAW ─────────────────────────────────────────────────────────────
def draw_particles(img: Image.Image, t: float) -> Image.Image:
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    drw     = ImageDraw.Draw(overlay)
    frame   = t * FPS

    for i in range(N):
        x = (px[i] + pdx[i] * frame) % W
        y = (py[i] - pspd[i] * frame) % H
        r = ps[i]
        twinkle = 0.5 + 0.5 * math.sin(t * 1.2 + pph[i])
        a = int(pal[i] * twinkle * 255)
        col = PCOLS[ptype[i]]

        # Soft bokeh: multiple concentric circles with fading alpha
        steps = max(2, int(r))
        for k in range(steps, 0, -1):
            ka = int(a * (1 - (steps - k) / steps) ** 2 * 0.5)
            drw.ellipse([x - k, y - k, x + k, y + k],
                        fill=(col[0], col[1], col[2], ka))

    return blend_rgba(img, overlay)

# ── TEXT RENDERING ────────────────────────────────────────────────────────────
STYLE_CFG = {
    #           (font_path,  base_size, text_color, glow_color, line_gap_extra, letter_spacing)
    'normal': (FONT_B, 78,  C_TEXT,   C_PURP, 10, 0),
    'accent': (FONT_B, 82,  C_GOLD,   C_GOLD, 12, 0),
    'quote' : (FONT_R, 90,  C_TEXT,   C_BLUE, 14, 0),
    'big'   : (FONT_B, 112, C_TEXT,   C_PURP, 18, 0),
    'cta'   : (FONT_B, 76,  C_GOLD,   C_GOLD, 10, 0),
}

def render_text_block(lines: list, style: str, alpha: float, drift_y: float) -> Image.Image:
    font_path, sz, tcol, gcol, lgap, _ = STYLE_CFG[style]
    try:
        font = ImageFont.truetype(font_path, sz)
    except Exception:
        font = ImageFont.load_default()

    max_w = int(W * 0.86)
    wrapped = wrap_text_lines(lines, font, max_w)

    # Measure block height
    lh = font.getbbox("Ag")[3] + lgap + 10
    block_h = lh * len(wrapped)
    y0 = (H - block_h) // 2 + int(drift_y)

    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    drw   = ImageDraw.Draw(layer)

    for i, line in enumerate(wrapped):
        bbox = font.getbbox(line)
        lw   = bbox[2] - bbox[0]
        x    = (W - lw) // 2
        y    = y0 + i * lh

        # ── glow passes ──────────────────────────────
        glow_size = sz // 5
        glow_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow_layer)
        for spread in range(glow_size, 0, -2):
            ga = int(alpha * 140 * (1 - spread / glow_size))
            gd.text((x, y), line, font=font,
                    fill=(gcol[0], gcol[1], gcol[2], ga))
        glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=glow_size // 2 + 1))
        layer = Image.alpha_composite(layer, glow_layer)

        # ── main text ─────────────────────────────────
        a8 = int(alpha * 255)
        drw.text((x, y), line, font=font,
                 fill=(tcol[0], tcol[1], tcol[2], a8))

    # ── thin accent underline for 'big' ──────────────
    if style == 'big':
        ux   = W // 2 - 120
        uy   = y0 + len(wrapped) * lh + 12
        uw   = 240
        ua   = int(alpha * 200)
        drw.rectangle([ux, uy, ux + uw, uy + 3],
                       fill=(C_GOLD[0], C_GOLD[1], C_GOLD[2], ua))

    return layer

# ── FRAME GENERATOR ──────────────────────────────────────────────────────────
def make_frame(t: float) -> np.ndarray:
    # 1. Background
    bg = np.clip(GRADIENT.astype(np.int16) + GLOW_LAYER.astype(np.int16), 0, 255).astype(np.uint8)
    bg = (bg * VIGNETTE).astype(np.uint8)
    img = Image.fromarray(bg, 'RGB')

    # 2. Particles
    img = draw_particles(img, t)

    # 3. Find which scene we're in
    cur_idx = 0
    for idx, st in enumerate(scene_starts):
        if t >= st:
            cur_idx = idx

    lines, dur, style = SCENES[cur_idx]
    local_t = t - scene_starts[cur_idx]

    alpha   = alpha_ramp(local_t, dur, fade_in=0.4, fade_out=0.4)
    # Entrance drift: text slides up from +28px → 0
    drift_y = 28 * (1 - ease_in_out(min(1.0, local_t / 0.45)))

    text_layer = render_text_block(lines, style, alpha, drift_y)
    img = blend_rgba(img, text_layer)

    return np.array(img)

# ── RENDER ────────────────────────────────────────────────────────────────────
print(f"Rendering {TOTAL:.1f}s @ {FPS}fps  →  {OUTPUT}")
print(f"Total frames: {int(TOTAL * FPS)}")

clip = VideoClip(make_frame, duration=TOTAL)
clip.write_videofile(
    OUTPUT,
    fps=FPS,
    codec='libx264',
    preset='fast',
    ffmpeg_params=['-crf', '18', '-pix_fmt', 'yuv420p'],
    logger='bar',
)
print(f"\nDone!  →  {OUTPUT}")
