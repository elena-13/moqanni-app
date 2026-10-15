import { useRef, useEffect, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { consumeSSEStream } from "@/services/stream-parser";

export function useChatStream() {
  // Достаем экшены через getState().
  // Это гарантирует 0% лишних ререндеров компонента, который вызовет этот хук.
  const {
    addUserMessage,
    startAgent,
    flushTextDelta,
    completeAgent,
    failAgent,
    setBlockData,
  } = useChatStore.getState();

  const activeAgentId = useRef<string | null>(null);
  const textBuffer = useRef<string>("");
  const flushTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const flushBuffer = useCallback(() => {
    if (activeAgentId.current && textBuffer.current.length > 0) {
      flushTextDelta(activeAgentId.current, textBuffer.current);
      textBuffer.current = "";
    }
    if (flushTimeout.current) {
      clearTimeout(flushTimeout.current);
      flushTimeout.current = null;
    }
  }, [flushTextDelta]);

  useEffect(() => {
    return () => {
      flushBuffer();
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [flushBuffer]);

  // Принимаем промпт от компонента ввода (Input)
  const startStream = async (prompt: string) => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    // 1. Собираем историю предыдущих сообщений из стора
    const state = useChatStore.getState();
    const history = state.blockIds
      .map((id) => state.blocks[id])
      .filter(
        (b) =>
          b &&
          b.type === "text" &&
          b.status === "completed" &&
          b.text.trim() !== "",
      )
      .map((b) => ({
        role: b.role,
        content: b.text,
      }));

    // 1. Мгновенно рендерим сообщение пользователя в ленте
    const userMsgId = crypto.randomUUID();
    addUserMessage(userMsgId, prompt);

    try {
      const res = await fetch("http://localhost:8000/api/crew", {
        // "/api/mock-crew"
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- Критически важно для FastAPI
        },
        // 3. Отправляем И текущий промпт, И историю диалога
        body: JSON.stringify({
          prompt,
          history,
        }),
        signal: abortController.current.signal,
      });

      if (!res.ok) throw new Error("Network response was not ok");

      await consumeSSEStream(res, (payload) => {
        // Старт текстового агента
        if (payload.event.endsWith(".started")) {
          if ("agent" in payload.data && "task" in payload.data) {
            flushBuffer();
            const id = crypto.randomUUID();
            activeAgentId.current = id;

            startAgent(id, payload.data.agent, payload.data.task, "text");
          }
        }

        // Поток текста
        if (payload.event.endsWith(".delta") && "text" in payload.data) {
          textBuffer.current += payload.data.text;

          if (!flushTimeout.current) {
            flushTimeout.current = setTimeout(() => {
              flushBuffer();
            }, 50);
          }
        }

        // НОВОЕ: Обработка моментального виджета (например, картинок)
        if (payload.event.endsWith(".widget")) {
          if (
            "type" in payload.data &&
            "widgetData" in payload.data &&
            "agent" in payload.data &&
            "task" in payload.data
          ) {
            flushBuffer();
            const id = crypto.randomUUID();
            // payload.data.type может быть 'image_widget'
            startAgent(
              id,
              payload.data.agent,
              payload.data.task,
              payload.data.type,
            );
            setBlockData(id, payload.data.widgetData);
            completeAgent(id);
          }
        }

        // Завершение агента
        if (
          payload.event.endsWith(".completed") &&
          !payload.event.startsWith("run")
        ) {
          flushBuffer();
          if (activeAgentId.current) {
            completeAgent(activeAgentId.current);
            activeAgentId.current = null;
          }
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Stream aborted by user");
        } else {
          console.error("Stream failed:", error);
          if (activeAgentId.current) {
            failAgent(activeAgentId.current, error.message);
          }
        }
      } else {
        // Редкий случай, если кто-то сделал throw "String" или throw { custom: 1 }
        console.error("Stream failed with non-Error throw:", error);
        if (activeAgentId.current) {
          failAgent(activeAgentId.current, "Unknown stream error");
        }
      }
    } finally {
      flushBuffer();
    }
  };

  return { startStream, abort: () => abortController.current?.abort() };
}
