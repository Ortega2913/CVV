import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Export as H.264 for YouTube compatibility
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
// High CRF = smaller file, lower = better quality (18-28 range for YouTube)
Config.setCrf(18);
