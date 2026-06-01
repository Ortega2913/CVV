/**
 * Pinterest image scraper using Playwright with stealth settings.
 * Searches for crucifixion / Calvary art pins and downloads images.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEST = join(__dirname, '../public/pinterest');
if (!existsSync(DEST)) mkdirSync(DEST, { recursive: true });

const QUERIES = [
  'crucifixion jesus painting art',
  'thief on cross biblical art',
  'calvary golgotha painting',
  'jesus cross sunset painting',
  'salvation grace biblical illustration',
];

const BROWSER_ARGS = [
  '--ignore-certificate-errors',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-blink-features=AutomationControlled',
  '--disable-infobars',
  '--window-size=1920,1080',
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = createWriteStream(dest);
    const req = proto.get(url, { rejectUnauthorized: false }, res => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: BROWSER_ARGS,
  headless: true,
});

const ctx = await browser.newContext({
  ignoreHTTPSErrors: true,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  viewport: { width: 1920, height: 1080 },
  locale: 'en-US',
});

// Mask automation signals
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
  window.chrome = { runtime: {} };
});

let collected = [];

for (const query of QUERIES) {
  if (collected.length >= 10) break;
  const page = await ctx.newPage();
  const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&rs=typed`;
  console.log(`\nSearching: "${query}"`);
  console.log(`URL: ${url}`);

  try {
    const res = await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    console.log(`Status: ${res.status()}`);

    if (res.status() !== 200) {
      console.log('Skipping — non-200 response');
      await page.close();
      continue;
    }

    // Wait for images to load
    await page.waitForTimeout(4000);

    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(2000);

    const imgs = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.dataset.src || '';
        // Pinterest high-res images use 736x or 564x in the URL
        if (src.includes('pinimg.com') && (src.includes('/736x/') || src.includes('/564x/') || src.includes('/originals/'))) {
          // Upgrade to 736x if possible
          const hires = src.replace(/\/\d+x\//, '/736x/');
          if (!results.includes(hires)) results.push(hires);
        }
      });
      return results.slice(0, 6);
    });

    console.log(`Found ${imgs.length} high-res images`);
    for (const imgUrl of imgs) {
      if (collected.length >= 10) break;
      const idx = collected.length;
      const fname = `pin-${String(idx).padStart(2, '0')}.jpg`;
      const dest = join(DEST, fname);
      try {
        await downloadImage(imgUrl, dest);
        console.log(`  ✓ ${fname}  ${imgUrl.slice(0, 80)}`);
        collected.push({ file: fname, url: imgUrl });
      } catch (e) {
        console.log(`  ✗ ${imgUrl.slice(0, 60)} — ${e.message}`);
      }
    }
  } catch (e) {
    console.log(`Error on query "${query}": ${e.message.slice(0, 150)}`);
  }

  await page.close();
}

await browser.close();
console.log(`\nCollected ${collected.length} images in ${DEST}`);
if (collected.length === 0) {
  console.log('\nPinterest is blocked in this environment.');
  console.log('Falling back to generating painterly art with @napi-rs/canvas.');
  process.exit(1);
}
