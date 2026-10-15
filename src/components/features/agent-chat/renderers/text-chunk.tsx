'use client';

import { AgentBlock } from '@/store/chat-store';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { splitAgentOutput } from '@/components/features/agent-chat/split-agent-output';
import { ReasoningAccordion } from './reasoning-accordion';
import { AgentAnswer } from './agent-answer';

export function TextChunk({ block }: { block: AgentBlock }) {
  const agentName = block.agentName || 'Agent';
  const isRunning = block.status === 'running';
  const { thought, answer, hasFinalAnswer } = splitAgentOutput(
    block.text,
    isRunning,
  );
  const isThinking = isRunning && thought !== null && !hasFinalAnswer;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/5 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
        <span className="text-emerald-400">{agentName}</span>
        <span className="text-zinc-600">•</span>
        <span>{block.task}</span>

        <div className="ml-auto">
          {isRunning && (
            <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
          )}
          {block.status === 'completed' && (
            <CheckCircle2 className="h-3 w-3 text-emerald-500/50" />
          )}
          {block.status === 'error' && (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>

      {thought !== null && (
        <ReasoningAccordion
          agentName={agentName}
          thought={thought}
          isThinking={isThinking}
        />
      )}

      {answer && <AgentAnswer text={answer} />}

      {isRunning && !isThinking && (
        <span className="inline-block h-3 w-2 animate-pulse bg-emerald-500/80" />
      )}

      {block.error && (
        <div className="mt-2 text-xs text-red-400">{block.error}</div>
      )}
    </div>
  );
}
