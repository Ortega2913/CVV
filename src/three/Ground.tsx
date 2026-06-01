import React from "react";

/**
 * A simple dark hill / ground plane. Tilted slightly so the crosses sit on a
 * rise (Golgotha). Matte material so it stays in shadow and emphasises the
 * silhouettes above it.
 */
export const Ground: React.FC<{ color?: string }> = ({ color = "#0a0905" }) => {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      receiveShadow
    >
      <circleGeometry args={[40, 48]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </mesh>
  );
};
