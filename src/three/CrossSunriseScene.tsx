import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {VIDEO_WIDTH, VIDEO_HEIGHT} from '../constants';

const CameraRig: React.FC<{frame: number}> = ({frame}) => {
  const {camera} = useThree();
  const {fps} = useVideoConfig();

  // Majestic crane shot: start low and close, rise and pull back
  const craneProgress = spring({
    frame,
    fps,
    config: {damping: 350, stiffness: 12, mass: 4},
  });

  const y = interpolate(craneProgress, [0, 1], [1.5, 14]);
  const z = interpolate(craneProgress, [0, 1], [8, 30]);
  const fov = interpolate(craneProgress, [0, 1], [50, 38]);

  camera.position.set(0, y, z);
  (camera as THREE.PerspectiveCamera).fov = fov;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(0, 4, 0);

  return null;
};

// Procedural hill geometry
const Hill: React.FC = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(80, 60, 40, 40);
    const positions = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      // Raised hill in center-back
      const dist = Math.sqrt(x * x + (y + 10) * (y + 10));
      const hillHeight = Math.max(0, 8 * Math.exp(-dist * dist / 180));
      positions.setZ(i, hillHeight - 0.5);
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geometry}>
      <meshStandardMaterial color={0x1a1208} roughness={0.95} />
    </mesh>
  );
};

const Cross: React.FC = () => {
  return (
    <group position={[0, 0, -18]}>
      {/* Vertical beam */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[0.35, 10, 0.35]} />
        <meshStandardMaterial color={0x120e08} roughness={0.9} />
      </mesh>
      {/* Horizontal beam */}
      <mesh position={[0, 7, 0]}>
        <boxGeometry args={[5.5, 0.35, 0.35]} />
        <meshStandardMaterial color={0x120e08} roughness={0.9} />
      </mesh>
    </group>
  );
};

const SunRays: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const progress = spring({frame, fps, config: {damping: 300, stiffness: 15, mass: 3}});
  const opacity = interpolate(progress, [0, 1], [0, 0.55]);

  const rays = useMemo(
    () =>
      Array.from({length: 16}, (_, i) => ({
        angle: (i / 16) * Math.PI * 2,
        length: 25 + (i % 3) * 8,
        width: 0.5 + (i % 4) * 0.25,
      })),
    []
  );

  return (
    <group position={[0, 8, -40]} rotation={[Math.PI / 2, 0, 0]}>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(ray.angle) * ray.length * 0.5,
            Math.sin(ray.angle) * ray.length * 0.5,
            0,
          ]}
          rotation={[0, 0, ray.angle + Math.PI / 2]}
        >
          <planeGeometry args={[ray.width, ray.length]} />
          <meshBasicMaterial
            color={0xfff0a0}
            transparent
            opacity={opacity * (0.08 + 0.04 * Math.sin(i * 1.7))}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const SkyGradient: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const progress = spring({frame, fps, config: {damping: 300, stiffness: 10, mass: 4}});

  // Sky color transitions from deep purple-blue to warm sunrise
  const skyColor = new THREE.Color(
    interpolate(progress, [0, 1], [0.04, 0.25]),
    interpolate(progress, [0, 1], [0.02, 0.15]),
    interpolate(progress, [0, 1], [0.15, 0.08])
  );
  const horizonColor = new THREE.Color(
    interpolate(progress, [0, 1], [0.12, 0.95]),
    interpolate(progress, [0, 1], [0.05, 0.55]),
    interpolate(progress, [0, 1], [0.08, 0.1])
  );

  return (
    <>
      {/* Upper sky */}
      <mesh position={[0, 20, -50]}>
        <planeGeometry args={[200, 60]} />
        <meshBasicMaterial color={skyColor} />
      </mesh>
      {/* Horizon glow */}
      <mesh position={[0, 6, -48]}>
        <planeGeometry args={[200, 20]} />
        <meshBasicMaterial color={horizonColor} transparent opacity={0.7} />
      </mesh>
      {/* Ground sky fill */}
      <mesh position={[0, -2, -45]}>
        <planeGeometry args={[200, 15]} />
        <meshBasicMaterial color={new THREE.Color(0.06, 0.04, 0.02)} />
      </mesh>
    </>
  );
};

const CrossSunriseSceneInner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({frame, fps, config: {damping: 300, stiffness: 12, mass: 3}});

  return (
    <ThreeCanvas width={VIDEO_WIDTH} height={VIDEO_HEIGHT}>
      <CameraRig frame={frame} />

      <ambientLight intensity={0.05} color={0x0a0808} />

      {/* Sun as a point light rising over the horizon */}
      <pointLight
        color={0xff9030}
        intensity={interpolate(progress, [0, 1], [0, 12])}
        distance={200}
        decay={1.5}
        position={[0, 8, -60]}
      />

      {/* Soft fill from sky */}
      <directionalLight
        color={0xffa050}
        intensity={interpolate(progress, [0, 1], [0, 0.4])}
        position={[0, 30, -40]}
      />

      <SkyGradient frame={frame} />
      <Hill />
      <Cross />
      <SunRays frame={frame} />

      {/* Ground plane foreground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 10]}>
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial color={0x100e08} roughness={0.98} />
      </mesh>
    </ThreeCanvas>
  );
};

const CrossSunriseScene: React.FC = () => (
  <div style={{position: 'absolute', inset: 0}}>
    <CrossSunriseSceneInner />
  </div>
);

export default CrossSunriseScene;
