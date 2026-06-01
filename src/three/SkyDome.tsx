import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * A large inverted sphere with a vertical gradient painted via a shader.
 * Drives the whole mood — pass stormy blues for the hook, warm gold for sunrise.
 */
export const SkyDome: React.FC<{
  top: string;
  bottom: string;
  /** Position of the brightest glow band (0 = horizon, 1 = zenith). */
  horizon?: number;
  /** Extra glow colour blended near the horizon (e.g. sun glow). */
  glow?: string;
  glowStrength?: number;
}> = ({ top, bottom, horizon = 0.32, glow = "#000000", glowStrength = 0 }) => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color(top) },
        uBottom: { value: new THREE.Color(bottom) },
        uGlow: { value: new THREE.Color(glow) },
        uHorizon: { value: horizon },
        uGlowStrength: { value: glowStrength },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        void main() {
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vWorldPos;
        uniform vec3 uTop;
        uniform vec3 uBottom;
        uniform vec3 uGlow;
        uniform float uHorizon;
        uniform float uGlowStrength;
        void main() {
          float h = normalize(vWorldPos).y * 0.5 + 0.5; // 0..1 bottom->top
          float t = smoothstep(0.0, 1.0, (h - uHorizon) / (1.0 - uHorizon));
          vec3 col = mix(uBottom, uTop, clamp(t, 0.0, 1.0));
          // warm glow band hugging the horizon
          float band = exp(-pow((h - uHorizon) * 6.0, 2.0));
          col += uGlow * band * uGlowStrength;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, [top, bottom, glow, horizon, glowStrength]);

  return (
    <mesh material={material}>
      <sphereGeometry args={[60, 32, 32]} />
    </mesh>
  );
};
