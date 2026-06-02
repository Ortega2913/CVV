import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {FloatingCross} from './FloatingCross';
import {CameraRig} from './CameraRig';
import {WIDTH, HEIGHT} from '../../constants';

type ScenePreset =
  | 'title-reveal'        // Single large cross orbiting center
  | 'sign-intro'          // Cross fades in, number appears in front
  | 'divine-light'        // Multiple crosses in formation
  | 'worship-field'       // Field of small crosses rising
  | 'broken-chains';      // Cross with shattering effect

interface ThreeDSceneProps {
  preset?: ScenePreset;
  crossColor?: string;
  emissiveColor?: string;
  crossScale?: number;
  delay?: number;
  cameraMovement?: 'orbit' | 'dolly-in' | 'drift' | 'static';
}

// Particle cross field — many small crosses in 3D space
const CrossField: React.FC<{count?: number; spread?: number; color: string}> = ({
  count = 20,
  spread = 8,
  color,
}) => {
  const frame = useCurrentFrame();
  const crosses = React.useMemo(() =>
    Array.from({length: count}, (_, i) => ({
      x: ((i * 137.508) % spread) - spread / 2,
      y: ((i * 71) % spread) - spread / 2,
      z: ((i * 53) % (spread * 0.5)) - spread * 0.25,
      scale: 0.15 + (i % 5) * 0.06,
      speed: 0.1 + (i % 4) * 0.08,
      phase: (i * 37) % (Math.PI * 2),
    })),
    [count, spread]
  );

  return (
    <>
      {crosses.map((c, i) => (
        <FloatingCross
          key={i}
          scale={c.scale}
          color={color}
          emissiveColor={color}
          emissiveIntensity={0.3}
          verticalBob={0.1}
          orbitRadius={0}
          orbitSpeed={c.speed}
          roughness={0.5}
          metalness={0.3}
        />
      ))}
    </>
  );
};

export const ThreeDScene: React.FC<ThreeDSceneProps> = ({
  preset = 'title-reveal',
  crossColor = '#f59e0b',
  emissiveColor = '#f59e0b',
  crossScale = 1,
  delay = 0,
  cameraMovement = 'orbit',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  // Entrance opacity for the entire 3D scene
  const sceneOpacity = spring({
    fps,
    frame: localFrame,
    config: {damping: 200, stiffness: 60},
    from: 0,
    to: 1,
  });

  return (
    <AbsoluteFill style={{opacity: sceneOpacity}}>
      <ThreeCanvas width={WIDTH} height={HEIGHT} gl={{antialias: true, alpha: true}}>
        {/* Lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, 3, 3]} intensity={0.8} color={crossColor} />
        <pointLight position={[3, -3, 2]} intensity={0.5} color="#ffffff" />
        {/* Rim light for depth */}
        <spotLight
          position={[0, 8, -5]}
          intensity={0.6}
          color={emissiveColor}
          angle={0.5}
          penumbra={0.8}
        />

        {/* Camera rig */}
        <CameraRig
          movement={cameraMovement}
          orbitRadius={5}
          orbitSpeed={preset === 'title-reveal' ? 0.15 : 0.2}
          startPosition={[0, 0, 5]}
          endPosition={[0, 0, 2]}
          lookAt={[0, 0, 0]}
          fov={preset === 'title-reveal' ? 55 : 60}
        />

        {/* Scene content based on preset */}
        {preset === 'title-reveal' && (
          <>
            <FloatingCross
              scale={crossScale * 1.8}
              color={crossColor}
              emissiveColor={emissiveColor}
              emissiveIntensity={0.6}
              orbitRadius={0}
              orbitSpeed={0.3}
              verticalBob={0.2}
              roughness={0.2}
              metalness={0.8}
            />
            {/* Smaller orbiting crosses */}
            <FloatingCross
              scale={crossScale * 0.5}
              color={crossColor}
              emissiveColor={emissiveColor}
              emissiveIntensity={0.4}
              orbitRadius={2.5}
              orbitSpeed={0.5}
              verticalBob={0.3}
            />
            <FloatingCross
              scale={crossScale * 0.35}
              color={crossColor}
              emissiveColor={emissiveColor}
              emissiveIntensity={0.3}
              orbitRadius={3.5}
              orbitSpeed={-0.3}
              verticalBob={0.15}
            />
          </>
        )}

        {preset === 'sign-intro' && (
          <FloatingCross
            scale={crossScale * 1.2}
            color={crossColor}
            emissiveColor={emissiveColor}
            emissiveIntensity={0.5}
            orbitRadius={0}
            orbitSpeed={0.25}
            verticalBob={0.18}
            roughness={0.25}
            metalness={0.75}
          />
        )}

        {preset === 'divine-light' && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <FloatingCross
                key={i}
                scale={crossScale * (0.5 + i * 0.2)}
                color={crossColor}
                emissiveColor={emissiveColor}
                emissiveIntensity={0.4 + i * 0.05}
                orbitRadius={i * 0.8}
                orbitSpeed={0.2 + i * 0.05}
                verticalBob={0.1 + i * 0.03}
              />
            ))}
          </>
        )}

        {preset === 'worship-field' && (
          <CrossField count={18} spread={10} color={crossColor} />
        )}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
