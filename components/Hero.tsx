
"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="h-screen flex items-center justify-center text-center">
      <motion.h1 initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}>
        Build Beyond Reality
      </motion.h1>
    </section>
  );
}
