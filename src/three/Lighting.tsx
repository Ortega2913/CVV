import React from "react";

type Vec3 = [number, number, number];

/**
 * Cinematic 3-point-ish lighting:
 *  - a strong warm key (the dramatic side light / sun behind clouds)
 *  - a cool blue fill so shadows read as moody, not black
 *  - a subtle rim for separation on the crosses
 */
export const Lighting: React.FC<{
  keyPosition?: Vec3;
  keyColor?: string;
  keyIntensity?: number;
  fillColor?: string;
  fillIntensity?: number;
  ambient?: number;
}> = ({
  keyPosition = [-8, 9, 4],
  keyColor = "#ffb45a",
  keyIntensity = 3.2,
  fillColor = "#2a4a8a",
  fillIntensity = 0.6,
  ambient = 0.18,
}) => {
  return (
    <>
      <ambientLight intensity={ambient} color="#6a7a9a" />

      {/* Warm key — casts the long dramatic shadows */}
      <directionalLight
        position={keyPosition}
        intensity={keyIntensity}
        color={keyColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Cool fill from the opposite side */}
      <directionalLight
        position={[7, 5, -3]}
        intensity={fillIntensity}
        color={fillColor}
      />

      {/* Soft rim from behind for separation */}
      <pointLight position={[0, 6, -8]} intensity={1.2} color="#cfe0ff" />
    </>
  );
};
