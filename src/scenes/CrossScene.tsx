import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { MotionBlur } from "../effects/MotionBlur";
import { COLORS, EASE, HEIGHT, WIDTH } from "../theme";
import { CameraRig } from "../three/CameraRig";
import { SkyDome } from "../three/SkyDome";
import { Ground } from "../three/Ground";
import { Lighting } from "../three/Lighting";
import { Cross, FigureOnCross } from "../three/Cross";
import { Dust } from "../three/Dust";
import { LightRays } from "../three/LightRays";
import { CinematicText } from "../text/CinematicText";

// Cross world positions.
const JESUS: [number, number, number] = [0, 0, 0];
const LEFT_THIEF: [number, number, number] = [-4.6, 0, -1.4];
const RIGHT_THIEF: [number, number, number] = [4.6, 0, -1.4];

/**
 * MAIN MESSAGE (5–22s)
 * Three crosses revealed in a 3D scene. Left thief mocks, right thief turns
 * toward Jesus, Jesus at centre. A slow orbit, a push-in on the repentant
 * thief, then a soft focus to Jesus as He speaks. Light rays break through.
 */
export const CrossScene: React.FC = () => {
  const frame = useCurrentFrame();

  /**
   * Camera choreography (scene-local frames, 0..510):
   *  0–150   establishing slow orbit, wide
   *  150–280 push-in toward the repentant (right) thief
   *  280–400 ease across + soft focus to Jesus as He speaks
   *  400–510 gentle pull-back, orbit continues
   */
  const orbitAngle = (f: number) =>
    interpolate(f, [0, 510], [-0.55, 0.45], { easing: EASE.cinematic });

  const radius = (f: number) =>
    interpolate(
      f,
      [0, 150, 280, 400, 510],
      [15, 13.5, 9.5, 10.5, 13],
      { easing: EASE.cinematic }
    );

  const cameraPosition = (f: number): [number, number, number] => {
    const a = orbitAngle(f);
    const r = radius(f);
    const y = interpolate(f, [0, 280, 400, 510], [3.6, 3.4, 3.5, 3.8], {
      easing: EASE.cinematic,
    });
    return [Math.sin(a) * r, y, Math.cos(a) * r];
  };

  // Look target glides from centre -> right thief -> Jesus -> centre.
  const lookTarget = (f: number): [number, number, number] => {
    const x = interpolate(
      f,
      [0, 150, 280, 360, 510],
      [0, 1.5, RIGHT_THIEF[0] * 0.6, 0, 0],
      { easing: EASE.cinematic }
    );
    const y = interpolate(f, [0, 280, 360, 510], [3.0, 3.5, 3.5, 3.2], {
      easing: EASE.cinematic,
    });
    return [x, y, -0.8];
  };

  // Jesus' holy glow swells when He speaks (~frame 330+).
  const holyGlow = interpolate(frame, [320, 380, 510], [0.0, 1.0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Light rays intensify as Jesus speaks.
  const rayOpacity = interpolate(frame, [0, 300, 380], [0.08, 0.1, 0.22], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deepShadow }}>
      <MotionBlur shutterAngle={150}>
        <ThreeCanvas
          width={WIDTH}
          height={HEIGHT}
          camera={{ fov: 50, near: 0.1, far: 200, position: [-8, 3.6, 13] }}
          gl={{ antialias: true }}
          style={{ position: "absolute" }}
        >
          <fog attach="fog" args={[COLORS.nightBlue, 16, 50]} />
          <CameraRig position={cameraPosition} lookAt={lookTarget} />

          <SkyDome
            top={COLORS.deepShadow}
            bottom={COLORS.stormBlue}
            horizon={0.3}
            glow={"#6a5a8a"}
            glowStrength={0.7}
          />

          <Lighting
            keyPosition={[-8, 10, 4]}
            keyColor={COLORS.warmGold}
            keyIntensity={3.0}
            fillColor={COLORS.steel}
            fillIntensity={0.55}
            ambient={0.16}
          />

          {/* Holy light on Jesus — a soft base glow that swells as He speaks */}
          <pointLight
            position={[0, 4.2, 1.6]}
            color={"#fff0cf"}
            intensity={1.2 + holyGlow * 7}
            distance={16}
            decay={2}
          />
          {/* Warm backlight halo behind the centre cross */}
          <pointLight
            position={[0, 4.5, -2.5]}
            color={"#ffd98a"}
            intensity={1 + holyGlow * 4}
            distance={14}
            decay={2}
          />

          <LightRays
            origin={[0, 14, -5]}
            color={"#ffe6b0"}
            opacity={rayOpacity}
            count={8}
            spread={0.5}
          />

          <Ground color={"#080705"} />

          {/* --- Jesus (centre) --- */}
          <Cross position={JESUS} scale={1.08} color={"#241812"} />
          <FigureOnCross
            position={JESUS}
            lean={0}
            color={"#6a4a32"}
            emissive={"#ffdf9a"}
            emissiveIntensity={0.25 + holyGlow * 1.0}
          />

          {/* --- Left thief: angry, leaning AWAY from Jesus --- */}
          <Cross position={LEFT_THIEF} rotation={[0, 0.35, 0]} scale={0.96} />
          <FigureOnCross
            position={LEFT_THIEF}
            lean={0.16}
            color={"#241a13"}
          />

          {/* --- Right thief: repentant, turning TOWARD Jesus --- */}
          <Cross position={RIGHT_THIEF} rotation={[0, -0.35, 0]} scale={0.96} />
          <FigureOnCross
            position={RIGHT_THIEF}
            lean={-0.2}
            color={"#2a2018"}
            emissive={"#ffcaa0"}
            emissiveIntensity={interpolate(
              frame,
              [170, 260, 320],
              [0, 0.25, 0.12],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )}
          />

          {/* Atmospheric dust between the camera and the crosses */}
          <Dust
            count={340}
            color={"#ffe0b0"}
            size={0.045}
            area={[16, 9, 9]}
            center={[0, 4, 3]}
            opacity={0.4}
          />
        </ThreeCanvas>
      </MotionBlur>

      {/* Cinematic grade overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,14,34,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* --- Voiceover-synced text beats --- */}
      <CinematicText
        appearAt={20}
        disappearAt={140}
        fontSize={66}
        weight={800}
        top="78%"
        maxWidth={900}
        color={COLORS.paperWhite}
        glow="rgba(255,180,90,0.4)"
      >
        No good works. No baptism.
      </CinematicText>

      <CinematicText
        appearAt={180}
        disappearAt={300}
        fontSize={72}
        weight={800}
        italic
        top="76%"
        maxWidth={880}
        color={COLORS.sunrise}
        glow="rgba(255,150,80,0.5)"
      >
        “Jesus, remember me.”
      </CinematicText>

      <CinematicText
        appearAt={335}
        disappearAt={500}
        fontSize={70}
        weight={800}
        italic
        top="22%"
        maxWidth={900}
        color={COLORS.paperWhite}
        glow="rgba(255,215,140,0.7)"
      >
        “Today you will be with me
        <br />
        in Paradise.”
      </CinematicText>
    </AbsoluteFill>
  );
};
