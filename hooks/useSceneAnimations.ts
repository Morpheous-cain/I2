/**
 * useSceneAnimations — per-component animation derivations.
 *
 * Returns ready-to-use style objects and class modifiers that each component
 * applies directly. All heavy math stays here, keeping JSX clean.
 *
 * Every returned style uses CSS custom properties so they can be overridden
 * by Tailwind utilities without specificity fights.
 */
"use client";

import { useMemo } from "react";
import { useSceneSignals, usePlanet, VARIANT_CONFIG } from "@/context/PlanetContext";
import type { HeroVariant } from "@/context/PlanetContext";

// ─── Navbar animations ────────────────────────────────────────────────────────

export function useNavbarAnimation(scrolled: boolean) {
  const { signals, variant } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;

  // Logo glow pulses with atmosphere breath when hero is visible
  const logoGlowIntensity = signals.heroVisible
    ? 0.15 + signals.pulse * 0.25
    : 0.08;

  const logoStyle = {
    boxShadow: `0 0 ${Math.round(logoGlowIntensity * 40)}px hsl(${h} ${s}% ${l}% / ${logoGlowIntensity.toFixed(2)})`,
    borderColor: `hsl(${h} ${s}% ${l}% / ${(0.2 + signals.lightFacing * 0.4).toFixed(2)})`,
    transition: "box-shadow 0.6s ease, border-color 0.6s ease",
  };

  // CTA button: colour shifts with variant, glow brightens when planet is lit
  const ctaGlow = scrolled
    ? signals.lightFacing * 0.5 + 0.15
    : signals.lightFacing * 0.35 + 0.08;

  const ctaStyle = {
    background: `hsl(${h} ${s}% ${l}%)`,
    boxShadow: `0 0 ${Math.round(ctaGlow * 48)}px hsl(${h} ${s}% ${l}% / ${ctaGlow.toFixed(2)})`,
    transition: "background 0.8s ease, box-shadow 0.4s ease",
  };

  // Nav links: colour brightens toward accent when hero is visible
  const linkOpacity = signals.heroVisible
    ? 0.55 + signals.lightFacing * 0.35
    : 0.7;

  return { logoStyle, ctaStyle, linkOpacity };
}

// ─── Hero text animations ─────────────────────────────────────────────────────

export function useHeroTextAnimation() {
  const { signals } = usePlanet();

  // Parallax: text layers drift opposite to mouse for depth
  // Deeper layers (headline) move more than shallower (eyebrow)
  const eyebrowStyle = {
    transform: `translate(${signals.parallaxX * 0.3}px, ${signals.parallaxY * 0.2}px)`,
    transition: "transform 0.1s linear",
    willChange: "transform",
  };

  const headlineStyle = {
    transform: `translate(${signals.parallaxX * 0.6}px, ${signals.parallaxY * 0.4}px)`,
    transition: "transform 0.1s linear",
    willChange: "transform",
  };

  const subStyle = {
    transform: `translate(${signals.parallaxX * 0.4}px, ${signals.parallaxY * 0.3}px)`,
    transition: "transform 0.1s linear",
    willChange: "transform",
  };

  // Gradient text follows light facing: brighter when lit side faces camera
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg,
      hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${Math.round(55 + signals.lightFacing * 20)}%) 0%,
      hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${Math.round(40 + signals.lightFacing * 15)}%) 40%,
      hsl(210 80% ${Math.round(60 + signals.lightFacing * 15)}%) 100%
    )`,
  };

  return { eyebrowStyle, headlineStyle, subStyle, gradientStyle };
}

// ─── Hero CTA button animations ───────────────────────────────────────────────

export function useButtonAnimation(variant: HeroVariant) {
  const { signals } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;

  // Primary button: glow intensity = planet light facing + pulse
  const glowBase = signals.lightFacing * 0.4 + signals.pulse * 0.15;
  const primaryStyle = {
    background: `hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 8)}%)`,
    boxShadow: [
      `0 0 ${Math.round(glowBase * 40)}px hsl(${h} ${s}% ${l}% / ${(glowBase * 0.8).toFixed(2)})`,
      `0 0 ${Math.round(glowBase * 80)}px hsl(${h} ${s}% ${l}% / ${(glowBase * 0.3).toFixed(2)})`,
      `inset 0 1px 0 hsl(${h} ${s}% ${Math.round(l + 20)}% / 0.3)`,
    ].join(", "),
    transition: "background 0.8s ease, box-shadow 0.3s ease",
    willChange: "box-shadow",
  };

  // Outline button: border subtly glows
  const outlineStyle = {
    borderColor: `hsl(${h} ${s}% ${l}% / ${(0.1 + signals.lightFacing * 0.25).toFixed(2)})`,
    transition: "border-color 0.6s ease",
  };

  return { primaryStyle, outlineStyle };
}

// ─── Planet ambient glow (behind the canvas) ─────────────────────────────────

export function usePlanetGlowAnimation() {
  const { signals, isHovered } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;
  const intensity = isHovered
    ? 0.35 + signals.pulse * 0.1
    : 0.2 + signals.pulse * 0.08;

  const glowStyle = {
    background: `radial-gradient(ellipse at ${50 + signals.rotationNorm * 8}% 50%,
      hsl(${h} ${s}% ${l}% / ${intensity.toFixed(2)}) 0%,
      transparent 70%)`,
    transition: "background 0.4s ease",
    willChange: "background",
  };

  // Outer ring that pulses
  const ringStyle = {
    opacity: 0.06 + signals.pulse * 0.06,
    transform: `scale(${1 + signals.pulse * 0.04}) rotate(${signals.rotationNorm * 5}deg)`,
    transition: "transform 0.2s ease, opacity 0.4s ease",
    willChange: "transform, opacity",
  };

  return { glowStyle, ringStyle };
}

// ─── Service card animations ──────────────────────────────────────────────────

/**
 * Returns per-card dynamic styles. Index determines phase offset so cards
 * don't all pulse in unison — they cascade like a wave from the planet.
 */
export function useCardAnimation(index: number) {
  const { signals } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;

  // Each card is phase-offset by its index for wave effect
  const phaseOffset = (index * Math.PI * 0.4) % (Math.PI * 2);
  const cardPulse = (Math.sin(signals.pulse * Math.PI * 2 + phaseOffset) * 0.5 + 0.5) * 0.12;

  // Parallax: distant cards (higher index) parallax more slowly
  const depth = 1 - index * 0.06;
  const cardParallaxX = signals.parallaxX * depth * 0.15;
  const cardParallaxY = signals.parallaxY * depth * 0.1;

  // Border reacts to light facing
  const borderOpacity = 0.05 + signals.lightFacing * 0.12 + cardPulse * 0.08;

  const cardStyle = {
    transform: `translate(${cardParallaxX}px, ${cardParallaxY}px)`,
    borderColor: `hsl(${h} ${s}% ${l}% / ${borderOpacity.toFixed(3)})`,
    transition: "border-color 0.5s ease, transform 0.12s linear",
    willChange: "transform",
  };

  // Icon background pulses with the planet atmosphere
  const iconStyle = {
    background: `hsl(${h} ${s}% ${l}% / ${(0.05 + cardPulse * 0.12).toFixed(3)})`,
    transition: "background 0.4s ease",
  };

  return { cardStyle, iconStyle };
}

// ─── Section header animations (scroll-linked) ────────────────────────────────

export function useSectionHeaderAnimation() {
  const { signals } = usePlanet();

  // Headers tilt very slightly against scroll direction for kinetic feel
  const skewStyle = {
    transform: `skewX(${(-signals.scrollSkew * 0.3).toFixed(2)}deg)`,
    transition: "transform 0.15s ease",
    willChange: "transform",
  };

  // Blur increases with scroll speed (motion blur feel)
  const blurStyle = {
    filter: signals.scrollBlur > 1
      ? `blur(${(signals.scrollBlur * 0.15).toFixed(1)}px)`
      : "none",
    transition: "filter 0.1s ease",
  };

  return { skewStyle, blurStyle };
}

// ─── Process step animations ──────────────────────────────────────────────────

export function useStepAnimation(index: number) {
  const { signals } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;

  // Steps light up in sequence based on scroll progress
  // Steps 0–3 activate at scroll 0.1, 0.2, 0.3, 0.4
  const activationThreshold = 0.08 + index * 0.07;
  const activationRaw = Math.max(0, Math.min(1,
    (signals.scrollBlur < 5 ? (signals.pulse * 0.1 + 0.5) : 0.5)
  ));

  // Number badge glows based on pulse + light
  const numberStyle = {
    color: `hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 15)}%)`,
    opacity: 0.5 + signals.lightFacing * 0.4,
    transition: "color 0.8s ease, opacity 0.4s ease",
  };

  // Connector line brightness follows scroll
  const connectorStyle = {
    background: `linear-gradient(to bottom,
      hsl(${h} ${s}% ${l}% / ${(0.1 + signals.lightFacing * 0.3).toFixed(2)}),
      hsl(${h} ${s}% ${l}% / 0.02))`,
  };

  return { numberStyle, connectorStyle, activationRaw };
}

// ─── Testimonial card animations ─────────────────────────────────────────────

export function useTestimonialAnimation(index: number) {
  const { signals } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;

  // Each testimonial has unique parallax depth
  const depth = 0.6 + (index % 3) * 0.15;
  const px = signals.parallaxX * depth * 0.08;
  const py = signals.parallaxY * depth * 0.06;

  const cardStyle = {
    transform: `translate(${px}px, ${py}px)`,
    transition: "transform 0.15s linear",
    willChange: "transform",
  };

  // Star colour tracks variant accent
  const starStyle = {
    color: `hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 12)}%)`,
    fill: `hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 12)}%)`,
    transition: "color 0.8s ease, fill 0.8s ease",
  };

  return { cardStyle, starStyle };
}

// ─── Contact form animations ──────────────────────────────────────────────────

export function useContactAnimation() {
  const { signals } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;

  // Input focus ring colour follows variant
  const inputFocusColor = `hsl(${h} ${s}% ${l}% / 0.5)`;

  // Submit button glow
  const submitGlow = signals.lightFacing * 0.45 + signals.pulse * 0.1;
  const submitStyle = {
    background: `hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 8)}%)`,
    boxShadow: `0 0 ${Math.round(submitGlow * 36)}px hsl(${h} ${s}% ${l}% / ${(submitGlow * 0.7).toFixed(2)})`,
    transition: "background 0.8s ease, box-shadow 0.3s ease",
  };

  // Left panel parallax
  const leftStyle = {
    transform: `translate(${signals.parallaxX * 0.2}px, ${signals.parallaxY * 0.15}px)`,
    transition: "transform 0.12s linear",
    willChange: "transform",
  };

  return { inputFocusColor, submitStyle, leftStyle };
}

// ─── Footer animation ─────────────────────────────────────────────────────────

export function useFooterAnimation() {
  const { signals } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;

  const logoStyle = {
    filter: `drop-shadow(0 0 ${Math.round(signals.pulse * 12)}px hsl(${h} ${s}% ${l}% / 0.4))`,
    transition: "filter 0.4s ease",
  };

  const statusDotStyle = {
    background: `hsl(142 71% ${Math.round(45 + signals.pulse * 10)}%)`,
    boxShadow: `0 0 ${Math.round(4 + signals.pulse * 6)}px hsl(142 71% 50% / 0.6)`,
    transition: "background 0.4s ease, box-shadow 0.4s ease",
  };

  return { logoStyle, statusDotStyle };
}
