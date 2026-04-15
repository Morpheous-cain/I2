"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import PlanetScene from "./PlanetScene";
import type { PlanetState } from "@/hooks/usePlanetState";

interface PlanetCanvasProps {
  state: PlanetState;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
    </div>
  );
}

export default function PlanetCanvas({
  state,
  onHoverStart,
  onHoverEnd,
  onClick,
}: PlanetCanvasProps) {
  return (
    <div
      className="w-full h-full cursor-pointer"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <PlanetScene state={state} />
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
