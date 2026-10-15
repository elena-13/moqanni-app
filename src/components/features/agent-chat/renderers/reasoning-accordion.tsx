'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface ReasoningAccordionProps {
  agentName: string;
  thought: string;
  isThinking: boolean;
}

export function ReasoningAccordion({
  agentName,
  thought,
  isThinking,
}: ReasoningAccordionProps) {
  const [open, setOpen] = useState(isThinking);
  const [wasThinking, setWasThinking] = useState(isThinking);

  if (wasThinking !== isThinking) {
    setWasThinking(isThinking);
    if (!isThinking) setOpen(false);
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-md border border-white/5 bg-zinc-950/40"
    >
      <CollapsibleTrigger className="group flex w-full items-center gap-1.5 px-3 py-2 text-xs text-zinc-500 transition-colors hover:text-zinc-300">
        <ChevronRight className="size-3 transition-transform group-data-panel-open:rotate-90" />
        <span className={cn(isThinking && 'animate-pulse text-emerald-400/80')}>
          {isThinking ? `${agentName} is thinking...` : 'Reasoning'}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <div className="px-3 pb-3 text-xs leading-relaxed whitespace-pre-wrap text-zinc-500">
          {thought}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
