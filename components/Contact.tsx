/**
 * Contact — form section.
 *
 * 3D↔UI integration:
 *  - Left panel parallaxes with mouse/rotation (useContactAnimation)
 *  - Submit button colour + glow track planet light + variant
 *  - Input focus ring colour matches variant accent
 *  - Tag badges pulse with atmosphere
 */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, Mail, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePlanet } from "@/context/PlanetContext";
import { useContactAnimation, useSectionHeaderAnimation } from "@/hooks/useSceneAnimations";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const { signals } = usePlanet();
  const { submitStyle, leftStyle } = useContactAnimation();
  const { skewStyle } = useSectionHeaderAnimation();
  const { h, s, l } = signals.accentColorRaw;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Network error");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  // Shared input className
  const inputClass =
    "glass border-white/8 bg-transparent text-foreground placeholder:text-muted-foreground/40 h-11 rounded-xl transition-all duration-300";

  return (
    <section id="contact" className="py-28 relative">
      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, hsl(${h} ${s}% ${l}% / ${(0.04 + signals.pulse * 0.03).toFixed(3)}) 0%, transparent 70%)`,
          filter: "blur(80px)",
          transition: "background 0.4s ease",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — heading + contact info, parallaxes with mouse */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
            style={leftStyle}
          >
            <div style={skewStyle}>
              <p
                className="font-mono text-xs tracking-[0.25em] uppercase mb-4"
                style={{ color: `hsl(${h} ${s}% ${l}% / 0.7)` }}
              >
                GET IN TOUCH
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-6">
                Ready to build{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 15)}%), hsl(${h} ${s}% ${l}%))` }}
                >
                  beyond?
                </span>
              </h2>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              Tell us about your project. Our solutions engineers respond within one business day with a tailored technical proposal.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: Mail,            label: "hello@immersicloud.io"           },
                { icon: MessageSquare,   label: "Live chat — avg. 4 min response" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all duration-300"
                    style={{
                      background: `hsl(${h} ${s}% ${l}% / ${(0.08 + signals.pulse * 0.06).toFixed(3)})`,
                      borderColor: `hsl(${h} ${s}% ${l}% / ${(0.18 + signals.lightFacing * 0.2).toFixed(2)})`,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: `hsl(${h} ${s}% ${Math.round(l + 10)}%)` }} />
                  </div>
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-8">
              {["Enterprise", "Startup", "Agency", "Research"].map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="glass font-mono text-xs"
                  style={{
                    borderColor: `hsl(${h} ${s}% ${l}% / ${(0.08 + signals.pulse * 0.08).toFixed(3)})`,
                    transition: "border-color 0.4s ease",
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass border rounded-2xl p-12 flex flex-col items-center text-center gap-4"
                style={{ borderColor: `hsl(${h} ${s}% ${l}% / 0.25)` }}
              >
                <CheckCircle2 className="w-12 h-12" style={{ color: `hsl(${h} ${s}% ${l}%)` }} />
                <h3 className="font-display text-xl font-bold">Message received</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Our team will reach out within one business day with next steps.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatus("idle")}
                  className="mt-2 border-white/10 hover:border-white/20"
                >
                  Send another
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass border border-white/5 rounded-2xl p-8 space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Name
                  </label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className={inputClass}
                    style={{ "--tw-ring-color": `hsl(${h} ${s}% ${l}% / 0.5)` } as React.CSSProperties}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" /> Message
                  </label>
                  <Textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project and goals..."
                    required
                    rows={5}
                    className="glass border-white/8 bg-transparent text-foreground placeholder:text-muted-foreground/40 rounded-xl resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 font-mono">Something went wrong. Please try again.</p>
                )}

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-12 text-background font-bold rounded-xl"
                  style={submitStyle}
                >
                  {status === "loading" ? (
                    <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Sending…</>
                  ) : (
                    <><Send className="mr-2 w-4 h-4" />Send Message</>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
