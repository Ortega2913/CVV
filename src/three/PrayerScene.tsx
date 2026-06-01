import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {VIDEO_WIDTH, VIDEO_HEIGHT} from '../constants';

const CameraRig: React.FC<{frame: number; phase: number}> = ({frame, phase}) => {
  const {camera} = useThree();

  // Long slow push in from wide to intimate close-up
  const radius = interpolate(phase, [0, 1], [13, 5]);
  const height = interpolate(phase, [0, 1], [4.5, 1.8]);
  const angle = interpolate(frame, [0, 300], [0.8, 0.2]);

  camera.position.set(
    Math.sin(angle) * radius,
    height,
    Math.cos(angle) * radius
  );
  (camera as THREE.PerspectiveCamera).fov = interpolate(phase, [0, 1], [42, 30]);
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(0, 0.8, 0);

  return null;
};

const AtmosphericDust: React.FC<{frame: number}> = ({frame}) => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < 200; i++) {
      positions.push(
        (Math.random() - 0.5) * 18,
        0.2 + Math.random() * 4,
        (Math.random() - 0.5) * 18
      );
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xffdfa0,
        size: 0.04,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true,
      }),
    []
  );

  // Drift upward slowly
  const drift = (frame * 0.003) % 4;

  return (
    <points
      geometry={geometry}
      material={material}
      position={[0, drift, 0]}
    />
  );
};

const KneelingFigure: React.FC<{frame: number}> = ({frame}) => {
  // Slight breathing/trembling animation
  const breathe = 0.02 * Math.sin(frame * 0.08);

  return (
    <group position={[0, 0, 0]} rotation={[0, 0.3, 0]}>
      {/* Lower body / legs on ground */}
      <mesh position={[0, 0.22, 0]} rotation={[breathe, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 0.44, 8]} />
        <meshStandardMaterial color={0x3a2c1a} roughness={0.85} />
      </mesh>
      {/* Torso bent forward */}
      <mesh position={[0.15, 0.7, 0.2]} rotation={[0.8 + breathe, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.22, 0.85, 7]} />
        <meshStandardMaterial color={0x3a2c1a} roughness={0.85} />
      </mesh>
      {/* Head bowed to ground */}
      <mesh position={[0.4, 0.9, 0.65]}>
        <sphereGeometry args={[0.155, 10, 8]} />
        <meshStandardMaterial color={0x8b6914} roughness={0.6} />
      </mesh>
      {/* Outstretched arms */}
      <mesh position={[0.7, 0.62, 0.5]} rotation={[0.9, 0, 0.4]}>
        <cylinderGeometry args={[0.04, 0.06, 0.7, 5]} />
        <meshStandardMaterial color={0x8b6914} roughness={0.6} />
      </mesh>
      <mesh position={[-0.4, 0.62, 0.6]} rotation={[0.9, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.06, 0.7, 5]} />
        <meshStandardMaterial color={0x8b6914} roughness={0.6} />
      </mesh>
      {/* Head covering */}
      <mesh position={[0.4, 0.98, 0.65]}>
        <coneGeometry args={[0.17, 0.2, 7]} />
        <meshStandardMaterial color={0x2a2010} roughness={0.9} />
      </mesh>
    </group>
  );
};

const GardenGround: React.FC = () => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80, 16, 16]} />
      <meshStandardMaterial color={0x0e1a08} roughness={0.95} />
    </mesh>
    {/* Rock for Jesus to lean on */}
    <mesh position={[0.6, 0.25, -0.5]}>
      <dodecahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color={0x2a2420} roughness={0.9} metalness={0.05} />
    </mesh>
  </>
);

const PrayerSceneInner: React.FC<{phase?: number}> = ({phase = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pushProgress = spring({
    frame,
    fps,
    config: {damping: 400, stiffness: 10, mass: 4},
  });

  const flicker = 0.8 + 0.2 * Math.sin(frame * 0.35 + 1.2);

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT}>
      <CameraRig frame={frame} phase={pushProgress} />

      <ambientLight intensity={0.03} color={0x0a0820} />

      {/* Soft moonlight from above */}
      <directionalLight color={0x6070aa} intensity={0.12} position={[0, 20, -10]} />

      {/* Torch behind/to side — dramatic rim light */}
      <pointLight
        color={0xff8c32}
        intensity={4.5 * flicker}
        distance={16}
        decay={2}
        position={[-5, 2.5, -4]}
      />

      {/* Secondary warm fill */}
      <pointLight
        color={0xff6020}
        intensity={1.5 * flicker}
        distance={10}
        decay={2}
        position={[4, 1.5, 3]}
      />

      {/* Sky */}
      <mesh>
        <sphereGeometry args={[90, 24, 12]} />
        <meshBasicMaterial color={0x05030e} side={THREE.BackSide} />
      </mesh>

      {/* Stars */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[85, 24, 12]} />
        <meshBasicMaterial color={0x070514} side={THREE.BackSide} />
      </mesh>

      <GardenGround />

      {/* Olive trees framing */}
      <group position={[-5, 0, -4]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.16, 3, 6]} />
          <meshStandardMaterial color={0x2c1a0a} roughness={0.95} />
        </mesh>
        <mesh position={[0, 3.8, 0]}>
          <sphereGeometry args={[1.5, 7, 5]} />
          <meshStandardMaterial color={0x142208} roughness={0.9} />
        </mesh>
      </group>
      <group position={[4, 0, -3]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 3.6, 6]} />
          <meshStandardMaterial color={0x2c1a0a} roughness={0.95} />
        </mesh>
        <mesh position={[0, 4.5, 0]}>
          <sphereGeometry args={[1.7, 7, 5]} />
          <meshStandardMaterial color={0x1a2e0a} roughness={0.9} />
        </mesh>
      </group>

      <KneelingFigure frame={frame} />
      <AtmosphericDust frame={frame} />

      <fog attach="fog" args={[0x050310, 15, 50]} />
    </ThreeCanvas>
  );
};

const PrayerScene: React.FC<{phase?: number}> = (props) => (
  <div style={{position: 'absolute', inset: 0}}>
    <PrayerSceneInner {...props} />
  </div>
);

export default PrayerScene;
