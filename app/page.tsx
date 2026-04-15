/**
 * Root page — wraps everything in PlanetProvider so all components share
 * the same 3D↔UI state bus without prop drilling.
 */
import { PlanetProvider } from "@/context/PlanetContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <PlanetProvider>
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <Services />
        <Process />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </PlanetProvider>
  );
}
