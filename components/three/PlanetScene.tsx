"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetState } from "@/hooks/usePlanetState";

// R3F extends JSX intrinsic elements globally when Canvas is mounted.
// We cast to `any` here to avoid module-resolution ordering issues
// in TypeScript without a bundler-level global augmentation step.
const m = {
  mesh: "mesh" as any,
  group: "group" as any,
  points: "points" as any,
  sphereGeometry: "sphereGeometry" as any,
  bufferGeometry: "bufferGeometry" as any,
  ringGeometry: "ringGeometry" as any,
  bufferAttribute: "bufferAttribute" as any,
  meshBasicMaterial: "meshBasicMaterial" as any,
  pointsMaterial: "pointsMaterial" as any,
  ambientLight: "ambientLight" as any,
  directionalLight: "directionalLight" as any,
  pointLight: "pointLight" as any,
};

interface PlanetSceneProps {
  state: PlanetState;
}

function PlanetCore({ state }: { state: PlanetState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = state.isHovered ? state.rotationSpeed * 1.6 : state.rotationSpeed;

  const colorMap = {
    explore: { ocean: "#0ecbdb" },
    build: { ocean: "#3b82f6" },
    deploy: { ocean: "#06b6d4" },
  };
  const colors = colorMap[state.variant];

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed * 0.15;
    }
  });

  return (
    <m.mesh ref={meshRef} castShadow>
      <m.sphereGeometry args={[2.2, 64, 64]} />
      <MeshDistortMaterial
        color={colors.ocean}
        distort={state.isHovered ? 0.18 : 0.12}
        speed={state.rotationSpeed * 0.8}
        roughness={0.6}
        metalness={0.3}
        emissive={colors.ocean}
        emissiveIntensity={state.isHovered ? 0.12 : 0.06}
      />
    </m.mesh>
  );
}

function AtmosphereGlow({ state }: { state: PlanetState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const intensity = state.isHovered ? state.atmosphereIntensity * 1.3 : state.atmosphereIntensity;
  const color = new THREE.Color(state.glowColor);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.04;
      meshRef.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <m.mesh ref={meshRef}>
      <m.sphereGeometry args={[2.55, 32, 32]} />
      <m.meshBasicMaterial
        color={color}
        transparent
        opacity={0.06 * intensity}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </m.mesh>
  );
}

function OuterGlow({ state }: { state: PlanetState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const intensity = state.isHovered ? state.atmosphereIntensity * 1.2 : state.atmosphereIntensity;
  const color = new THREE.Color(state.glowColor);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 1.2) * 0.03 + 0.97;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <m.mesh ref={meshRef}>
      <m.sphereGeometry args={[3.0, 32, 32]} />
      <m.meshBasicMaterial
        color={color}
        transparent
        opacity={0.025 * intensity}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </m.mesh>
  );
}

function OrbitalRing({
  radius,
  tilt,
  speed,
  color,
  opacity,
}: {
  radius: number;
  tilt: number;
  speed: number;
  color: string;
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <m.mesh ref={meshRef} rotation={[tilt, 0, 0]}>
      <m.ringGeometry args={[radius - 0.03, radius + 0.03, 128]} />
      <m.meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </m.mesh>
  );
}

function DataOrbit({
  radius,
  speed,
  offset,
  color,
}: {
  radius: number;
  speed: number;
  offset: number;
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * speed + offset;
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.z = Math.sin(t) * radius;
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.3;
    }
    if (dotRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 3 + offset) * 0.2 + 0.8;
      dotRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <m.group ref={groupRef}>
      <m.mesh ref={dotRef}>
        <m.sphereGeometry args={[0.06, 8, 8]} />
        <m.meshBasicMaterial color={color} />
      </m.mesh>
    </m.group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = Math.random() * 0.8 + 0.1;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <m.points ref={starsRef}>
      <m.bufferGeometry>
        <m.bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <m.bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </m.bufferGeometry>
      <m.pointsMaterial
        color="#a0d8ef"
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </m.points>
  );
}

export default function PlanetScene({ state }: PlanetSceneProps) {
  const orbitColors: Record<string, string> = {
    explore: "#0ecbdb",
    build: "#3b82f6",
    deploy: "#06b6d4",
  };
  const orbitColor = orbitColors[state.variant];
  const ringOpacity = state.isHovered ? 0.35 : 0.22;

  return (
    <>
      <m.ambientLight intensity={0.15} />
      <m.directionalLight position={[8, 5, 5]} intensity={1.2} color="#ffffff" castShadow />
      <m.pointLight position={[-5, -3, -5]} intensity={0.4} color={orbitColor} />
      <m.pointLight
        position={[0, 0, 6]}
        intensity={state.isHovered ? 0.6 : 0.3}
        color={orbitColor}
        distance={12}
      />

      <Stars />
      <PlanetCore state={state} />
      <AtmosphereGlow state={state} />
      <OuterGlow state={state} />

      <OrbitalRing radius={3.4} tilt={Math.PI * 0.12} speed={0.08} color={orbitColor} opacity={ringOpacity} />
      <OrbitalRing radius={4.1} tilt={-Math.PI * 0.22} speed={-0.05} color={orbitColor} opacity={ringOpacity * 0.65} />
      <OrbitalRing radius={5.0} tilt={Math.PI * 0.35} speed={0.03} color={orbitColor} opacity={ringOpacity * 0.4} />

      <DataOrbit radius={3.4} speed={0.6} offset={0} color={orbitColor} />
      <DataOrbit radius={3.4} speed={0.6} offset={Math.PI * 0.66} color={orbitColor} />
      <DataOrbit radius={3.4} speed={0.6} offset={Math.PI * 1.33} color={orbitColor} />
      <DataOrbit radius={4.1} speed={-0.4} offset={Math.PI * 0.5} color={orbitColor} />
      <DataOrbit radius={4.1} speed={-0.4} offset={Math.PI * 1.5} color={orbitColor} />
    </>
  );
}
