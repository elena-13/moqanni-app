import { create } from "zustand";

// 1. Дискриминатор для нашей Фабрики Компонентов
export type BlockType = "text" | "image_widget" | "code_preview" | "tool_log";

export interface AgentBlock {
  id: string;
  role: "user" | "assistant"; // Отделяем промпты человека от ответов ИИ
  type: BlockType;

  // Метаданные агента (опционально, так как у пользователя их нет)
  agentName?: string;
  task?: string;

  // Поля данных (гибкие под разные нейронки)
  text: string; // Текст заполняется через flushTextDelta
  data?: unknown; // Сюда можно положить { urls: [...] } от DALL-E или логи тулов

  status: "running" | "completed" | "error" | "aborted";
  error?: string;
}

interface ChatState {
  blocks: Record<string, AgentBlock>;
  blockIds: string[];

  // Экшены
  addUserMessage: (id: string, text: string) => void; // НОВЫЙ: для инпута пользователя
  startAgent: (
    id: string,
    agentName: string,
    task: string,
    type?: BlockType,
  ) => void;
  flushTextDelta: (id: string, accumulatedText: string) => void;
  setBlockData: (id: string, data: unknown) => void; // НОВЫЙ: для картинок и виджетов
  completeAgent: (id: string) => void;
  failAgent: (id: string, error: string) => void;
  clearStore: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  blocks: {},
  blockIds: [],

  // Добавление промпта от человека мгновенно
  addUserMessage: (id, text) =>
    set((state) => {
      if (state.blocks[id]) return state;
      return {
        blockIds: [...state.blockIds, id],
        blocks: {
          ...state.blocks,
          [id]: { id, role: "user", type: "text", text, status: "completed" },
        },
      };
    }),

  // Добавлен type, чтобы понимать, картинку мы ждем или текст
  startAgent: (id, agentName, task, type = "text") =>
    set((state) => {
      if (state.blocks[id]) return state;
      return {
        blockIds: [...state.blockIds, id],
        blocks: {
          ...state.blocks,
          [id]: {
            id,
            role: "assistant",
            type,
            agentName,
            task,
            text: "",
            status: "running",
          },
        },
      };
    }),

  flushTextDelta: (id, accumulatedText) =>
    set((state) => {
      const block = state.blocks[id];
      if (!block || block.status !== "running") return state;

      return {
        blocks: {
          ...state.blocks,
          [id]: { ...block, text: block.text + accumulatedText },
        },
      };
    }),

  // Экшен для сохранения виджетов/картинок от не-текстовых нейронок
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
        blocks: { ...state.blocks, [id]: { ...block, status: "completed" } },
      };
    }),

  failAgent: (id, error) =>
    set((state) => {
      const block = state.blocks[id];
      if (!block) return state;
      return {
        blocks: { ...state.blocks, [id]: { ...block, status: "error", error } },
      };
    }),

  clearStore: () => set({ blocks: {}, blockIds: [] }),
}));
