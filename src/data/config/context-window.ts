export const CONTEXT_WINDOW = {
  maxTokens: 4000,
  maxTurns: 10,
  // Conservative ratio: Cyrillic text tokenizes at roughly 2–3 chars per token, English at ~4.
  charsPerToken: 3,
  messageOverheadTokens: 4,
} as const;
