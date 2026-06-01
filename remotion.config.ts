import { Config } from "@remotion/cli/config";

/**
 * Remotion render configuration.
 * The video is vertical (1080x1920) for Reels / Shorts / TikTok.
 */
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // auto
Config.setChromiumOpenGlRenderer("angle"); // best for three.js / WebGL renders

// High quality output
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
