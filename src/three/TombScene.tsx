import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {VIDEO_WIDTH, VIDEO_HEIGHT} from '../constants';

const CameraRig: React.FC<{frame: number}> = ({frame}) => {
  const {camera} = useThree();
  const {fps} = useVideoConfig();

  const progress = spring({frame, fps, config: {damping: 300, stiffness: 14, mass: 3}});

  // Pull back from tomb entrance to reveal the scene
  const z = interpolate(progress, [0, 1], [4, 16]);
  const y = interpolate(progress, [0, 1], [1.5, 4]);

  camera.position.set(0, y, z);
  (camera as THREE.PerspectiveCamera).fov = 45;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(0, 1.5, 0);

  return null;
};

const TombEntrance: React.FC = () => {
  return (
    <group position={[0, 0, -2]}>
      {/* Rock arch — left side */}
      <mesh position={[-2, 2, 0]}>
        <boxGeometry args={[0.8, 4, 1.2]} />
        <meshStandardMaterial color={0x2e2820} roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Rock arch — right side */}
      <mesh position={[2, 2, 0]}>
        <boxGeometry args={[0.8, 4, 1.2]} />
        <meshStandardMaterial color={0x2e2820} roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Top arch */}
      <mesh position={[0, 4.2, 0]}>
        <boxGeometry args={[4.8, 1.2, 1.2]} />
        <meshStandardMaterial color={0x2a2418} roughness={0.95} />
      </mesh>
      {/* Arch curve pieces */}
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <mesh
          key={i}
          position={[x, 3.8 + 0.15 * Math.cos((i / 3) * Math.PI), 0]}
          rotation={[0, 0, (i - 1.5) * 0.2]}
        >
          <boxGeometry args={[0.5, 0.8, 1.1]} />
          <meshStandardMaterial color={0x2a2418} roughness={0.95} />
        </mesh>
      ))}

      {/* Rolled stone to the side */}
      <mesh position={[-3.5, 0.9, 0.8]}>
        <cylinderGeometry args={[0.9, 0.9, 0.55, 16]} />
        <meshStandardMaterial color={0x3a3025} roughness={0.88} metalness={0.06} />
      </mesh>

      {/* Dark interior */}
      <mesh position={[0, 2, -1]}>
        <boxGeometry args={[3.2, 3.8, 2]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>
    </group>
  );
};

const LightBurst: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const burstProgress = spring({
    frame: frame - 20,
    fps,
    config: {damping: 200, stiffness: 40, mass: 1.5},
  });

  const rays = useMemo(
    () =>
      Array.from({length: 24}, (_, i) => ({
        angle: (i / 24) * Math.PI * 2,
        length: 6 + (i % 5) * 1.5,
        width: 0.15 + (i % 3) * 0.12,
      })),
    []
  );

  const opacity = interpolate(burstProgress, [0, 1], [0, 1]);

  return (
    <group position={[0, 2, -2]}>
      {/* Core glow */}
      <pointLight
        color={0xfff5d0}
        intensity={interpolate(burstProgress, [0, 1], [0, 18])}
        distance={20}
        decay={2}
      />
      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[0.6, 12, 8]} />
        <meshBasicMaterial color={0xfffff0} transparent opacity={opacity * 0.9} />
      </mesh>
      {/* Light rays */}
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(ray.angle) * ray.length * 0.5,
            Math.sin(ray.angle) * ray.length * 0.4,
            0,
          ]}
          rotation={[0, 0, ray.angle + Math.PI / 2]}
        >
          <planeGeometry args={[ray.width, ray.length]} />
          <meshBasicMaterial
            color={0xfffae0}
            transparent
            opacity={opacity * 0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Floating light particles */}
      {Array.from({length: 30}).map((_, i) => {
        const t = (frame * 0.01 + i * 0.21) % 1;
        const particleAngle = i * (Math.PI * 2 / 30);
        const r = 1.5 + t * 4;
        return (
          <mesh
            key={`p${i}`}
            position={[
              Math.cos(particleAngle) * r,
              Math.sin(particleAngle) * r * 0.6 + t * 3,
              (Math.random() - 0.5) * 2,
            ]}
          >
            <sphereGeometry args={[0.03 + t * 0.02, 4, 3]} />
            <meshBasicMaterial
              color={0xfffad0}
              transparent
              opacity={opacity * (1 - t) * 0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const TombSceneInner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT}>
      <CameraRig frame={frame} />

      <ambientLight intensity={0.04} color={0x080510} />
      {/* Dawn light from outside */}
      <directionalLight color={0xffa050} intensity={0.25} position={[5, 10, 20]} />

      {/* Sky */}
      <mesh>
        <sphereGeometry args={[80, 16, 8]} />
        <meshBasicMaterial color={0x0a0818} side={THREE.BackSide} />
      </mesh>

      {/* Horizon glow */}
      <mesh position={[0, 3, -50]}>
        <planeGeometry args={[150, 20]} />
        <meshBasicMaterial color={new THREE.Color(0.6, 0.3, 0.05)} transparent opacity={0.3} />
      </mesh>

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={0x1a1610} roughness={0.97} />
      </mesh>

      <TombEntrance />
      <LightBurst frame={frame} />
    </ThreeCanvas>
  );
};

const TombScene: React.FC = () => (
  <div style={{position: 'absolute', inset: 0}}>
    <TombSceneInner />
  </div>
);

export default TombScene;
