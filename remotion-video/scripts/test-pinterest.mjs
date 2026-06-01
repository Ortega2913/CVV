import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--ignore-certificate-errors'],
});
const page = await browser.newPage({ ignoreHTTPSErrors: true });

try {
  const res = await page.goto(
    'https://www.pinterest.com/search/pins/?q=crucifixion+jesus+art',
    { timeout: 25000, waitUntil: 'domcontentloaded' }
  );
  console.log('HTTP status:', res.status());
  console.log('Title:', await page.title());
  await page.waitForTimeout(3000);
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll('img')].map(i => i.src).filter(s => s.includes('pinimg')).slice(0, 8)
  );
  console.log('Pinimg URLs found:', imgs.length);
  imgs.forEach(u => console.log(' ', u.slice(0, 100)));
} catch (e) {
  console.log('Error:', e.message.slice(0, 300));
}

await browser.close();
