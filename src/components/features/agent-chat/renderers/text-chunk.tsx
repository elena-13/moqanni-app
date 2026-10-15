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
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="text-primary">{agentName}</span>
        <span className="text-muted-foreground/50">•</span>
        <span>{block.task}</span>

        <div className="ml-auto">
          {isRunning && (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          )}
          {block.status === 'completed' && (
            <CheckCircle2 className="h-3 w-3 text-success" />
          )}
          {block.status === 'error' && (
            <AlertCircle className="h-3 w-3 text-destructive" />
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
        <span className="inline-block h-3 w-2 animate-pulse bg-primary/80" />
      )}

      {block.error && (
        <div className="mt-2 text-xs text-destructive">{block.error}</div>
      )}
    </div>
  );
}
