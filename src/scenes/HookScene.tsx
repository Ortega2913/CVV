import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { COLORS, EASE, HEIGHT, WIDTH } from "../theme";
import { CameraRig } from "../three/CameraRig";
import { SkyDome } from "../three/SkyDome";
import { Ground } from "../three/Ground";
import { Lighting } from "../three/Lighting";
import { Cross } from "../three/Cross";
import { Dust } from "../three/Dust";
import { LightRays } from "../three/LightRays";
import { LensFlare } from "../effects/LensFlare";
import { CinematicText } from "../text/CinematicText";

/**
 * HOOK (0–5s)
 * Dark stormy sky, two wooden crosses silhouetted on a hill.
 * Slow dramatic push-in with subtle parallax + a hard side-light lens flare.
 * Bold impact text lands instantly.
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow push-in: dolly forward + a touch of parallax sway.
  const cameraPosition = (f: number): [number, number, number] => {
    const z = interpolate(f, [0, 150], [17, 12], { easing: EASE.cinematic });
    const x = interpolate(f, [0, 150], [-1.2, 0.4], { easing: EASE.cinematic });
    const y = interpolate(f, [0, 150], [3.4, 3.0], { easing: EASE.cinematic });
    return [x, y, z];
  };

  // Lens flare brightens as the side light "breaks" through, then settles.
  const flareIntensity = interpolate(
    frame,
    [0, 20, 90, 150],
    [0.2, 1, 0.8, 0.95],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deepShadow }}>
      <CameraMotionBlur shutterAngle={160} samples={6}>
        <ThreeCanvas
          width={WIDTH}
          height={HEIGHT}
          camera={{ fov: 52, near: 0.1, far: 200, position: [0, 3, 16] }}
          gl={{ antialias: true }}
          style={{ position: "absolute" }}
        >
          <fog attach="fog" args={[COLORS.nightBlue, 14, 46]} />
          <CameraRig position={cameraPosition} lookAt={() => [0, 3, 0]} />

          {/* Stormy night sky with a faint cold glow on the horizon */}
          <SkyDome
            top={COLORS.deepShadow}
            bottom={COLORS.stormBlue}
            horizon={0.28}
            glow={"#456"}
            glowStrength={0.6}
          />

          <Lighting
            keyPosition={[-9, 8, 5]}
            keyColor={COLORS.warmGold}
            keyIntensity={3.4}
            fillColor={COLORS.steel}
            fillIntensity={0.5}
            ambient={0.12}
          />
          <LightRays
            origin={[-7, 13, -3]}
            color={"#ffcf8a"}
            opacity={0.1}
            count={6}
            spread={0.4}
          />

          <Ground color={"#070806"} />

          {/* Two crosses on the hill, parallaxed at slightly different depths */}
          <Cross position={[-2.6, 0, -1.5]} rotation={[0, 0.25, 0.02]} scale={1.0} />
          <Cross position={[2.4, 0, -2.6]} rotation={[0, -0.3, -0.03]} scale={0.92} />

          {/* Foreground dust drifts fast for strong parallax */}
          <Dust
            count={260}
            color={"#ffe2b0"}
            size={0.05}
            area={[12, 8, 6]}
            center={[0, 4, 6]}
            opacity={0.45}
          />
        </ThreeCanvas>
      </CameraMotionBlur>

      {/* Hard side-light lens flare anchored to the key light direction */}
      <LensFlare x={24} y={26} intensity={flareIntensity} color={COLORS.sunrise} />

      {/* Cool-to-warm graded overlay for extra mood */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,18,40,0.35) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Bold impact hook line */}
      <CinematicText
        appearAt={2}
        fontSize={78}
        weight={900}
        top="50%"
        maxWidth={920}
        color={COLORS.paperWhite}
        glow="rgba(255,170,80,0.5)"
      >
        One man went to heaven…
        <br />
        <span style={{ color: COLORS.gold }}>without ever going to church.</span>
      </CinematicText>
    </AbsoluteFill>
  );
};
