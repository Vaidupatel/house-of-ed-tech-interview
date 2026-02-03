import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <Features />
      <CTA />
    </main>
  );
}
