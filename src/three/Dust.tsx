import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { FPS } from "../theme";

/**
 * Floating 3D dust motes. They drift slowly and live in their own depth range,
 * so as the camera moves they parallax against the crosses for real depth.
 * Deterministic: positions are derived from frame, never from raf.
 */
export const Dust: React.FC<{
  count?: number;
  color?: string;
  size?: number;
  /** Half-extent of the box the motes float inside. */
  area?: [number, number, number];
  center?: [number, number, number];
  opacity?: number;
}> = ({
  count = 320,
  color = "#ffe6bf",
  size = 0.045,
  area = [14, 9, 10],
  center = [0, 4, 2],
  opacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const { base, drift } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const drift = new Float32Array(count * 3);
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      base[i * 3] = (rand() - 0.5) * 2 * area[0];
      base[i * 3 + 1] = (rand() - 0.5) * 2 * area[1];
      base[i * 3 + 2] = (rand() - 0.5) * 2 * area[2];
      drift[i * 3] = 0.2 + rand() * 0.5;
      drift[i * 3 + 1] = 0.15 + rand() * 0.4;
      drift[i * 3 + 2] = rand() * Math.PI * 2;
    }
    return { base, drift };
  }, [count, area]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const px = base[i * 3];
      const py = base[i * 3 + 1];
      const pz = base[i * 3 + 2];
      const sx = drift[i * 3];
      const sy = drift[i * 3 + 1];
      const phase = drift[i * 3 + 2];
      arr[i * 3] = center[0] + px + Math.sin(t * sx + phase) * 0.6;
      arr[i * 3 + 1] =
        center[1] + ((py + t * sy * 0.4) % (area[1] * 2)) - area[1];
      arr[i * 3 + 2] = center[2] + pz + Math.cos(t * sx * 0.7 + phase) * 0.6;
    }
    return arr;
  }, [base, drift, t, count, area, center]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  // Soft round sprite for each mote.
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  // touch useThree so the component re-evaluates within the canvas context
  useThree();

  return (
    <points geometry={geom}>
      <pointsMaterial
        size={size}
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};
