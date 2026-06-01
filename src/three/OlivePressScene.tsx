import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {VIDEO_WIDTH, VIDEO_HEIGHT} from '../constants';

const CameraRig: React.FC<{frame: number}> = ({frame}) => {
  const {camera} = useThree();

  const angle = interpolate(frame, [0, 360], [0, Math.PI * 0.7]);
  const radius = interpolate(frame, [0, 200], [9, 7]);
  const height = interpolate(frame, [0, 360], [4, 2.5]);

  camera.position.set(
    Math.sin(angle) * radius,
    height,
    Math.cos(angle) * radius
  );
  (camera as THREE.PerspectiveCamera).fov = 40;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(0, 1, 0);

  return null;
};

// Ancient olive press millstone
const OlivePressStone: React.FC<{frame: number}> = ({frame}) => {
  const rotation = interpolate(frame, [0, 360], [0, Math.PI * 2]);

  return (
    <group position={[0, 0.5, 0]}>
      {/* Basin */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.22, 10, 30]} />
        <meshStandardMaterial color={0x3a3025} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Basin floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.08, 20]} />
        <meshStandardMaterial color={0x2e2820} roughness={0.95} />
      </mesh>

      {/* Millstone rolling */}
      <group rotation={[0, rotation, 0]}>
        <mesh position={[1.1, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
          <meshStandardMaterial color={0x4a4035} roughness={0.85} metalness={0.1} />
        </mesh>
        {/* Arm */}
        <mesh position={[0.55, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.1, 6]} />
          <meshStandardMaterial color={0x3a2c1a} roughness={0.9} />
        </mesh>
      </group>

      {/* Oil dripping channel */}
      <mesh position={[1.8, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <meshStandardMaterial
          color={0xc8a030}
          roughness={0.3}
          metalness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

// Falling oil drops
const OilDrops: React.FC<{frame: number}> = ({frame}) => {
  const drops = useMemo(() => {
    return Array.from({length: 12}, (_, i) => ({
      id: i,
      startFrame: i * 8,
      xOffset: 1.8 + (Math.random() - 0.5) * 0.1,
      zOffset: (Math.random() - 0.5) * 0.15,
    }));
  }, []);

  return (
    <>
      {drops.map((drop) => {
        const dropFrame = (frame - drop.startFrame) % 96;
        if (dropFrame < 0) return null;
        const y = interpolate(dropFrame, [0, 60], [0, -1.5], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = interpolate(dropFrame, [0, 10, 50, 60], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <mesh
            key={drop.id}
            position={[drop.xOffset, 0.4 + y, drop.zOffset]}
          >
            <sphereGeometry args={[0.025, 6, 4]} />
            <meshStandardMaterial
              color={0xd4a017}
              roughness={0.1}
              metalness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </>
  );
};

const OlivePressSceneInner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT}>
      <CameraRig frame={frame} />

      <ambientLight intensity={0.08} color={0x1a1005} />
      {/* Torch above press */}
      <pointLight color={0xff8c32} intensity={5} distance={14} decay={2} position={[0, 4, 2]} />
      {/* Warm side fill */}
      <pointLight color={0xff6820} intensity={2} distance={10} decay={2} position={[-4, 2, -2]} />
      {/* Cool rim from outside */}
      <directionalLight color={0x4060a0} intensity={0.1} position={[-8, 8, -8]} />

      {/* Sky/interior */}
      <mesh>
        <sphereGeometry args={[60, 16, 8]} />
        <meshBasicMaterial color={0x040208} side={THREE.BackSide} />
      </mesh>

      {/* Stone floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={0x1a1610} roughness={0.98} />
      </mesh>

      {/* Stone walls hinted */}
      <mesh position={[0, 2, -8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color={0x1e1812} roughness={0.95} />
      </mesh>

      <OlivePressStone frame={frame} />
      <OilDrops frame={frame} />

      <fog attach="fog" args={[0x040208, 10, 35]} />
    </ThreeCanvas>
  );
};

const OlivePressScene: React.FC = () => (
  <div style={{position: 'absolute', inset: 0}}>
    <OlivePressSceneInner />
  </div>
);

export default OlivePressScene;
