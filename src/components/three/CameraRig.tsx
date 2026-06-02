import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

type CameraMovement = 'orbit' | 'dolly-in' | 'dolly-out' | 'pan-left' | 'pan-right' | 'static' | 'drift';

interface CameraRigProps {
  movement?: CameraMovement;
  startPosition?: [number, number, number];
  endPosition?: [number, number, number];
  lookAt?: [number, number, number];
  orbitRadius?: number;
  orbitSpeed?: number; // full revolutions per 100 frames
  transitionFrames?: number;
  fov?: number;
}

// Camera controller — sets Three.js camera position based on Remotion frame number.
// Must be rendered inside a ThreeCanvas component.
export const CameraRig: React.FC<CameraRigProps> = ({
  movement = 'static',
  startPosition = [0, 0, 5],
  endPosition = [0, 0, 5],
  lookAt = [0, 0, 0],
  orbitRadius = 5,
  orbitSpeed = 0.2,
  transitionFrames = 60,
  fov = 60,
}) => {
  const {camera} = useThree();
  const frame = useCurrentFrame();

  // Apply FOV if it's a perspective camera
  if ('fov' in camera) {
    (camera as THREE.PerspectiveCamera).fov = fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }

  const t = frame / 30; // time in seconds

  switch (movement) {
    case 'orbit': {
      const angle = t * orbitSpeed * Math.PI * 2;
      camera.position.set(
        Math.sin(angle) * orbitRadius,
        startPosition[1] + Math.sin(t * 0.4) * 0.3,
        Math.cos(angle) * orbitRadius
      );
      break;
    }

    case 'dolly-in':
    case 'dolly-out': {
      const progress = Math.min(1, frame / transitionFrames);
      // Smooth ease-in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      camera.position.set(
        startPosition[0] + (endPosition[0] - startPosition[0]) * eased,
        startPosition[1] + (endPosition[1] - startPosition[1]) * eased,
        startPosition[2] + (endPosition[2] - startPosition[2]) * eased
      );
      break;
    }

    case 'pan-left': {
      const panX = interpolate(frame, [0, transitionFrames], [startPosition[0], endPosition[0]], {
        extrapolateRight: 'clamp',
      });
      camera.position.set(panX, startPosition[1], startPosition[2]);
      break;
    }

    case 'pan-right': {
      const panX = interpolate(frame, [0, transitionFrames], [startPosition[0], endPosition[0]], {
        extrapolateRight: 'clamp',
      });
      camera.position.set(panX, startPosition[1], startPosition[2]);
      break;
    }

    case 'drift': {
      // Slow, dreamy drift with subtle oscillation
      camera.position.set(
        startPosition[0] + Math.sin(t * 0.2) * 0.5,
        startPosition[1] + Math.cos(t * 0.15) * 0.3,
        startPosition[2] + Math.cos(t * 0.1) * 0.4
      );
      break;
    }

    case 'static':
    default: {
      camera.position.set(...startPosition);
      break;
    }
  }

  camera.lookAt(...lookAt);

  return null;
};
