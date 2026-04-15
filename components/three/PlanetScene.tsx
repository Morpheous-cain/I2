/**
 * PlanetScene — Three.js scene rendered inside R3F Canvas.
 *
 * Responsibilities:
 *  1. Render planet, atmosphere, rings, data orbits, stars.
 *  2. Push SceneFrame data to PlanetContext every R3F frame via emitFrame().
 *     This is the 3D→UI direction of the bidirectional pipeline.
 *
 * emitFrame() is called inside useFrame() which runs outside React's render
 * cycle — it writes to a ref in PlanetContext, never triggering re-renders.
 * A separate rAF loop in PlanetContext reads that ref and derives CSS signals.
 */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { usePlanet, VARIANT_CONFIG } from "@/context/PlanetContext";
import type { HeroVariant } from "@/context/PlanetContext";

// JSX element aliases — R3F extends intrinsics at runtime; we bypass TS here.
const m = {
  mesh:              "mesh"              as any,
  group:             "group"             as any,
  points:            "points"            as any,
  sphereGeometry:    "sphereGeometry"    as any,
  bufferGeometry:    "bufferGeometry"    as any,
  ringGeometry:      "ringGeometry"      as any,
  bufferAttribute:   "bufferAttribute"   as any,
  meshBasicMaterial: "meshBasicMaterial" as any,
  pointsMaterial:    "pointsMaterial"    as any,
  ambientLight:      "ambientLight"      as any,
  directionalLight:  "directionalLight"  as any,
  pointLight:        "pointLight"        as any,
};

// ─── Scene frame emitter ──────────────────────────────────────────────────────

/**
 * Invisible component that lives inside Canvas.
 * Reads planet rotation + computes derived frame data, then pushes it to
 * PlanetContext every R3F tick via emitFrame (a ref-write, zero React cost).
 */
function FrameEmitter({
  planetRef,
  variant,
}: {
  planetRef: React.RefObject<THREE.Mesh>;
  variant: HeroVariant;
}) {
  const { emitFrame } = usePlanet();
  const startTime = useRef(performance.now());

  useFrame(() => {
    if (!planetRef.current) return;
    const elapsed = (performance.now() - startTime.current) / 1000;
    const rotationY = planetRef.current.rotation.y;
    const lightIntensity = VARIANT_CONFIG[variant].atmosphereIntensity;
    // Slow sine 0–1 for atmosphere breathing
    const pulsePhase = Math.sin(elapsed * 0.8) * 0.5 + 0.5;

    emitFrame({ rotationY, lightIntensity, pulsePhase, elapsed });
  });

  return null;
}

// ─── Planet core ──────────────────────────────────────────────────────────────

function PlanetCore({
  variant,
  isHovered,
  meshRef,
}: {
  variant: HeroVariant;
  isHovered: boolean;
  meshRef: React.RefObject<THREE.Mesh>;
}) {
  const cfg = VARIANT_CONFIG[variant];
  const speed = isHovered ? cfg.rotationSpeed * 1.6 : cfg.rotationSpeed;

  const colorMap: Record<HeroVariant, string> = {
    explore: "#0ecbdb",
    build:   "#3b82f6",
    deploy:  "#06b6d4",
  };

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed * 0.15;
    }
  });

  return (
    <m.mesh ref={meshRef} castShadow>
      <m.sphereGeometry args={[2.2, 64, 64]} />
      <MeshDistortMaterial
        color={colorMap[variant]}
        distort={isHovered ? 0.18 : 0.12}
        speed={cfg.rotationSpeed * 0.8}
        roughness={0.6}
        metalness={0.3}
        emissive={colorMap[variant]}
        emissiveIntensity={isHovered ? 0.12 : 0.06}
      />
    </m.mesh>
  );
}

// ─── Atmosphere ───────────────────────────────────────────────────────────────

function AtmosphereGlow({ variant, isHovered }: { variant: HeroVariant; isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cfg = VARIANT_CONFIG[variant];
  const intensity = isHovered ? cfg.atmosphereIntensity * 1.3 : cfg.atmosphereIntensity;
  const color = new THREE.Color(cfg.glowColor);

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
        color={color} transparent opacity={0.06 * intensity}
        side={THREE.BackSide} depthWrite={false}
      />
    </m.mesh>
  );
}

function OuterGlow({ variant, isHovered }: { variant: HeroVariant; isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cfg = VARIANT_CONFIG[variant];
  const intensity = isHovered ? cfg.atmosphereIntensity * 1.2 : cfg.atmosphereIntensity;
  const color = new THREE.Color(cfg.glowColor);

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
        color={color} transparent opacity={0.025 * intensity}
        side={THREE.BackSide} depthWrite={false}
      />
    </m.mesh>
  );
}

// ─── Orbital rings ────────────────────────────────────────────────────────────

function OrbitalRing({
  radius, tilt, speed, color, opacity,
}: { radius: number; tilt: number; speed: number; color: string; opacity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => { if (meshRef.current) meshRef.current.rotation.z += delta * speed; });
  return (
    <m.mesh ref={meshRef} rotation={[tilt, 0, 0]}>
      <m.ringGeometry args={[radius - 0.03, radius + 0.03, 128]} />
      <m.meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
    </m.mesh>
  );
}

// ─── Orbiting data nodes ──────────────────────────────────────────────────────

function DataOrbit({
  radius, speed, offset, color,
}: { radius: number; speed: number; offset: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const dotRef   = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * speed + offset;
      groupRef.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t * 0.3) * 0.3,
        Math.sin(t) * radius,
      );
    }
    if (dotRef.current) {
      dotRef.current.scale.setScalar(Math.sin(clock.getElapsedTime() * 3 + offset) * 0.2 + 0.8);
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

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r     = 18 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = Math.random() * 0.8 + 0.1;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((_, delta) => { if (starsRef.current) starsRef.current.rotation.y += delta * 0.005; });

  return (
    <m.points ref={starsRef}>
      <m.bufferGeometry>
        <m.bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <m.bufferAttribute attach="attributes-size"     count={sizes.length}          array={sizes}      itemSize={1} />
      </m.bufferGeometry>
      <m.pointsMaterial color="#a0d8ef" size={0.08} sizeAttenuation transparent opacity={0.7} />
    </m.points>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function PlanetScene() {
  // Read from context — this component lives inside R3F Canvas
  const { variant, isHovered } = usePlanet();

  // Stable ref so FrameEmitter can read current rotation without prop drilling
  const planetMeshRef = useRef<THREE.Mesh>(null);

  const colorMap: Record<HeroVariant, string> = {
    explore: "#0ecbdb",
    build:   "#3b82f6",
    deploy:  "#06b6d4",
  };
  const orbitColor  = colorMap[variant];
  const ringOpacity = isHovered ? 0.35 : 0.22;

  return (
    <>
      {/* Lighting */}
      <m.ambientLight intensity={0.15} />
      <m.directionalLight position={[8, 5, 5]} intensity={1.2} color="#ffffff" castShadow />
      <m.pointLight position={[-5, -3, -5]} intensity={0.4} color={orbitColor} />
      <m.pointLight position={[0, 0, 6]} intensity={isHovered ? 0.6 : 0.3} color={orbitColor} distance={12} />

      {/* Frame telemetry emitter (invisible, reads planetMeshRef) */}
      <FrameEmitter planetRef={planetMeshRef} variant={variant} />

      {/* Scene objects */}
      <Stars />
      <PlanetCore variant={variant} isHovered={isHovered} meshRef={planetMeshRef} />
      <AtmosphereGlow variant={variant} isHovered={isHovered} />
      <OuterGlow      variant={variant} isHovered={isHovered} />

      {/* Rings */}
      <OrbitalRing radius={3.4} tilt={Math.PI * 0.12}  speed={0.08}  color={orbitColor} opacity={ringOpacity} />
      <OrbitalRing radius={4.1} tilt={-Math.PI * 0.22} speed={-0.05} color={orbitColor} opacity={ringOpacity * 0.65} />
      <OrbitalRing radius={5.0} tilt={Math.PI * 0.35}  speed={0.03}  color={orbitColor} opacity={ringOpacity * 0.4} />

      {/* Data nodes */}
      <DataOrbit radius={3.4} speed={0.6}  offset={0}              color={orbitColor} />
      <DataOrbit radius={3.4} speed={0.6}  offset={Math.PI * 0.66} color={orbitColor} />
      <DataOrbit radius={3.4} speed={0.6}  offset={Math.PI * 1.33} color={orbitColor} />
      <DataOrbit radius={4.1} speed={-0.4} offset={Math.PI * 0.5}  color={orbitColor} />
      <DataOrbit radius={4.1} speed={-0.4} offset={Math.PI * 1.5}  color={orbitColor} />
    </>
  );
}
