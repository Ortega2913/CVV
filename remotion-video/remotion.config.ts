import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
// The sandbox routes HTTPS through a TLS-intercepting proxy whose CA Chromium
// does not trust; allow it so Google Fonts (gstatic) can load during render.
Config.setChromiumIgnoreCertificateErrors(true);
