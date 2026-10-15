import { BlockType } from "@/store/chat-store";
import { createParser, type EventSourceMessage } from "eventsource-parser";

// Events we expect to receive from the server
export type StreamEvent =
  | {
      event: "researcher.started" | "writer.started" | "reviewer.started";
      data: {
        agent: string;
        task: string;
      };
    }
  | {
      event:
        | "researcher.text.delta"
        | "writer.text.delta"
        | "reviewer.text.delta";
      data: {
        text: string;
      };
    }
  | {
      event: "researcher.completed" | "writer.completed" | "reviewer.completed";
      data: {
        status: string;
      };
    }
  | {
      event: "run.completed";
      data: {
        status: string;
      };
    }
  | {
      event: "researcher.widget" | "writer.widget" | "reviewer.widget";
      data: {
        agent: string;
        task: string;
        type: BlockType;
        widgetData: unknown;
      };
    };

export async function consumeSSEStream(
  response: Response,
  onEvent: (event: StreamEvent) => void,
) {
  if (!response.body) {
    throw new Error("No readable stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  const parser = createParser({
    onEvent(event: EventSourceMessage) {
      try {
        const data = JSON.parse(event.data);

        onEvent({
          event: event.event as StreamEvent["event"],
          data,
        } as StreamEvent);
      } catch (error) {
        console.error("Failed to parse SSE event:", event.data, error);
      }
    },

    onError(error) {
      console.error("SSE parse error:", error);
    },
  });

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        // Flush any remaining UTF-8 bytes.
        const remaining = decoder.decode();

        if (remaining) {
          parser.feed(remaining);
        }

        // Flush the parser itself.
        parser.reset({ consume: true });

        break;
      }

      const text = decoder.decode(value, {
        stream: true,
      });

      parser.feed(text);
    }
  } finally {
    reader.releaseLock();
  }
}
