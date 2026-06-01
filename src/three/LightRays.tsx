import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * Volumetric-ish "god rays" — a fan of additive, soft-edged cones angled as if
 * sunlight is breaking through clouds. Cheap fake that reads beautifully on
 * mobile, especially over the dark crosses.
 */
export const LightRays: React.FC<{
  count?: number;
  color?: string;
  opacity?: number;
  origin?: [number, number, number];
  spread?: number;
}> = ({
  count = 7,
  color = "#ffdca0",
  opacity = 0.14,
  origin = [-6, 12, -4],
  spread = 0.45,
}) => {
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [color, opacity]
  );

  const rays = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const t = (i / (count - 1) - 0.5) * 2; // -1..1
      return {
        rot: t * spread,
        len: 22 + Math.abs(t) * 6,
        rad: 0.5 + Math.random() * 0.9,
      };
    });
  }, [count, spread]);

  return (
    <group position={origin} rotation={[0, 0, Math.PI]}>
      {rays.map((r, i) => (
        <mesh
          key={i}
          material={material}
          rotation={[0, 0, r.rot]}
          position={[0, -r.len / 2, 0]}
        >
          <coneGeometry args={[r.rad, r.len, 16, 1, true]} />
        </mesh>
      ))}
    </group>
  );
};
