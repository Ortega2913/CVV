import React, {useMemo, useRef} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {VIDEO_WIDTH, VIDEO_HEIGHT} from '../constants';

// ─── Camera ────────────────────────────────────────────────────────────────
const CameraRig: React.FC<{
  frame: number;
  orbitProgress: number;
  pushIn: number;
}> = ({frame, orbitProgress, pushIn}) => {
  const {camera} = useThree();

  const angle = interpolate(orbitProgress, [0, 1], [0.3, Math.PI * 0.55]);
  const radius = interpolate(pushIn, [0, 1], [14, 10]);
  const height = interpolate(frame, [0, 300], [3.5, 5.2]);

  camera.position.set(
    Math.sin(angle) * radius,
    height,
    Math.cos(angle) * radius
  );
  (camera as THREE.PerspectiveCamera).fov = interpolate(pushIn, [0, 1], [45, 38]);
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(0, 1.5, 0);

  return null;
};

// ─── Stars ──────────────────────────────────────────────────────────────────
const StarField: React.FC = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const sizes: number[] = [];
    for (let i = 0; i < 800; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1) * 0.45; // upper hemisphere only
      const r = 80 + Math.random() * 40;
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        Math.abs(r * Math.cos(phi)) + 10,
        r * Math.sin(phi) * Math.sin(theta)
      );
      sizes.push(0.8 + Math.random() * 2.5);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xfff5e0,
        size: 0.35,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  return <points geometry={geometry} material={material} />;
};

// ─── Olive Tree ─────────────────────────────────────────────────────────────
const OliveTree: React.FC<{
  x: number;
  z: number;
  scale?: number;
  rotY?: number;
}> = ({x, z, scale = 1, rotY = 0}) => {
  const trunkH = 2.5 * scale;
  const trunkR = 0.12 * scale;

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Trunk */}
      <mesh position={[0, trunkH / 2, 0]}>
        <cylinderGeometry args={[trunkR * 0.7, trunkR, trunkH, 7]} />
        <meshStandardMaterial color={0x2c1a0a} roughness={0.95} />
      </mesh>
      {/* Twisted branch 1 */}
      <mesh position={[0.18 * scale, trunkH * 0.75, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[trunkR * 0.3, trunkR * 0.5, trunkH * 0.5, 5]} />
        <meshStandardMaterial color={0x2c1a0a} roughness={0.95} />
      </mesh>
      {/* Foliage clusters */}
      {[
        [0, trunkH + 1.2 * scale, 0, 1.8 * scale],
        [0.6 * scale, trunkH + 0.6 * scale, 0.3 * scale, 1.2 * scale],
        [-0.5 * scale, trunkH + 0.8 * scale, -0.2 * scale, 1.1 * scale],
        [0.2 * scale, trunkH + 1.7 * scale, -0.3 * scale, 0.9 * scale],
      ].map(([fx, fy, fz, fr], i) => (
        <mesh key={i} position={[fx as number, fy as number, fz as number]}>
          <sphereGeometry args={[fr as number, 7, 5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? 0x1a2e0a : 0x142208}
            roughness={0.9}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
    </group>
  );
};

// ─── Torch ──────────────────────────────────────────────────────────────────
const Torch: React.FC<{position: [number, number, number]; frame: number}> = ({
  position,
  frame,
}) => {
  const flicker = 0.85 + 0.15 * Math.sin(frame * 0.4 + position[0] * 3);
  const flickerFast = 0.95 + 0.05 * Math.sin(frame * 1.2 + position[2] * 5);
  const intensity = 3.5 * flicker * flickerFast;

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.6, 5]} />
        <meshStandardMaterial color={0x2c1a0a} roughness={0.9} />
      </mesh>
      {/* Flame geometry */}
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.07, 0.22, 5]} />
        <meshStandardMaterial color={0xff9d3b} emissive={0xff6a00} emissiveIntensity={2} />
      </mesh>
      {/* Point light */}
      <pointLight
        color={0xff8c32}
        intensity={intensity}
        distance={12}
        decay={2}
        castShadow={false}
      />
    </group>
  );
};

// ─── Figure ──────────────────────────────────────────────────────────────────
const HumanFigure: React.FC<{
  position: [number, number, number];
  scale?: number;
  robeColor?: number;
  isKneeling?: boolean;
}> = ({position, scale = 1, robeColor = 0x2a1e10, isKneeling = false}) => {
  const bodyH = isKneeling ? 0.9 : 1.7;
  const y = isKneeling ? 0.45 : bodyH / 2;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Body/robe */}
      <mesh position={[0, y, 0]}>
        <cylinderGeometry args={[0.18, 0.26, bodyH, 7]} />
        <meshStandardMaterial color={robeColor} roughness={0.85} />
      </mesh>
      {/* Head */}
      <mesh position={[0, isKneeling ? 1.25 : bodyH + 0.2, 0]}>
        <sphereGeometry args={[0.155, 10, 8]} />
        <meshStandardMaterial color={0x8b6914} roughness={0.6} />
      </mesh>
      {/* Head covering */}
      <mesh position={[0, isKneeling ? 1.3 : bodyH + 0.28, 0]}>
        <coneGeometry args={[0.18, 0.22, 8]} />
        <meshStandardMaterial color={robeColor} roughness={0.9} />
      </mesh>
    </group>
  );
};

// ─── Ground ──────────────────────────────────────────────────────────────────
const Garden: React.FC = () => {
  return (
    <>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 32, 32]} />
        <meshStandardMaterial color={0x0e1a08} roughness={0.95} metalness={0} />
      </mesh>
      {/* Path stones - slight light colored area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[3, 30]} />
        <meshStandardMaterial color={0x1a1608} roughness={0.98} />
      </mesh>
    </>
  );
};

// ─── Sky ─────────────────────────────────────────────────────────────────────
const NightSky: React.FC = () => {
  return (
    <mesh>
      <sphereGeometry args={[120, 32, 16]} />
      <meshBasicMaterial color={0x070512} side={THREE.BackSide} />
    </mesh>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────
interface GardenNightSceneProps {
  cameraMode?: 'orbit' | 'track' | 'static';
  showFigures?: boolean;
  torchCount?: number;
}

const GardenNightSceneInner: React.FC<GardenNightSceneProps> = ({
  cameraMode = 'orbit',
  showFigures = true,
  torchCount = 3,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const orbitProgress = spring({
    frame,
    fps,
    config: {damping: 300, stiffness: 18, mass: 3},
  });

  const pushIn = spring({
    frame: frame - 30,
    fps,
    config: {damping: 200, stiffness: 12, mass: 2},
  });

  const trees: Array<[number, number, number, number]> = [
    [-5, -6, 1.1, 0.3],
    [4, -8, 0.9, 1.2],
    [-8, -3, 1.3, 2.1],
    [7, -4, 1.0, 0.8],
    [-3, 10, 1.2, 3.4],
    [9, 5, 0.85, 1.9],
    [-11, 7, 1.4, 0.5],
    [2, -14, 1.0, 2.7],
    [-6, 14, 1.1, 1.3],
    [13, -9, 0.9, 0.6],
  ];

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT}>
      <CameraRig frame={frame} orbitProgress={orbitProgress} pushIn={pushIn} />

      {/* Ambient base */}
      <ambientLight intensity={0.04} color={0x1a1040} />

      {/* Distant moon light (very subtle) */}
      <directionalLight
        color={0x8090cc}
        intensity={0.18}
        position={[-30, 40, -20]}
      />

      <NightSky />
      <StarField />
      <Garden />

      {/* Olive trees */}
      {trees.map(([x, z, scale, rotY], i) => (
        <OliveTree key={i} x={x} z={z} scale={scale} rotY={rotY} />
      ))}

      {/* Torches */}
      {torchCount >= 1 && <Torch position={[-2.5, 1.6, -1.5]} frame={frame} />}
      {torchCount >= 2 && <Torch position={[2.8, 1.6, -0.5]} frame={frame} />}
      {torchCount >= 3 && <Torch position={[-0.5, 1.6, 3]} frame={frame} />}

      {/* Jesus figure */}
      {showFigures && (
        <>
          <HumanFigure
            position={[0, 0, -2]}
            scale={1}
            robeColor={0x3a2c1a}
          />
          {/* Disciples in background */}
          <HumanFigure position={[-2.5, 0, 1.5]} scale={0.95} robeColor={0x1e180e} />
          <HumanFigure position={[2, 0, 2]} scale={0.9} robeColor={0x251d12} />
          <HumanFigure position={[-1, 0, 3.5]} scale={0.88} robeColor={0x1a1408} />
        </>
      )}

      {/* Atmospheric haze */}
      <fog attach="fog" args={[0x070512, 20, 80]} />
    </ThreeCanvas>
  );
};

const GardenNightScene: React.FC<GardenNightSceneProps> = (props) => (
  <div style={{position: 'absolute', inset: 0}}>
    <GardenNightSceneInner {...props} />
  </div>
);

export default GardenNightScene;
