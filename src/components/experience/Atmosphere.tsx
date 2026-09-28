"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Quality = "high" | "medium" | "low";

const BITS = ["001101", "101001", "TEST.RUN()", "API 200", "BUILD PASS", "CI/CD", "AUTOMATION", "AI TEST", "E2E", "PLAYWRIGHT", "JMeter", "QA"];

function bitTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.clearRect(0, 0, 512, 96);
  context.fillStyle = "rgba(196, 165, 255, 0.9)";
  context.font = "500 42px sans-serif";
  context.textAlign = "center";
  context.fillText(label, 256, 62);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function statusTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 420;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "rgba(12, 10, 20, 0.72)";
  context.fillRect(0, 0, 768, 420);
  context.strokeStyle = "#9a7dff";
  context.lineWidth = 4;
  context.strokeRect(10, 10, 748, 400);
  context.fillStyle = "#f4f1fb";
  context.font = "600 40px sans-serif";
  context.fillText("SYSTEM STATUS", 48, 78);
  const rows = [
    ["AUTOMATION", "ONLINE"],
    ["API", "ONLINE"],
    ["CI/CD", "ACTIVE"],
    ["AI ENGINE", "ACTIVE"],
  ];
  context.font = "400 32px sans-serif";
  rows.forEach(([name, state], index) => {
    const y = 160 + index * 58;
    context.fillStyle = "#d9d3ea";
    context.fillText(name, 48, y);
    context.fillStyle = "#9ecbff";
    context.fillText(state, 470, y);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function DataField({ quality, reduce }: { quality: Quality; reduce: boolean }) {
  const count = quality === "high" ? 980 : quality === "medium" ? 460 : 180;
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (((index * 29) % 100) / 100 - 0.5) * 3.1;
      values[index * 3 + 1] = 0.15 + ((index * 17) % 100) / 100 * 2.55;
      values[index * 3 + 2] = 3 - ((index * 53) % 1000) / 1000 * 43;
    }
    return values;
  }, [count]);
  const seeds = useMemo(() => {
    const values = new Float32Array(count);
    for (let index = 0; index < count; index += 1) values[index] = ((index * 47) % 100) / 100;
    return values;
  }, [count]);
  const points = useRef<THREE.Points>(null);

  useFrame(({ clock }, delta) => {
    const attribute = points.current?.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!attribute || reduce) return;
    const array = attribute.array as Float32Array;
    const time = clock.elapsedTime;
    const step = Math.min(delta, 0.05);
    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      array[offset + 1] += step * (0.035 + seeds[index] * 0.05);
      array[offset] += Math.sin(time * 0.35 + seeds[index] * 6) * step * 0.04;
      if (array[offset + 1] > 2.85) array[offset + 1] = 0.12;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={quality === "low" ? "#b79bff" : "#c9b6ff"}
        size={quality === "high" ? 0.018 : 0.026}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function FloatingBits({ reduce }: { reduce: boolean }) {
  const textures = useMemo(() => BITS.map((label) => bitTexture(label)), []);
  const group = useRef<THREE.Group>(null);
  useEffect(() => () => textures.forEach((texture) => texture.dispose()), [textures]);
  useFrame(({ clock }) => {
    const root = group.current;
    if (!root || reduce) return;
    const time = clock.elapsedTime;
    root.children.forEach((child, index) => {
      child.position.y = 1.55 + ((index * 17) % 10) / 18 + Math.sin(time * 0.25 + index) * 0.06;
    });
  });
  return (
    <group ref={group}>
      {textures.map((texture, index) => (
        <mesh key={BITS[index]} position={[index % 2 === 0 ? -1.25 : 1.25, 1.7, 1 - index * 3.15]} rotation={[0, index % 2 === 0 ? 0.4 : -0.4, 0]}>
          <planeGeometry args={[0.72, 0.14]} />
          <meshBasicMaterial map={texture} transparent opacity={0.28} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function StatusHolo({ reduce }: { reduce: boolean }) {
  const texture = useMemo(() => statusTexture(), []);
  const panel = useRef<THREE.Group>(null);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(({ clock }) => {
    if (!panel.current || reduce) return;
    panel.current.position.y = 2.15 + Math.sin(clock.elapsedTime * 0.4) * 0.04;
  });
  return (
    <group ref={panel} position={[1.15, 2.15, -4.2]} rotation={[0, -0.5, 0]}>
      <mesh>
        <planeGeometry args={[1.15, 0.64]} />
        <meshBasicMaterial map={texture} transparent opacity={0.82} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

const RIB_Z = [-3.2, -5.4, -11.2, -13.6, -19.4, -21.2, -27.6, -29.4, -35.2];

export function WallRibs({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const root = group.current;
    if (!root || reduce) return;
    const glow = 0.55 + Math.sin(clock.elapsedTime * 0.45) * 0.12;
    root.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = glow;
    });
  });
  return (
    <group ref={group}>
      {RIB_Z.map((z, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const accent = index % 3 === 0 ? "#7eb6ff" : "#8d6bff";
        return (
          <mesh key={z} position={[side * 2.12, 1.45, z]}>
            <boxGeometry args={[0.02, index % 2 === 0 ? 1.7 : 1.15, 0.02]} />
            <meshBasicMaterial color={accent} transparent opacity={0.7} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

export function FloorGuide() {
  return (
    <group>
      <mesh position={[0, 0.021, -17]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.045, 40]} />
        <meshBasicMaterial color="#6d8cff" transparent opacity={0.55} toneMapped={false} />
      </mesh>
      {[-8, -16, -24, -32].map((z, index) => (
        <mesh key={z} position={[index % 2 === 0 ? -0.85 : 0.85, 0.022, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.03]} />
          <meshBasicMaterial color="#9a67ff" transparent opacity={0.7} toneMapped={false} />
        </mesh>
      ))}
      {[-6, -14, -22, -30, -36].map((z) => (
        <mesh key={`grid-${z}`} position={[0, 0.018, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.4, 0.008]} />
          <meshBasicMaterial color="#3d3558" transparent opacity={0.8} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function CeilingBays() {
  return (
    <group>
      {[-6, -18, -30].map((z) => (
        <mesh key={z} position={[0, 2.86, z]}>
          <boxGeometry args={[1.4, 0.015, 0.35]} />
          <meshBasicMaterial color="#241c38" />
        </mesh>
      ))}
    </group>
  );
}
