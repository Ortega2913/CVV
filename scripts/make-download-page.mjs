/**
 * Embeds BibleLandsProphecy.mp4 as a base64 data-URI inside a standalone
 * HTML file. Open the HTML in any browser → click the gold button to save.
 */
import { readFileSync, writeFileSync } from "fs";

const videoPath = "out/BibleLandsProphecy.mp4";
const outPath   = "out/download.html";

console.log("Reading video…");
const videoBuffer = readFileSync(videoPath);
const base64      = videoBuffer.toString("base64");
const dataUri     = `data:video/mp4;base64,${base64}`;
console.log(`Video size: ${(videoBuffer.length / 1024 / 1024).toFixed(1)} MB`);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bible Lands Today — Download</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0a1628;color:#f5f0e8;font-family:Arial,sans-serif;
       display:flex;flex-direction:column;align-items:center;
       justify-content:center;min-height:100vh;padding:40px 20px;gap:28px}
  h1{font-size:clamp(20px,4vw,36px);color:#d4af37;text-align:center;
     text-shadow:0 0 30px rgba(212,175,55,.5)}
  p{color:#aaa;font-size:15px;text-align:center}
  video{max-width:min(860px,100%);border-radius:8px;
        box-shadow:0 0 60px rgba(212,175,55,.2)}
  .btn{display:inline-block;padding:18px 48px;background:#d4af37;color:#0a1628;
       font-size:20px;font-weight:700;border-radius:6px;text-decoration:none;
       letter-spacing:.04em;cursor:pointer;
       box-shadow:0 0 24px rgba(212,175,55,.4);transition:opacity .2s}
  .btn:hover{opacity:.85}
  .meta{font-size:13px;color:#666;text-align:center}
</style>
</head>
<body>
  <h1>Bible Lands Today: Clues to Prophecy</h1>
  <p>Your Remotion documentary is ready.</p>
  <video controls preload="metadata">
    <source src="${dataUri}" type="video/mp4">
  </video>
  <a class="btn" href="${dataUri}" download="BibleLandsProphecy.mp4">
    ⬇&nbsp; Download MP4
  </a>
  <p class="meta">1920 × 1080 · H.264 · 30 fps · 5 min 6 sec</p>
</body>
</html>`;

writeFileSync(outPath, html, "utf8");
const htmlMB = (html.length / 1024 / 1024).toFixed(1);
console.log(`Written: ${outPath}  (${htmlMB} MB)`);
console.log("Open this file in your browser and click the gold button.");
