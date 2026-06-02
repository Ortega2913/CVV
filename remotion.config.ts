import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Allow self-signed / untrusted certs in the sandbox environment
Config.setChromiumIgnoreCertificateErrors(true);
Config.setChromiumDisableWebSecurity(true);
Config.setChromiumOpenGlRenderer("angle");
