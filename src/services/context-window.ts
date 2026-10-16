import { splitAgentOutput } from '@/components/features/agent-chat/split-agent-output';
import { CONTEXT_WINDOW } from '@/data/config/context-window';
import type { AgentBlock } from '@/store/chat-store';

export interface HistoryMessage {
  role: AgentBlock['role'];
  content: string;
}

type Turn = HistoryMessage[];

function estimateTokens(content: string) {
  return (
    Math.ceil(content.length / CONTEXT_WINDOW.charsPerToken) +
    CONTEXT_WINDOW.messageOverheadTokens
  );
}

function turnTokens(turn: Turn) {
  return turn.reduce(
    (sum, message) => sum + estimateTokens(message.content),
    0,
  );
}

// Agents' "Thought:" reasoning is UI-only; the next run needs just the final answer.
function toHistoryMessage(block: AgentBlock): HistoryMessage | null {
  if (block.type !== 'text' || block.status !== 'completed') return null;

  const text =
    block.role === 'assistant'
      ? splitAgentOutput(block.text, false).answer
      : block.text;
  const content = text.trim();

  return content ? { role: block.role, content } : null;
}

function groupIntoTurns(messages: HistoryMessage[]) {
  const turns: Turn[] = [];

  for (const message of messages) {
    const current = turns.at(-1);
    if (message.role === 'user' || !current) turns.push([message]);
    else current.push(message);
  }

  return turns;
}

// Keeps whole turns, newest first, so an answer is never sent without the prompt that produced it.
export function buildHistoryWindow(
  blocks: AgentBlock[],
  prompt: string,
): HistoryMessage[] {
  const messages = blocks.map(toHistoryMessage).filter((m) => m !== null);
  const kept: Turn[] = [];
  let budget = CONTEXT_WINDOW.maxTokens - estimateTokens(prompt);

  for (const turn of groupIntoTurns(messages).toReversed()) {
    const cost = turnTokens(turn);
    if (kept.length >= CONTEXT_WINDOW.maxTurns || cost > budget) break;

    budget -= cost;
    kept.unshift(turn);
  }

  return kept.flat();
}
