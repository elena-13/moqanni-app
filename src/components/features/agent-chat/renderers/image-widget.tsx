"use client";

import { AgentBlock } from "@/store/chat-store";
import { ImageIcon, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// 1. Описываем интерфейс того, что мы ожидаем внутри block.data
interface ImageWidgetData {
  urls?: string[];
}

export function ImageWidget({ block }: { block: AgentBlock }) {
  // 2. Безопасно приводим block.data к нашему интерфейсу
  const data = block.data as ImageWidgetData | undefined;

  // Если ссылок нет, используем массив чисел для заглушек
  const images = data?.urls || [1, 2, 3, 4];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/5 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
        <ImageIcon className="h-4 w-4" />
        <span>{block.agentName || "Designer Agent"}</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-400">
          {block.task || "Generated Visuals"}
        </span>
      </div>

      <div className="grid grid-cols-2 mt-2 gap-2 sm:grid-cols-4">
        {/* 3. Меняем тип img с any на string | number (ссылка или заглушка) */}
        {images.map((img: string | number, index: number) => {
          const isSelected = selectedIndex === index;

          return (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-video cursor-pointer overflow-hidden rounded-md border transition-all ${
                isSelected
                  ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "border-white/10 hover:border-emerald-500/50"
              } bg-zinc-800`}
            >
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                <span className="text-[10px] uppercase tracking-wider">
                  Option {index + 1}
                </span>
              </div>

              {isSelected && (
                <div className="absolute bottom-2 right-2 rounded-full bg-zinc-900/80 p-0.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
