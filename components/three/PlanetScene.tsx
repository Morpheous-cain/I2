"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { usePlanet, VARIANT_CONFIG } from "@/context/PlanetContext";
import type { HeroVariant } from "@/context/PlanetContext";

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

// ─── Frame emitter ─────────────────────────────────────────────────────────

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
    const pulsePhase = Math.sin(elapsed * 0.8) * 0.5 + 0.5;
    emitFrame({ rotationY, lightIntensity, pulsePhase, elapsed });
  });

  return null;
}

// ─── Planet core — distinct visuals per variant ─────────────────────────────

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

  // Dramatically different colors per variant
  const colorMap: Record<HeroVariant, { base: string; emissive: string; distort: number }> = {
    explore: { base: "#0f4c6e", emissive: "#7dd3fc", distort: 0.10 }, // icy blue-white ocean
    build:   { base: "#7c2d0a", emissive: "#fb923c", distort: 0.20 }, // molten rocky surface
    deploy:  { base: "#3b0764", emissive: "#c084fc", distort: 0.15 }, // deep violet energy
  };
  const c = colorMap[variant];

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed * 0.15;
    }
  });

  return (
    <m.mesh ref={meshRef} castShadow>
      <m.sphereGeometry args={[2.2, 64, 64]} />
      <MeshDistortMaterial
        color={c.base}
        distort={isHovered ? c.distort + 0.06 : c.distort}
        speed={cfg.rotationSpeed * 0.8}
        roughness={0.55}
        metalness={0.4}
        emissive={c.emissive}
        emissiveIntensity={isHovered ? 0.18 : 0.09}
      />
    </m.mesh>
  );
}

// ─── Atmosphere ─────────────────────────────────────────────────────────────

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
      <m.sphereGeometry args={[2.58, 32, 32]} />
      <m.meshBasicMaterial
        color={color} transparent opacity={0.07 * intensity}
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
      <m.sphereGeometry args={[3.2, 32, 32]} />
      <m.meshBasicMaterial
        color={color} transparent opacity={0.03 * intensity}
        side={THREE.BackSide} depthWrite={false}
      />
    </m.mesh>
  );
}

// ─── Self-orbiting rings — each has its own tilt pivot group ───────────────
//
// Pattern: outer <group> tilts the orbital plane; inner mesh spins on Z.
// This means the ring sweeps a full orbit around the planet instead of
// just spinning in place. Speed + direction vary per ring for visual depth.

function OrbitalRing({
  radius,
  tiltX,
  tiltY,
  speed,       // radians/sec — positive = counter-clockwise from above
  color,
  opacity,
  thickness = 0.03,
}: {
  radius: number;
  tiltX: number;
  tiltY: number;
  speed: number;
  color: string;
  opacity: number;
  thickness?: number;
}) {
  const pivotRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (pivotRef.current) {
      // Rotate the pivot around world Y — this makes the ring orbit, not spin
      pivotRef.current.rotation.y += delta * speed;
    }
  });

  return (
    // Tilt group: sets the orbital plane inclination
    <m.group rotation={[tiltX, tiltY, 0]}>
      {/* Pivot group: rotates to simulate orbital motion */}
      <m.group ref={pivotRef}>
        <m.mesh>
          <m.ringGeometry args={[radius - thickness, radius + thickness, 180]} />
          <m.meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </m.mesh>
      </m.group>
    </m.group>
  );
}

// ─── Orbiting data nodes ────────────────────────────────────────────────────

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
        Math.sin(t * 0.4) * 0.5,
        Math.sin(t) * radius,
      );
    }
    if (dotRef.current) {
      dotRef.current.scale.setScalar(Math.sin(clock.getElapsedTime() * 3 + offset) * 0.25 + 0.8);
    }
  });

  return (
    <m.group ref={groupRef}>
      <m.mesh ref={dotRef}>
        <m.sphereGeometry args={[0.07, 8, 8]} />
        <m.meshBasicMaterial color={color} />
      </m.mesh>
    </m.group>
  );
}

// ─── Stars ──────────────────────────────────────────────────────────────────

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const count = 900;
    const pos = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r     = 18 + Math.random() * 32;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = Math.random() * 0.9 + 0.1;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) starsRef.current.rotation.y += delta * 0.004;
  });

  return (
    <m.points ref={starsRef}>
      <m.bufferGeometry>
        <m.bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <m.bufferAttribute attach="attributes-size"     count={sizes.length}          array={sizes}      itemSize={1} />
      </m.bufferGeometry>
      {/* White-ish stars for the snow/white accent */}
      <m.pointsMaterial color="#e0eeff" size={0.09} sizeAttenuation transparent opacity={0.75} />
    </m.points>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────

export default function PlanetScene() {
  const { variant, isHovered } = usePlanet();
  const planetMeshRef = useRef<THREE.Mesh>(null);

  const orbitColor = VARIANT_CONFIG[variant].glowColor;
  const ringOpacity = isHovered ? 0.4 : 0.28;

  // Variant-specific light colours
  const lightColorMap: Record<HeroVariant, string> = {
    explore: "#7dd3fc",
    build:   "#fb923c",
    deploy:  "#c084fc",
  };
  const lightColor = lightColorMap[variant];

  return (
    <>
      {/* Lighting */}
      <m.ambientLight intensity={0.12} />
      <m.directionalLight position={[8, 5, 5]} intensity={1.4} color="#ffffff" castShadow />
      <m.pointLight position={[-6, -3, -5]} intensity={0.5} color={lightColor} />
      <m.pointLight position={[0, 0, 7]} intensity={isHovered ? 0.7 : 0.35} color={lightColor} distance={14} />

      <FrameEmitter planetRef={planetMeshRef} variant={variant} />

      <Stars />
      <PlanetCore variant={variant} isHovered={isHovered} meshRef={planetMeshRef} />
      <AtmosphereGlow variant={variant} isHovered={isHovered} />
      <OuterGlow      variant={variant} isHovered={isHovered} />

      {/*
        Three rings, each on its own tilted orbital plane.
        tiltX = inclination from equatorial; speed varies direction + pace.
        All three rotate on pivotRef.rotation.y = full self-orbit.
      */}
      <OrbitalRing
        radius={3.5}
        tiltX={Math.PI * 0.08}
        tiltY={0}
        speed={0.55}          // fast inner ring
        color={orbitColor}
        opacity={ringOpacity}
        thickness={0.035}
      />
      <OrbitalRing
        radius={4.3}
        tiltX={-Math.PI * 0.3}
        tiltY={Math.PI * 0.1}
        speed={-0.32}         // counter-orbits
        color={orbitColor}
        opacity={ringOpacity * 0.65}
        thickness={0.025}
      />
      <OrbitalRing
        radius={5.2}
        tiltX={Math.PI * 0.45}
        tiltY={Math.PI * 0.2}
        speed={0.18}          // slow outer ring
        color={orbitColor}
        opacity={ringOpacity * 0.4}
        thickness={0.018}
      />

      {/* Data nodes */}
      <DataOrbit radius={3.5} speed={0.7}  offset={0}              color={orbitColor} />
      <DataOrbit radius={3.5} speed={0.7}  offset={Math.PI * 0.66} color={orbitColor} />
      <DataOrbit radius={3.5} speed={0.7}  offset={Math.PI * 1.33} color={orbitColor} />
      <DataOrbit radius={4.3} speed={-0.45} offset={Math.PI * 0.5}  color={orbitColor} />
      <DataOrbit radius={4.3} speed={-0.45} offset={Math.PI * 1.5}  color={orbitColor} />
    </>
  );
}