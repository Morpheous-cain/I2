"use client";
import { useState, useCallback } from "react";

export type HeroVariant = "explore" | "build" | "deploy";

export interface PlanetState {
  variant: HeroVariant;
  isHovered: boolean;
  rotationSpeed: number;
  atmosphereIntensity: number;
  glowColor: string;
  label: string;
}

const VARIANT_CONFIG: Record<HeroVariant, Omit<PlanetState, "isHovered" | "variant">> = {
  explore: {
    rotationSpeed: 0.3,
    atmosphereIntensity: 0.6,
    glowColor: "#0ecbdb",
    label: "Explore",
  },
  build: {
    rotationSpeed: 0.8,
    atmosphereIntensity: 1.0,
    glowColor: "#3b82f6",
    label: "Build",
  },
  deploy: {
    rotationSpeed: 1.4,
    atmosphereIntensity: 1.4,
    glowColor: "#06b6d4",
    label: "Deploy",
  },
};

export function usePlanetState() {
  const [variant, setVariant] = useState<HeroVariant>("explore");
  const [isHovered, setIsHovered] = useState(false);

  const config = VARIANT_CONFIG[variant];

  const state: PlanetState = {
    variant,
    isHovered,
    ...config,
  };

  const cycleVariant = useCallback(() => {
    setVariant((v) => {
      if (v === "explore") return "build";
      if (v === "build") return "deploy";
      return "explore";
    });
  }, []);

  return {
    state,
    variant,
    setVariant,
    isHovered,
    setIsHovered,
    cycleVariant,
    variantConfig: VARIANT_CONFIG,
  };
}
