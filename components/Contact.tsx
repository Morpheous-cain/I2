"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, Mail, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

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

  return (
    <section id="contact" className="py-28 relative">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            <p className="font-mono text-xs tracking-[0.25em] text-cyan-400/70 uppercase mb-4">
              GET IN TOUCH
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-6">
              Ready to build{" "}
              <span className="text-gradient">beyond?</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              Tell us about your project. Our solutions engineers respond within
              one business day with a tailored technical proposal.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: Mail, label: "hello@immersicloud.io" },
                { icon: MessageSquare, label: "Live chat — avg. 4 min response" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
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
                  className="glass border border-white/8 text-muted-foreground font-mono text-xs"
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
                className="glass border border-cyan-500/20 rounded-2xl p-12 flex flex-col items-center text-center gap-4"
              >
                <CheckCircle2 className="w-12 h-12 text-cyan-400" />
                <h3 className="font-display text-xl font-bold">Message received</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Our team will reach out within one business day with next steps.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatus("idle")}
                  className="mt-2 border-white/10 hover:border-cyan-500/30"
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
                    className="glass border-white/8 focus:border-cyan-500/40 bg-transparent text-foreground placeholder:text-muted-foreground/40 h-11 rounded-xl"
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
                    className="glass border-white/8 focus:border-cyan-500/40 bg-transparent text-foreground placeholder:text-muted-foreground/40 h-11 rounded-xl"
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
                    className="glass border-white/8 focus:border-cyan-500/40 bg-transparent text-foreground placeholder:text-muted-foreground/40 rounded-xl resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 font-mono">
                    Something went wrong. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-background font-bold rounded-xl glow-cyan-sm transition-all duration-300"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      Send Message
                    </>
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
