/**
 * Navbar — reactive to planet state.
 *
 * 3D↔UI integration:
 *  - Logo border + glow pulse with atmosphere breath (useNavbarAnimation)
 *  - "Get Started" CTA colour tracks active variant accent
 *  - CTA glow intensifies when planet lit side faces camera
 *  - Nav link opacity floats with lightFacing value
 */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlanet } from "@/context/PlanetContext";
import { useNavbarAnimation } from "@/hooks/useSceneAnimations";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services",     href: "#services"     },
  { label: "Process",      href: "#process"      },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact",      href: "#contact"      },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signals } = usePlanet();
  const { logoStyle, ctaStyle, linkOpacity } = useNavbarAnimation(scrolled);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "glass-strong py-3 shadow-lg shadow-black/20" : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo — border + glow track atmosphere pulse */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                background: `hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${signals.accentColorRaw.l}% / 0.1)`,
                ...logoStyle,
              }}
            >
              <Zap className="w-4 h-4" style={{ color: signals.accentColor }} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Immersi
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg,
                    hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${Math.round(signals.accentColorRaw.l + signals.lightFacing * 15)}%),
                    hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${signals.accentColorRaw.l}%))`,
                  transition: "background-image 0.8s ease",
                }}
              >
                Cloud
              </span>
            </span>
          </a>

          {/* Desktop nav — link opacity tracks planet light */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-all duration-300"
                style={{
                  color: `hsl(210 40% 98% / ${linkOpacity.toFixed(2)})`,
                  transition: "color 0.4s ease",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA — colour + glow track planet state */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button
              size="sm"
              className="text-background font-semibold"
              style={ctaStyle}
            >
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-4 right-4 z-40 glass-strong rounded-2xl p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 border-b border-white/5 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                <Button size="sm" className="w-full text-background font-semibold" style={ctaStyle}>
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
