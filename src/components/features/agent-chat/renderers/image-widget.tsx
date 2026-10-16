'use client';

import { AgentBlock } from '@/store/chat-store';
import { ImageIcon, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface ImageWidgetData {
  urls?: string[];
}

export function ImageWidget({ block }: { block: AgentBlock }) {
  const data = block.data as ImageWidgetData | undefined;

  // Without URLs, numbers render as placeholder tiles.
  const images = data?.urls || [1, 2, 3, 4];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-primary">
        <ImageIcon className="h-4 w-4" />
        <span>{block.agentName || 'Designer Agent'}</span>
        <span className="text-muted-foreground/50">•</span>
        <span className="text-muted-foreground">
          {block.task || 'Generated Visuals'}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {images.map((img: string | number, index: number) => {
          const isSelected = selectedIndex === index;

          return (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-video cursor-pointer overflow-hidden rounded-md border transition-all ${
                isSelected
                  ? 'border-primary'
                  : 'border-border hover:border-primary/50'
              } bg-muted`}
            >
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                <span className="text-[10px] tracking-wider uppercase">
                  Option {index + 1}
                </span>
              </div>

              {isSelected && (
                <div className="absolute right-2 bottom-2 bg-card/80 p-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
