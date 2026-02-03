"use client";
import { useRouter } from "next/navigation";
export default function CTA() {
  const router = useRouter();
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  return (
    <section className="px-6 py-24 text-center">
      <h2 className="text-4xl font-bold">
        Build Your AI Knowledge Assistant Today
      </h2>
      <p className="mt-4 text-lg opacity-90">
        No credit card required. Scale when you’re ready.
      </p>

      <button
        onClick={() => handleNavigate("/signup")}
        className="mt-8 px-8 py-4 bg-gray-900 rounded-lg text-white cursor-pointer"
      >
        Start Building
      </button>
    </section>
  );
}
