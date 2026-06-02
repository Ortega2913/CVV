import React, {useRef} from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';

interface FloatingCrossProps {
  scale?: number;
  color?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  verticalBob?: number;
  roughness?: number;
  metalness?: number;
}

// 3D cross geometry built from two box meshes — orbits and bobs in 3D space
export const FloatingCross: React.FC<FloatingCrossProps> = ({
  scale = 1,
  color = '#f59e0b',
  emissiveColor = '#f59e0b',
  emissiveIntensity = 0.5,
  orbitRadius = 0,
  orbitSpeed = 0.5,
  verticalBob = 0.15,
  roughness = 0.3,
  metalness = 0.7,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frame = useCurrentFrame();

  // Animate the cross every render (Remotion re-renders per frame)
  const t = frame / 30; // time in seconds

  // Rotation + orbit
  if (groupRef.current) {
    // Smooth orbit around Y axis
    groupRef.current.rotation.y = t * orbitSpeed;
    // Gentle tilt
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    groupRef.current.rotation.z = Math.cos(t * 0.2) * 0.08;

    // Vertical bob
    groupRef.current.position.y = Math.sin(t * 0.7) * verticalBob;

    // Orbit in XZ plane
    if (orbitRadius > 0) {
      groupRef.current.position.x = Math.cos(t * orbitSpeed) * orbitRadius;
      groupRef.current.position.z = Math.sin(t * orbitSpeed) * orbitRadius;
    }
  }

  const material = (
    <meshStandardMaterial
      color={color}
      emissive={emissiveColor}
      emissiveIntensity={emissiveIntensity}
      roughness={roughness}
      metalness={metalness}
    />
  );

  return (
    <group ref={groupRef} scale={scale}>
      {/* Vertical beam of cross */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 1.2, 0.18]} />
        {material}
      </mesh>
      {/* Horizontal beam of cross */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.72, 0.18, 0.18]} />
        {material}
      </mesh>
    </group>
  );
};
