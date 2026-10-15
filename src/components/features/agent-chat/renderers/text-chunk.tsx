"use client";

import { AgentBlock } from "@/store/chat-store";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function TextChunk({ block }: { block: AgentBlock }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/5 bg-zinc-900/50 p-4">
      {/* Заголовок агента и статус */}
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
        <span className="text-emerald-400">{block.agentName || "Agent"}</span>
        <span className="text-zinc-600">•</span>
        <span>{block.task}</span>

        <div className="ml-auto">
          {block.status === "running" && (
            <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
          )}
          {block.status === "completed" && (
            <CheckCircle2 className="h-3 w-3 text-emerald-500/50" />
          )}
          {block.status === "error" && (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>

      {/* Текст ответа */}
      <div className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
        {block.text}
        {block.status === "running" && (
          <span className="ml-1 inline-block h-3 w-2 animate-pulse bg-emerald-500/80" />
        )}
      </div>

      {/* Ошибка, если есть */}
      {block.error && (
        <div className="mt-2 text-xs text-red-400">{block.error}</div>
      )}
    </div>
  );
}
