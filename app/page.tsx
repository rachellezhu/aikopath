"use client"
import { useState } from "react"
import Markdown from "react-markdown"

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const trimmedInput = input.trim();
  const splitInput = trimmedInput.split(" ");

  const generate = async () => {
    if (!input) return;
    setLoading(true);

    const res = await fetch("/api/", {
      method: "POST",
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-6 py-10">

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mb-4">
            AikoPath
          </h1>

          <p className="text-gray-400 mb-6 leading-relaxed">
            Meet Aiko, your AI career mentor who helps you plan your learning journey step-by-step.
          </p>

          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <textarea
              className="w-full bg-transparent outline-none resize-none text-sm mb-3"
              rows={3}
              placeholder="I want to become a backend engineer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={generate}
              className={`w-full ${loading || splitInput.length < 2 || trimmedInput.length < 10 ? "bg-gray-600 text-gray-200" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"} transition px-4 py-2 rounded-lg font-medium`}
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>
          </div>
        </div>

        <div>
          <img
            src="/aiko-banner.png"
            className="w-full rounded-xl shadow-lg"
          />
        </div>

      </section>

      {result && (
        <section className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-teal-300">
            Your AI-Generated Roadmap
          </h2>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="prose prose-invert prose-headings:text-teal-300 prose-strong:text-green-400 prose-a:text-blue-400 leading-relaxed">
              <Markdown>{result}</Markdown>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}