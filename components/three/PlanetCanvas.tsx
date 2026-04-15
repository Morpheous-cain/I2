/**
 * PlanetCanvas — R3F Canvas wrapper.
 *
 * Reads isHovered / setIsHovered / cycleVariant from PlanetContext directly,
 * removing the need for prop-drilling from Hero.
 * PlanetScene also reads from context, so no props flow into the Canvas at all.
 */
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import PlanetScene from "./PlanetScene";
import { usePlanet } from "@/context/PlanetContext";

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
    </div>
  );
}

export default function PlanetCanvas() {
  const { setIsHovered, cycleVariant } = usePlanet();

  return (
    <div
      className="w-full h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={cycleVariant}
      role="button"
      aria-label="Click to cycle planet mode"
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <PlanetScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI * 0.3}
            maxPolarAngle={Math.PI * 0.7}
            rotateSpeed={0.4}
            enableDamping
            dampingFactor={0.06}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
