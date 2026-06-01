import React from "react";

type Vec3 = [number, number, number];

/**
 * A single wooden cross built from two beams. Kept low-poly and matte so it
 * reads as a dramatic silhouette against the sky and catches rim light.
 */
export const Cross: React.FC<{
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
  /** Darker = pure silhouette; lighter = lit hero cross. */
  color?: string;
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#1a120b",
}) => {
  const beamW = 0.32;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Vertical beam */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[beamW, 4.4, beamW]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
      </mesh>
      {/* Horizontal beam (crossbeam ~3/4 up) */}
      <mesh position={[0, 2.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, beamW, beamW]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
      </mesh>
      {/* Subtle joint block where the beams meet */}
      <mesh position={[0, 2.9, beamW * 0.5]}>
        <boxGeometry args={[beamW * 1.4, beamW * 1.4, beamW * 0.5]} />
        <meshStandardMaterial color={color} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
};

/**
 * A loose human figure suggested on a cross — kept abstract (silhouette
 * proportions only) so it stays reverent and renders cheaply.
 */
export const FigureOnCross: React.FC<{
  position?: Vec3;
  /** Slumped lean of the body, in radians. */
  lean?: number;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
}> = ({
  position = [0, 0, 0],
  lean = 0,
  color = "#2a1d14",
  emissive = "#000000",
  emissiveIntensity = 0,
}) => {
  return (
    <group position={position} rotation={[0, 0, lean]}>
      {/* Torso */}
      <mesh position={[0, 3.05, 0.22]}>
        <capsuleGeometry args={[0.26, 0.7, 4, 10]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.85}
        />
      </mesh>
      {/* Head, gently bowed */}
      <mesh position={[0, 3.62, 0.28]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.8}
        />
      </mesh>
      {/* Outstretched arms following the crossbeam */}
      <mesh position={[0, 3.32, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.12, 1.5, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.85}
        />
      </mesh>
      {/* Legs */}
      <mesh position={[0, 2.2, 0.22]}>
        <capsuleGeometry args={[0.16, 0.8, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.85}
        />
      </mesh>
    </group>
  );
};
