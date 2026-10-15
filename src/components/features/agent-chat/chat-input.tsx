// Поле ввода (с логикой блокировки во время генерации)
"use client";

import { useState } from "react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useChatStore } from "@/store/chat-store";
import { StopCircle, Send } from "lucide-react";

export function ChatInput() {
  const [prompt, setPrompt] = useState("");
  const { startStream, abort } = useChatStream();

  // Проверяем, генерирует ли какой-то блок прямо сейчас
  const isGenerating = useChatStore((s) =>
    Object.values(s.blocks).some((b) => b.status === "running"),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    startStream(prompt);
    setPrompt("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-6 left-1/2 w-full max-w-3xl -translate-x-1/2 px-4"
    >
      <div className="relative flex items-center rounded-xl border border-white/10 bg-zinc-900/80 p-2 shadow-2xl backdrop-blur-md focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          type="text"
          placeholder="Describe what to build or change..."
          className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
        />

        {isGenerating ? (
          <button
            type="button"
            onClick={abort}
            className="ml-2 flex items-center gap-1 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-zinc-700"
          >
            <StopCircle className="h-4 w-4" /> Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="ml-2 flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600"
          >
            <Send className="h-4 w-4" /> Build
          </button>
        )}
      </div>
    </form>
  );
}
