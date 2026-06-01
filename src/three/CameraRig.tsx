import React from "react";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";

type Vec3 = [number, number, number];

/**
 * Deterministic, frame-driven camera controller.
 *
 * Instead of r3f's raf-based `useFrame`, we read Remotion's `useCurrentFrame`
 * and let a caller-supplied function describe the camera at that frame. This
 * keeps every render reproducible (essential for video output) while still
 * giving us buttery After-Effects-style moves.
 */
export const CameraRig: React.FC<{
  position: (frame: number) => Vec3;
  lookAt?: (frame: number) => Vec3;
  fov?: (frame: number) => number;
}> = ({ position, lookAt, fov }) => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  const pos = position(frame);
  camera.position.set(pos[0], pos[1], pos[2]);

  const target = lookAt ? lookAt(frame) : [0, 1.5, 0];
  camera.lookAt(target[0], target[1], target[2]);

  if (fov) {
    camera.fov = fov(frame);
  }
  camera.updateProjectionMatrix();

  return null;
};
