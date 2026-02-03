const features = [
  {
    title: "Upload Any Document",
    desc: "PDF, TXT, DOCX — we index everything using vector embeddings.",
  },
  {
    title: "Context-Aware Answers",
    desc: "Powered by Retrieval-Augmented Generation for accurate responses.",
  },
  {
    title: "Secure & Isolated",
    desc: "Each user gets isolated embeddings and private knowledge base.",
  },
  {
    title: "Easy API & Widget",
    desc: "Embed the chatbot into your product with a few lines of code.",
  },
];

export default function Features() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <h2 className="text-4xl font-semibold text-center mb-16">
        Why Choose Our RAG Platform?
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-gray-800 bg-gray-900"
          >
            <h3 className="text-xl font-medium mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
