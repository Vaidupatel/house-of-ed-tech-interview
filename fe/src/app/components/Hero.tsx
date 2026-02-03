"use client";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-32">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
        Chat With Your Data.
        <br />
        <span className="text-indigo-400">Powered by RAG AI</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-300">
        Upload documents, connect knowledge sources, and deploy an intelligent
        chatbot trained on your own data — in minutes.
      </p>

      <div className="mt-10 flex gap-4">
        <button
          onClick={() => handleNavigate("/signup")}
          className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer"
        >
          Get Started Free
        </button>
      </div>
    </section>
  );
}
