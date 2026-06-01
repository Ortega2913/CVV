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
 * CLOSING + CTA (22–30s)
 * Bright, hopeful sunrise. Empty crosses. The camera cranes up and pulls back,
 * majestic, with golden god-rays. Elegant message + pulsing CTA + the verse.
 */
export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Majestic crane-up: rise in Y and ease back while tilting to keep crosses low.
  const cameraPosition = (f: number): [number, number, number] => {
    const y = interpolate(f, [0, 240], [3.2, 9.5], { easing: EASE.majestic });
    const z = interpolate(f, [0, 240], [11, 17], { easing: EASE.majestic });
    const x = interpolate(f, [0, 240], [0.5, 0], { easing: EASE.majestic });
    return [x, y, z];
  };
  const lookTarget = (f: number): [number, number, number] => {
    const y = interpolate(f, [0, 240], [3.4, 2.2], { easing: EASE.majestic });
    return [0, y, -1];
  };

  // The sunrise warms and brightens across the shot.
  const sunGlow = interpolate(frame, [0, 200], [0.7, 1.5], {
    extrapolateRight: "clamp",
  });
  const flare = interpolate(frame, [0, 60, 240], [0.3, 1, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.nightBlue }}>
      <CameraMotionBlur shutterAngle={170} samples={6}>
        <ThreeCanvas
          width={WIDTH}
          height={HEIGHT}
          camera={{ fov: 54, near: 0.1, far: 200, position: [0, 3.2, 11] }}
          gl={{ antialias: true }}
          style={{ position: "absolute" }}
        >
          <fog attach="fog" args={["#caa46a", 22, 60]} />
          <CameraRig position={cameraPosition} lookAt={lookTarget} />

          {/* Warm hopeful sunrise sky with a bright horizon band */}
          <SkyDome
            top={"#3a5a8c"}
            bottom={COLORS.sunrise}
            horizon={0.42}
            glow={COLORS.warmGold}
            glowStrength={sunGlow}
          />

          <Lighting
            keyPosition={[0, 7, -10]}
            keyColor={"#ffdfa6"}
            keyIntensity={3.6}
            fillColor={"#9fc0ff"}
            fillIntensity={0.7}
            ambient={0.4}
          />
          <LightRays
            origin={[0, 13, -8]}
            color={"#fff0c8"}
            opacity={0.26}
            count={10}
            spread={0.6}
          />

          <Ground color={"#1a140c"} />

          {/* The three crosses — now empty, backlit by the rising sun */}
          <Cross position={[0, 0, 0]} scale={1.08} color={"#241812"} />
          <Cross position={[-4.6, 0, -1.4]} rotation={[0, 0.35, 0]} scale={0.96} />
          <Cross position={[4.6, 0, -1.4]} rotation={[0, -0.35, 0]} scale={0.96} />

          {/* Golden dust rising in the light */}
          <Dust
            count={300}
            color={"#fff0c8"}
            size={0.05}
            area={[16, 10, 8]}
            center={[0, 5, 3]}
            opacity={0.55}
          />
        </ThreeCanvas>
      </CameraMotionBlur>

      {/* Sun flare blooming from behind the centre cross */}
      <LensFlare x={50} y={62} intensity={flare} color={"#fff1d0"} />

      {/* Warm hopeful grade */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,210,150,0.18) 0%, rgba(0,0,0,0) 50%, rgba(120,70,20,0.3) 100%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Message */}
      <CinematicText
        appearAt={10}
        disappearAt={120}
        fontSize={74}
        weight={800}
        top="30%"
        maxWidth={880}
        color={"#1a1208"}
        glow="rgba(255,240,200,0.9)"
      >
        Salvation is a gift,
        <br />
        not a reward.
      </CinematicText>

      {/* Pulsing CTA */}
      <CinematicText
        appearAt={130}
        fontSize={52}
        weight={700}
        top="50%"
        maxWidth={840}
        color={COLORS.paperWhite}
        glow="rgba(255,170,80,0.7)"
        pulse
      >
        Tag someone who needs this grace
      </CinematicText>

      {/* The verse, fading in beautifully */}
      <CinematicText
        appearAt={150}
        fontSize={42}
        weight={600}
        italic
        top="63%"
        maxWidth={820}
        color={COLORS.sunrise}
        glow="rgba(255,150,80,0.5)"
        letterSpacing={0}
      >
        “Today you will be with me in Paradise.”
        <br />
        <span style={{ fontSize: 32, opacity: 0.9 }}>— Luke 23:43</span>
      </CinematicText>
    </AbsoluteFill>
  );
};
