"use client";
import {
  corridorTravel,
  galleryClients,
  lab,
  labPanels,
  labScreens,
  profile,
  record,
  rooms,
  toolkit,
  type RoomId,
} from "@/content/experience";
import { CeilingBays, DataField, FloatingBits, FloorGuide, StatusHolo, WallRibs } from "@/components/experience/Atmosphere";
import { Html, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

type Quality = "high" | "medium" | "low";

const DOORS: {
  id: Exclude<RoomId, "hub">;
  z: number;
  side: -1 | 1;
  title: string;
  kicker: string;
  prompt: string;
}[] = [
  {
    id: "lab",
    z: -8,
    side: -1,
    title: "Automation lab",
    kicker: "Playwright  ·  API  ·  AI",
    prompt: "Enter automation lab",
  },
  {
    id: "gallery",
    z: -16,
    side: 1,
    title: "Project gallery",
    kicker: "Selected client work",
    prompt: "Open project gallery",
  },
  {
    id: "experience",
    z: -24,
    side: -1,
    title: "Experience",
    kicker: "SDET  ·  QA automation",
    prompt: "Open experience",
  },
  {
    id: "contact",
    z: -32,
    side: 1,
    title: "Contact",
    kicker: "Email  ·  Resume",
    prompt: "Open contact",
  },
];

const TOOLKIT_Z = -39.55;

type Props = {
  room: RoomId;
  project: number;
  reduce: boolean;
  quality: Quality;
  strollRef: MutableRefObject<number>;
  onEnter: (room: RoomId) => void;
  onInspect: (index: number) => void;
  onNear: (room: RoomId | null) => void;
};

function repeat(texture: THREE.Texture, x: number, y: number) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(x, y);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (context.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function panelTexture(title: string, lines: string[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#221f2c";
  context.fillRect(0, 0, 1024, 640);
  context.strokeStyle = "#c4a5ff";
  context.lineWidth = 12;
  context.strokeRect(18, 18, 988, 604);
  context.fillStyle = "#ffffff";
  context.font = "700 62px sans-serif";
  const titleLines = wrapText(context, title, 900).slice(0, 2);
  titleLines.forEach((line, index) => context.fillText(line, 56, 108 + index * 70));
  context.fillStyle = "#e7e2f4";
  context.font = "400 34px sans-serif";
  const body = lines.flatMap((line) => wrapText(context, line, 900));
  const start = 118 + titleLines.length * 70;
  body.slice(0, 8).forEach((line, index) => context.fillText(line, 56, start + index * 46));
  return makeTexture(canvas);
}

function gateTexture(title: string, kicker: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#121018";
  context.fillRect(0, 0, 768, 1024);
  context.strokeStyle = "#b794ff";
  context.lineWidth = 8;
  context.strokeRect(28, 28, 712, 968);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = "700 64px sans-serif";
  const titles = wrapText(context, title.toUpperCase(), 620).slice(0, 3);
  titles.forEach((line, index) => context.fillText(line, 384, 390 + index * 74));
  context.fillStyle = "#d5ccf0";
  context.font = "400 32px sans-serif";
  wrapText(context, kicker, 620)
    .slice(0, 2)
    .forEach((line, index) => context.fillText(line, 384, 430 + titles.length * 74 + index * 42));
  context.fillStyle = "#c4a5ff";
  context.font = "600 28px sans-serif";
  context.fillText("ENTER  →", 384, 860);
  context.textAlign = "left";
  return makeTexture(canvas);
}

function tileTexture(mark: string, name: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 384;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#1b1826";
  context.fillRect(0, 0, 384, 384);
  context.strokeStyle = "#c4a5ff";
  context.lineWidth = 8;
  context.strokeRect(14, 14, 356, 356);
  context.fillStyle = "#c4a5ff";
  context.textAlign = "center";
  context.font = "700 78px sans-serif";
  context.fillText(mark, 192, 168);
  context.fillStyle = "#ffffff";
  context.font = "600 26px sans-serif";
  wrapText(context, name, 320)
    .slice(0, 3)
    .forEach((line, index) => context.fillText(line, 192, 230 + index * 34));
  context.textAlign = "left";
  return makeTexture(canvas);
}

function headerTexture(title: string, subtitle: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 360;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#16131f";
  context.fillRect(0, 0, 1400, 360);
  context.strokeStyle = "#c4a5ff";
  context.lineWidth = 8;
  context.strokeRect(12, 12, 1376, 336);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = "700 72px sans-serif";
  context.fillText(title, 700, 140);
  context.fillStyle = "#e4def4";
  context.font = "400 32px sans-serif";
  wrapText(context, subtitle, 1240)
    .slice(0, 2)
    .forEach((line, index) => context.fillText(line, 700, 210 + index * 42));
  context.textAlign = "left";
  return makeTexture(canvas);
}

function GateLight({ position, aim }: { position: [number, number, number]; aim: [number, number, number] }) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useRef<THREE.Object3D>(null);
  useLayoutEffect(() => {
    if (light.current && target.current) light.current.target = target.current;
  }, []);
  return (
    <>
      <spotLight ref={light} position={position} angle={0.5} penumbra={0.85} intensity={7} distance={8} decay={2} color="#d9ccff" />
      <object3D ref={target} position={aim} />
    </>
  );
}

function Door({
  door,
  open,
  near,
  reduce,
  quality,
  onEnter,
}: {
  door: (typeof DOORS)[number];
  open: boolean;
  near: boolean;
  reduce: boolean;
  quality: Quality;
  onEnter: (room: RoomId) => void;
}) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const label = useMemo(() => gateTexture(door.title, door.kicker), [door.kicker, door.title]);
  const leds = useRef<THREE.Group>(null);
  const motePositions = useMemo(() => {
    const values = new Float32Array(40 * 3);
    for (let index = 0; index < 40; index += 1) {
      values[index * 3] = (((index * 19) % 100) / 100 - 0.5) * 1.5;
      values[index * 3 + 1] = (((index * 23) % 100) / 100 - 0.4) * 2.2;
      values[index * 3 + 2] = 0.2 + ((index * 13) % 100) / 100 * 0.7;
    }
    return values;
  }, []);

  useEffect(() => () => label.dispose(), [label]);

  useEffect(() => {
    const duration = reduce ? 0 : 1.15;
    const leftTween = left.current
      ? gsap.to(left.current.position, { x: open ? -1.35 : -0.46, duration, ease: "power3.inOut" })
      : null;
    const rightTween = right.current
      ? gsap.to(right.current.position, { x: open ? 1.35 : 0.46, duration, ease: "power3.inOut" })
      : null;
    return () => {
      leftTween?.kill();
      rightTween?.kill();
    };
  }, [open, reduce]);

  useFrame(({ clock }) => {
    const group = leds.current;
    if (!group) return;
    const pulse = reduce ? 0.8 : 0.62 + Math.sin(clock.elapsedTime * 1.2 + door.z * 0.2) * 0.16;
    const opacity = near || open ? Math.min(1, pulse + 0.28) : pulse;
    group.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = opacity;
    });
  });

  const enter = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onEnter(door.id);
  };

  return (
    <group position={[door.side * 1.92, 1.38, door.z]} rotation={[0, door.side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      {[-1.02, 1.02].map((x) => (
        <mesh key={x} position={[x, 0, 0.04]}>
          <boxGeometry args={[0.12, 2.72, 0.22]} />
          <meshBasicMaterial color="#1a1a22" />
        </mesh>
      ))}
      <mesh position={[0, 1.32, 0.04]}>
        <boxGeometry args={[2.16, 0.12, 0.22]} />
        <meshBasicMaterial color="#1a1a22" />
      </mesh>
      <mesh position={[0, -1.32, 0.04]}>
        <boxGeometry args={[2.16, 0.1, 0.22]} />
        <meshBasicMaterial color="#1a1a22" />
      </mesh>
      <group ref={leds}>
        {[
          [-0.9, 0, 1.22, 0.03],
          [0.9, 0, 1.22, 0.03],
          [0, 1.2, 0.03, 1.78],
          [0, -1.2, 0.03, 1.78],
        ].map(([x, y, height, width]) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.16]}>
            <boxGeometry args={[width, height, 0.025]} />
            <meshBasicMaterial color="#9a67ff" transparent opacity={0.9} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -1.4, 0.95]}>
        <boxGeometry args={[0.55, 0.02, 1.5]} />
        <meshBasicMaterial color={near ? "#b79bff" : "#7c5cff"} transparent opacity={near ? 0.9 : 0.4} toneMapped={false} />
      </mesh>
      {quality === "low" ? null : (
        <points position={[0, 0, 0.35]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[motePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#d7c8ff" size={near ? 0.035 : 0.02} transparent opacity={near ? 0.8 : 0.35} depthWrite={false} />
        </points>
      )}
      <mesh position={[0, 0.05, 0.12]} onClick={enter}>
        <planeGeometry args={[1.55, 2.05]} />
        <meshBasicMaterial map={label} toneMapped={false} />
      </mesh>
      {[
        { ref: left, x: -0.46 },
        { ref: right, x: 0.46 },
      ].map((leaf) => (
        <group key={leaf.x} ref={leaf.ref} position={[leaf.x, 0, 0.16]}>
          <mesh
            onClick={enter}
            onPointerOver={(event) => {
              event.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "";
            }}
          >
            <boxGeometry args={[0.86, 2.4, 0.04]} />
            <meshBasicMaterial color="#101018" transparent opacity={0.72} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function InfoPanel({
  position,
  rotation,
  title,
  lines,
  size = [0.84, 0.58],
  active,
  onClick,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  lines: string[];
  size?: [number, number];
  active?: boolean;
  onClick?: () => void;
}) {
  const texture = useMemo(() => panelTexture(title, lines), [lines, title]);
  const mesh = useRef<THREE.Mesh>(null);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation}
      onClick={(event) => {
        if (!onClick) return;
        event.stopPropagation();
        onClick();
      }}
      onPointerOver={(event) => {
        if (!onClick) return;
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        if (mesh.current) mesh.current.scale.setScalar(1.045);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
        if (mesh.current) mesh.current.scale.setScalar(1);
      }}
    >
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={active ? 0.62 : 0.48}
        roughness={0.72}
        metalness={0.04}
      />
    </mesh>
  );
}

function RoomShell({ door }: { door: (typeof DOORS)[number] }) {
  const face = door.side === -1 ? Math.PI / 2 : -Math.PI / 2;
  const x = door.side * 5.1;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, door.z]}>
        <planeGeometry args={[6.2, 4.4]} />
        <meshStandardMaterial color="#2a2636" metalness={0.28} roughness={0.55} />
      </mesh>
      <mesh position={[door.side * 7.9, 1.5, door.z]} rotation={[0, face, 0]}>
        <planeGeometry args={[4.4, 3]} />
        <meshStandardMaterial color="#16141e" />
      </mesh>
      <mesh position={[x, 1.5, door.z - 2.15]}>
        <planeGeometry args={[6.2, 3]} />
        <meshStandardMaterial color="#1c1a26" />
      </mesh>
      <mesh position={[x, 1.5, door.z + 2.15]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6.2, 3]} />
        <meshStandardMaterial color="#1c1a26" />
      </mesh>
      <mesh position={[x, 2.95, door.z]}>
        <boxGeometry args={[6.2, 0.06, 4.4]} />
        <meshStandardMaterial color="#0c0b12" />
      </mesh>
      {[-1.7, 1.7].map((offset) => (
        <mesh key={offset} position={[x, 2.78, door.z + offset]}>
          <boxGeometry args={[5.2, 0.02, 0.025]} />
          <meshBasicMaterial color="#8d6bff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RoomLights({ door, quality }: { door: (typeof DOORS)[number]; quality: Quality }) {
  const light = useRef<THREE.SpotLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const accent = useRef<THREE.PointLight>(null);
  const target = useRef<THREE.Object3D>(null);
  const reveal = useRef(0);
  useLayoutEffect(() => {
    if (light.current && target.current) light.current.target = target.current;
  }, []);
  useFrame((_, delta) => {
    reveal.current = Math.min(1, reveal.current + Math.min(delta, 0.05) / 1.1);
    const level = reveal.current;
    if (fill.current) fill.current.intensity = (quality === "low" ? 5 : 8) * level;
    if (light.current) light.current.intensity = 12 * level;
    if (accent.current) accent.current.intensity = (quality === "low" ? 1.2 : 2.2) * level;
  });
  const x = door.side * 4.4;
  return (
    <group>
      <pointLight ref={fill} position={[x, 2.45, door.z]} intensity={0} distance={11} decay={2} color="#f7f4ff" />
      {quality === "low" ? null : (
        <spotLight ref={light} position={[door.side * 3.6, 2.3, door.z]} angle={0.72} penumbra={0.9} intensity={0} distance={9} decay={2} color="#ffffff" />
      )}
      <pointLight ref={accent} position={[door.side * 6.6, 1.2, door.z + 0.4]} intensity={0} distance={6} decay={2} color="#8eb6ff" />
      <object3D ref={target} position={[door.side * 7.4, 1.35, door.z]} />
    </group>
  );
}

function faceFor(door: (typeof DOORS)[number]): [number, number, number] {
  return [0, door.side === -1 ? Math.PI / 2 : -Math.PI / 2, 0];
}

function LabRoom({ door, quality }: { door: (typeof DOORS)[number]; quality: Quality }) {
  const face = faceFor(door);
  const panels = [...labPanels, ...labScreens];
  const columns = quality === "low" ? 2 : 4;
  const gap = quality === "low" ? 0.92 : 0.9;
  return (
    <group>
      <RoomShell door={door} />
      <InfoPanel
        title={lab.title}
        lines={LAB_HEADER_LINES}
        rotation={face}
        position={[door.side * 7.48, 2.42, door.z]}
        size={[quality === "low" ? 1.8 : 3.15, 0.42]}
      />
     {panels.map((panel, index) => {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const rowCount = Math.min(columns, panels.length - row * columns);
  const span = (column - (rowCount - 1) / 2) * gap;
  const z = door.z + span * (door.side === -1 ? -1 : 1);

  return (
    <InfoPanel
      key={`${panel.title}-${index}`}
      title={panel.title}
      lines={panel.lines}
      rotation={face}
      position={[
        door.side * 7.48,
        (quality === "low" ? 1.88 : 1.86) -
          row * (quality === "low" ? 0.42 : 0.66),
        z,
      ]}
      size={quality === "low" ? [0.86, 0.44] : [0.84, 0.6]}
    />
  );
})}
      {quality === "low" ? null : <LabSignal door={door} />}
    </group>
  );
}

function LabSignal({ door }: { door: (typeof DOORS)[number] }) {
  const signal = useRef<THREE.Mesh>(null);
  const heal = useRef<THREE.Mesh>(null);
  const stages = [1.85, 1.45, 1.05, 0.65];
  const face = faceFor(door);
  const x = door.side * 7.15;
  const z = door.z + (door.side === -1 ? -1.55 : 1.55);
  useFrame(({ clock }) => {
    const travel = (clock.elapsedTime * 0.22) % 1;
    if (signal.current) signal.current.position.y = stages[0] - travel * (stages[0] - stages[3]);
    if (heal.current) heal.current.position.y = stages[0] - ((clock.elapsedTime * 0.18 + 0.35) % 1) * (stages[0] - stages[3]);
  });
  return (
    <group>
      {["CODE", "BUILD", "TEST", "DEPLOY"].map((label, index) => (
        <InfoPanel key={label} title={label} lines={["Pipeline"]} rotation={face} position={[x, stages[index], z]} size={[0.7, 0.22]} />
      ))}
      <mesh ref={signal} position={[x, stages[0], z + door.side * 0.05]} rotation={face}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#9ecbff" toneMapped={false} />
      </mesh>
      {["BROKEN", "ANALYZE", "LOCATOR", "RECOVERED"].map((label, index) => (
        <InfoPanel
          key={label}
          title={label}
          lines={["AI self-healing"]}
          rotation={face}
          position={[x, stages[index], door.z + (door.side === -1 ? 1.55 : -1.55)]}
          size={[0.7, 0.22]}
        />
      ))}
      <mesh ref={heal} position={[x, stages[0], door.z + (door.side === -1 ? 1.55 : -1.55)]} rotation={face}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#c4a5ff" toneMapped={false} />
      </mesh>
    </group>
  );
}

const LAB_HEADER_LINES = [lab.tagline];
const GALLERY_CARD_LINES = ["Selected QA project"];
const ARCHIVE = [
  { z: 0, y: 2.05 },
  { z: -1.12, y: 1.42 },
  { z: 1.12, y: 1.48 },
  { z: 0, y: 1.05 },
  { z: -1.12, y: 0.78 },
  { z: 1.12, y: 0.84 },
  { z: -1.12, y: 0.22 },
  { z: 1.12, y: 0.28 },
];
const EXPERIENCE_HEADER_LINES = [
  "QA Automation Engineer",
  record.positioning,
  "UI · API · Mobile",
  "Performance · CI/CD · AI-assisted",
];

function GalleryRoom({
  door,
  project,
  quality,
  onInspect,
}: {
  door: (typeof DOORS)[number];
  project: number;
  quality: Quality;
  onInspect: (index: number) => void;
}) {
  const face = faceFor(door);
  const selected = galleryClients[project] ?? galleryClients[0];
  const detail = useMemo(
    () => ["Testing scope", selected.scope, "Automation stack", selected.stack, "Testing type", selected.type, "Responsibilities", selected.responsibilities],
    [selected],
  );
  const columns = quality === "low" ? 2 : 4;
  return (
    <group>
      <RoomShell door={door} />
      <InfoPanel
        title={quality === "low" ? selected.name : "Project archive"}
        lines={quality === "low" ? detail.slice(0, 4) : [selected.name, selected.scope]}
        rotation={face}
        position={[door.side * 7.48, 2.42, door.z]}
        size={[quality === "low" ? 1.8 : 3.15, quality === "low" ? 0.55 : 0.48]}
      />
      {galleryClients.map((client, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const archived = ARCHIVE[index] ?? { z: 0, y: 1 };
        const span = quality === "low" ? (column - (columns - 1) / 2) * 0.92 : archived.z;
        const z = door.z + span * (door.side === -1 ? -1 : 1);
        const y = quality === "low" ? 1.72 - row * 0.52 : archived.y;
        return (
          <InfoPanel
            key={client.name}
            title={client.name}
            lines={GALLERY_CARD_LINES}
            active={project === index}
            rotation={face}
            position={[door.side * 7.48, y, z]}
            size={quality === "low" ? [0.86, 0.46] : index === 0 ? [1.35, 0.42] : [0.98, 0.46]}
            onClick={() => onInspect(index)}
          />
        );
      })}
    </group>
  );
}

function RolePanel({
  role,
  position,
  rotation,
  size,
}: {
  role: (typeof record.roles)[number];
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}) {
  const lines = useMemo(() => [role.when, role.org, role.points[0] ?? ""], [role]);
  return <InfoPanel title={role.title} lines={lines} rotation={rotation} position={position} size={size} />;
}

function ExperienceRoom({ door, quality }: { door: (typeof DOORS)[number]; quality: Quality }) {
  const face = faceFor(door);
  const compact = quality === "low";
  return (
    <group>
      <RoomShell door={door} />
      <InfoPanel
        title="SDET"
        lines={EXPERIENCE_HEADER_LINES}
        rotation={face}
        position={[door.side * 7.5, 2.28, door.z]}
        size={[compact ? 1.8 : 2.8, compact ? 0.62 : 0.7]}
      />
      {record.roles.map((role, index) => (
        <RolePanel
          key={role.org + role.title}
          role={role}
          rotation={face}
          position={[
            door.side * 7.5,
            (compact ? 1.35 : 1.15) - (index % 2) * (compact ? 0.62 : 0.72),
            door.z + (compact ? 0.46 : 0.85) - Math.floor(index / 2) * (compact ? 0.96 : 1.7),
          ]}
          size={compact ? [0.88, 0.56] : [1.45, 0.64]}
        />
      ))}
    </group>
  );
}

function ContactRoom({
  door,
  open,
}: {
  door: (typeof DOORS)[number];
  open: boolean;
}) {
  const face = faceFor(door);

  const contactTexture = useMemo(
    () =>
      panelTexture("CONTACT", [
        profile.email,
        "LinkedIn",
        "Gurugram, India",
        "Senior QA Engineer",
        "SDET · Automation Testing Specialist",
      ]),
    []
  );

  useEffect(() => {
    return () => {
      contactTexture.dispose();
    };
  }, [contactTexture]);

  return (
    <group>
      <RoomShell door={door} />

      {open && (
        <mesh
          position={[door.side * 7.46, 1.65, door.z]}
          rotation={face}
        >
          <planeGeometry args={[3.8, 2.15]} />

          <meshStandardMaterial
            map={contactTexture}
            emissiveMap={contactTexture}
            emissive="#ffffff"
            emissiveIntensity={0.65}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      )}
    </group>
  );
}
function ToolkitWall({ quality, live, reduce }: { quality: Quality; live: boolean; reduce: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const tiles = useMemo(() => toolkit.tools.map((tool) => ({ ...tool, texture: tileTexture(tool.mark, tool.name) })), []);
  const header = useMemo(() => {
    const tool = hover == null ? null : toolkit.tools[hover];
    return headerTexture(tool ? tool.name : "MY TOOLKIT", tool ? tool.blurb : toolkit.subtitle);
  }, [hover]);
  const spot = useRef<THREE.SpotLight>(null);
  const target = useRef<THREE.Object3D>(null);
  const lit = useRef(0);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    if (!live) lit.current = 0;
    else lit.current = Math.min(tiles.length, lit.current + (reduce ? tiles.length : step * 4.5));
    mats.current.forEach((material, index) => {
      if (!material) return;
      material.color.set(index < lit.current || index === hover ? "#ffffff" : "#4e4860");
    });
  });

  useEffect(
    () => () => {
      tiles.forEach((tile) => tile.texture.dispose());
    },
    [tiles],
  );
  useEffect(() => () => header.dispose(), [header]);
  useLayoutEffect(() => {
    if (spot.current && target.current) spot.current.target = target.current;
  }, []);

  return (
    <group position={[0, 1.45, TOOLKIT_Z]}>
      <mesh position={[0, 0.05, -0.08]}>
        <planeGeometry args={[4.15, 2.85]} />
        <meshStandardMaterial color="#100e16" />
      </mesh>
      <mesh position={[0, 1.22, 0.02]}>
        <planeGeometry args={[3.5, 0.48]} />
        <meshBasicMaterial map={header} toneMapped={false} />
      </mesh>
      {tiles.map((tile, index) => {
        const column = index % 5;
        const row = Math.floor(index / 5);
        return (
          <mesh
            key={tile.name}
            position={[-1.44 + column * 0.72, 0.62 - row * 0.58, 0.04]}
            onPointerOver={(event) => {
              event.stopPropagation();
              document.body.style.cursor = "pointer";
              setHover(index);
            }}
            onPointerOut={() => {
              document.body.style.cursor = "";
            }}
          >
            <planeGeometry args={[0.66, 0.52]} />
            <meshBasicMaterial
              ref={(material) => {
                mats.current[index] = material;
              }}
              map={tile.texture}
              color="#4e4860"
              toneMapped={false}
            />
          </mesh>
        );
      })}
      {quality === "high" ? (
        <spotLight ref={spot} position={[0, 1.8, 4.2]} angle={0.55} penumbra={0.8} intensity={6} distance={8} decay={2} color="#efe8ff" />
      ) : null}
      <object3D ref={target} position={[0, 0.2, 0]} />
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 0.1, 0.02]}>
          <boxGeometry args={[0.025, 2.5, 0.02]} />
          <meshBasicMaterial color="#8d6bff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Shell({ room, project, reduce, quality, strollRef, onEnter, onInspect, onNear }: Props) {
  const wall = useTexture("/experience/textures/corridor/wall_texture.webp");
  const floor = useTexture("/experience/textures/corridor/kawalekpodlogi.webp");
  const ceiling = useTexture("/experience/textures/corridor/ceiling_texture.webp");
  const desired = useRef(new THREE.Vector3(0, 1.55, -2));
  const look = useRef(new THREE.Vector3(0, 1.25, -5.6));
  const smoothedLook = useRef(new THREE.Vector3(0, 1.25, -5.6));
  const velocity = useRef(0);
  const exitWheel = useRef(0);
  const drag = useRef<{ y: number; z: number } | null>(null);
  const nearDoor = useRef<RoomId | null>(null);
  const toolkitFlag = useRef(false);
  const [nearest, setNearest] = useState<RoomId | null>(null);
  const [toolkitLive, setToolkitLive] = useState(false);
  const onNearRef = useRef(onNear);
  const onEnterRef = useRef(onEnter);
  const { camera, pointer } = useThree();

  useEffect(() => {
    onNearRef.current = onNear;
    onEnterRef.current = onEnter;
  }, [onEnter, onNear]);

  useLayoutEffect(() => {
    repeat(wall, 2.2, 1);
    repeat(floor, 2, 16);
    repeat(ceiling, 2, 10);
  }, [ceiling, floor, wall]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("[data-room-copy]")) return;
      event.preventDefault();
      let delta = event.deltaY;
      if (event.deltaMode === 1) delta *= 16;
      else if (event.deltaMode === 2) delta *= window.innerHeight;
      if (room !== "hub") {
        if (delta < 0) exitWheel.current += -delta;
        else exitWheel.current = 0;
        if (exitWheel.current > 140) {
          exitWheel.current = 0;
          onEnterRef.current("hub");
        }
        return;
      }
      exitWheel.current = 0;
      const atEnd = strollRef.current <= corridorTravel.end + 0.02;
      const atStart = strollRef.current >= corridorTravel.start - 0.02;
      if (delta > 0 && atEnd) {
        velocity.current = Math.max(0, velocity.current);
        return;
      }
      if (delta < 0 && atStart) {
        velocity.current = Math.min(0, velocity.current);
        return;
      }
      strollRef.current = THREE.MathUtils.clamp(strollRef.current - delta * 0.0045, corridorTravel.end, corridorTravel.start);
      velocity.current = THREE.MathUtils.clamp(velocity.current - delta * 0.022, -12, 12);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [room, strollRef]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const entered = room === "hub" ? null : DOORS.find((door) => door.id === room);
    if (!entered) {
      velocity.current *= Math.exp(-dt * 2.6);
      let next = strollRef.current + velocity.current * dt;
      if (next <= corridorTravel.end) {
        next = corridorTravel.end;
        if (velocity.current < 0) velocity.current = 0;
      } else if (next >= corridorTravel.start) {
        next = corridorTravel.start;
        if (velocity.current > 0) velocity.current = 0;
      }
      strollRef.current = next;
      const depth = (corridorTravel.start - next) / (corridorTravel.start - corridorTravel.end);
      const focus = THREE.MathUtils.smoothstep(depth, 0.78, 1);
      desired.current.set(pointer.x * 0.1, 1.55, next);
      look.current.set(pointer.x * 0.28, THREE.MathUtils.lerp(1.22, 1.4, focus) + pointer.y * 0.04, THREE.MathUtils.lerp(next - 3.5, TOOLKIT_Z + 0.3, focus));
      let closest: RoomId | null = null;
      let best = 2.35;
      for (const door of DOORS) {
        const distance = Math.abs(next - door.z);
        if (distance < best) {
          best = distance;
          closest = door.id;
        }
      }
      if (closest !== nearDoor.current) {
        nearDoor.current = closest;
        setNearest(closest);
        onNearRef.current(closest);
      }
      const approachingToolkit = next < -29.5;
      if (approachingToolkit !== toolkitFlag.current) {
        toolkitFlag.current = approachingToolkit;
        setToolkitLive(approachingToolkit);
      }
    } else {
      velocity.current = 0;
      const inset = quality === "low" ? 4.45 : 4.02;
      desired.current.set(entered.side * inset, quality === "low" ? 1.42 : 1.5, entered.z);
      look.current.set(entered.side * 7.55, quality === "low" ? 1.5 : 1.32, entered.z);
      if (nearDoor.current) {
        nearDoor.current = null;
        setNearest(null);
        onNearRef.current(null);
      }
    }
    const alpha = reduce ? 1 : 1 - Math.exp(-dt * 2.6);
    camera.position.lerp(desired.current, alpha);
    smoothedLook.current.lerp(look.current, alpha);
    camera.lookAt(smoothedLook.current);
  });

  const leftSegments: [number, number][] = [
    [0.48, 15.05],
    [-16, 14.1],
    [-31.5, 13.05],
    [-39.6, 3.3],
  ];
  const rightSegments: [number, number][] = [
    [-3.53, 23.05],
    [-24, 14.1],
    [-35.5, 5.05],
    [-39.6, 3.3],
  ];
  const activeDoor = DOORS.find((door) => door.id === room);

  return (
    <>
      <color attach="background" args={["#08070d"]} />
      <fog attach="fog" args={["#120c1c", 9, 32]} />
      <ambientLight intensity={quality === "low" ? 0.48 : quality === "medium" ? 0.28 : 0.2} />
      <hemisphereLight args={["#4a3d72", "#100e16", quality === "high" ? 0.38 : 0.22]} />
      {quality === "high" && room === "hub"
        ? DOORS.map((door) => (
            <GateLight key={door.id} position={[door.side * 0.2, 2.7, door.z + 1.2]} aim={[door.side * 2.05, 1.35, door.z]} />
          ))
        : null}
      {activeDoor ? <RoomLights door={activeDoor} quality={quality} /> : null}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -16]}
        onPointerDown={(event) => {
          if (room !== "hub") return;
          drag.current = { y: event.clientY, z: strollRef.current };
        }}
        onPointerMove={(event) => {
          if (!drag.current || room !== "hub") return;
          velocity.current = 0;
          const pulled = event.clientY - drag.current.y;
          strollRef.current = THREE.MathUtils.clamp(drag.current.z - pulled * 0.02, corridorTravel.end, corridorTravel.start);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <planeGeometry args={[4.6, 54]} />
        <meshStandardMaterial map={floor} color="#3c3850" metalness={0.62} roughness={0.28} />
      </mesh>
      <mesh position={[0, 3.02, -16]}>
        <boxGeometry args={[4.6, 0.08, 54]} />
        <meshStandardMaterial map={ceiling} color="#07060c" roughness={1} />
      </mesh>
      <mesh position={[0, 1.5, -40.55]}>
        <planeGeometry args={[4.5, 3.05]} />
        <meshStandardMaterial color="#07060c" />
      </mesh>
      {[-1.95, 1.95].map((x) => (
        <mesh key={`led-${x}`} position={[x, 2.9, -17]}>
          <boxGeometry args={[0.035, 0.02, 46]} />
          <meshBasicMaterial color="#7a5cff" toneMapped={false} />
        </mesh>
      ))}
      {[-1.7, 1.7].map((x) => (
        <mesh key={`floor-led-${x}`} position={[x, 0.025, -17]}>
          <boxGeometry args={[0.025, 0.012, 46]} />
          <meshBasicMaterial color="#5b3d99" toneMapped={false} />
        </mesh>
      ))}
      {[
        { x: -2.2, parts: leftSegments },
        { x: 2.2, parts: rightSegments },
      ].map((wallSide) =>
        wallSide.parts.map(([z, length]) => (
          <mesh key={`${wallSide.x}-${z}`} position={[wallSide.x, 1.5, z]} rotation={[0, wallSide.x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <planeGeometry args={[length, 3]} />
            <meshStandardMaterial map={wall} color="#2a2836" roughness={0.88} metalness={0.22} />
          </mesh>
        )),
      )}
      {DOORS.map((door) => (
        <Door
          key={door.id}
          door={door}
          open={room === door.id}
          near={room === "hub" && nearest === door.id}
          reduce={reduce}
          quality={quality}
          onEnter={onEnter}
        />
      ))}
      <LabRoom door={DOORS[0]} quality={quality} />
      <GalleryRoom door={DOORS[1]} project={project} quality={quality} onInspect={onInspect} />
      <ExperienceRoom door={DOORS[2]} quality={quality} />
      <ContactRoom door={DOORS[3]} open={room === "contact"} />
      <ToolkitWall quality={quality} live={toolkitLive} reduce={reduce} />
      <FloorGuide />
      <WallRibs reduce={reduce} />
      <CeilingBays />
      {quality === "low" ? null : <FloatingBits reduce={reduce} />}
      {quality === "high" ? <StatusHolo reduce={reduce} /> : null}
      {reduce ? null : <DataField quality={quality} reduce={reduce} />}
    </>
  );
}

export default function CorridorCanvas(props: Props) {
  return (
    <Canvas
      dpr={props.quality === "high" ? [1, 1.45] : props.quality === "medium" ? [1, 1.2] : [1, 1]}
      camera={{ position: [0, 1.55, -2], fov: props.quality === "low" ? 66 : 54, near: 0.08, far: 80 }}
      gl={{ antialias: props.quality !== "low", powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = props.quality === "low" ? 1.18 : 1.05;
      }}
    >
      <Suspense fallback={null}>
        <Shell {...props} />
      </Suspense>
    </Canvas>
  );
}

export const doorRooms = rooms.filter((item) => item.id !== "hub");
