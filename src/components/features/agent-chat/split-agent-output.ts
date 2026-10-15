const THOUGHT_MARKER = 'Thought:';
const FINAL_ANSWER_MARKER = 'Final Answer:';

export interface AgentOutput {
  thought: string | null;
  answer: string;
  hasFinalAnswer: boolean;
}

// Hides a marker that is still arriving token by token (e.g. "Final Ans") so it never flashes on screen.
function trimPartialMarker(text: string, marker: string) {
  for (
    let length = Math.min(marker.length - 1, text.length);
    length > 0;
    length--
  ) {
    if (marker.startsWith(text.slice(-length))) return text.slice(0, -length);
  }
  return text;
}

function stripThoughtMarker(text: string) {
  const start = text.indexOf(THOUGHT_MARKER);
  return start === -1 ? text : text.slice(start + THOUGHT_MARKER.length);
}

export function splitAgentOutput(
  text: string,
  isStreaming: boolean,
): AgentOutput {
  const finalAnswerStart = text.indexOf(FINAL_ANSWER_MARKER);

  if (finalAnswerStart !== -1) {
    const thought = stripThoughtMarker(text.slice(0, finalAnswerStart)).trim();
    return {
      thought: thought || null,
      answer: text
        .slice(finalAnswerStart + FINAL_ANSWER_MARKER.length)
        .trimStart(),
      hasFinalAnswer: true,
    };
  }

  const leading = text.trimStart();

  if (leading.startsWith(THOUGHT_MARKER)) {
    const thought = stripThoughtMarker(text);
    return {
      thought: (isStreaming
        ? trimPartialMarker(thought, FINAL_ANSWER_MARKER)
        : thought
      ).trim(),
      answer: '',
      hasFinalAnswer: false,
    };
  }

  if (isStreaming && THOUGHT_MARKER.startsWith(leading)) {
    return { thought: null, answer: '', hasFinalAnswer: false };
  }

  return { thought: null, answer: text, hasFinalAnswer: false };
}
