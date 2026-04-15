"use client";
import { motion } from "framer-motion";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";

const links = {
  Platform: ["Edge Delivery", "Spatial APIs", "AI Rendering", "Enterprise Security"],
  Company: ["About", "Blog", "Careers", "Press"],
  Developers: ["Documentation", "SDK Reference", "Status Page", "Changelog"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "DPA"],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all duration-300">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Immersi<span className="text-gradient">Cloud</span>
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
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
