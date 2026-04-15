/**
 * Footer — reactive to planet pulse and variant.
 *
 * 3D↔UI integration:
 *  - Logo drop-shadow pulses with atmosphere breath (useFooterAnimation)
 *  - Status dot colour + glow track pulse phase
 *  - Brand text gradient tracks variant accent
 */
"use client";

import { motion } from "framer-motion";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";
import { usePlanet } from "@/context/PlanetContext";
import { useFooterAnimation } from "@/hooks/useSceneAnimations";

const links = {
  Platform:   ["Edge Delivery", "Spatial APIs", "AI Rendering", "Enterprise Security"],
  Company:    ["About", "Blog", "Careers", "Press"],
  Developers: ["Documentation", "SDK Reference", "Status Page", "Changelog"],
  Legal:      ["Privacy Policy", "Terms of Service", "Cookie Policy", "DPA"],
};

export default function Footer() {
  const { signals } = usePlanet();
  const { logoStyle, statusDotStyle } = useFooterAnimation();
  const { h, s, l } = signals.accentColorRaw;

  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  background: `hsl(${h} ${s}% ${l}% / 0.1)`,
                  border: `1px solid hsl(${h} ${s}% ${l}% / 0.3)`,
                  ...logoStyle,
                }}
              >
                <Zap className="w-4 h-4" style={{ color: `hsl(${h} ${s}% ${l}%)` }} />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Immersi
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg,
                      hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 12)}%),
                      hsl(${h} ${s}% ${l}%))`,
                    transition: "background-image 0.8s ease",
                  }}
                >
                  Cloud
                </span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Cloud-native infrastructure for immersive digital experiences.
            </p>
            <div className="flex gap-3 mt-5">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/15 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-4">
                {category}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} ImmersiCloud, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={statusDotStyle}
            />
            <span className="text-xs font-mono text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
