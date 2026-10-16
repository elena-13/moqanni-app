import { create } from 'zustand';

export type BlockType = 'text' | 'image_widget' | 'code_preview' | 'tool_log';

export interface AgentBlock {
  id: string;
  role: 'user' | 'assistant';
  type: BlockType;

  agentName?: string;
  task?: string;

  text: string;
  data?: unknown; // e.g. { urls: [...] } from an image model, or tool logs

  status: 'running' | 'completed' | 'error' | 'aborted';
  error?: string;
}

interface ChatState {
  blocks: Record<string, AgentBlock>;
  blockIds: string[];

  addUserMessage: (id: string, text: string) => void;
  startAgent: (
    id: string,
    agentName: string,
    task: string,
    type?: BlockType,
  ) => void;
  flushTextDelta: (id: string, accumulatedText: string) => void;
  setBlockData: (id: string, data: unknown) => void;
  completeAgent: (id: string) => void;
  failAgent: (id: string, error: string) => void;
  clearStore: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  blocks: {},
  blockIds: [],

  addUserMessage: (id, text) =>
    set((state) => {
      if (state.blocks[id]) return state;
      return {
        blockIds: [...state.blockIds, id],
        blocks: {
          ...state.blocks,
          [id]: { id, role: 'user', type: 'text', text, status: 'completed' },
        },
      };
    }),

  startAgent: (id, agentName, task, type = 'text') =>
    set((state) => {
      if (state.blocks[id]) return state;
      return {
        blockIds: [...state.blockIds, id],
        blocks: {
          ...state.blocks,
          [id]: {
            id,
            role: 'assistant',
            type,
            agentName,
            task,
            text: '',
            status: 'running',
          },
        },
      };
    }),

  flushTextDelta: (id, accumulatedText) =>
    set((state) => {
      const block = state.blocks[id];
      if (!block || block.status !== 'running') return state;

      return {
        blocks: {
          ...state.blocks,
          [id]: { ...block, text: block.text + accumulatedText },
        },
      };
    }),

  setBlockData: (id, data) =>
    set((state) => {
      const block = state.blocks[id];
      if (!block) return state;
      return {
        blocks: {
          ...state.blocks,
          [id]: { ...block, data },
        },
      };
    }),

  completeAgent: (id) =>
    set((state) => {
      const block = state.blocks[id];
      if (!block) return state;
      return {
        blocks: { ...state.blocks, [id]: { ...block, status: 'completed' } },
      };
    }),

  failAgent: (id, error) =>
    set((state) => {
      const block = state.blocks[id];
      if (!block) return state;
      return {
        blocks: { ...state.blocks, [id]: { ...block, status: 'error', error } },
      };
    }),

  clearStore: () => set({ blocks: {}, blockIds: [] }),
}));
