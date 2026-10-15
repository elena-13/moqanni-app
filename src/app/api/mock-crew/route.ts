import { mockCrewRun } from '@/lib/mock-data';

export const runtime = 'edge';

export async function POST() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      for (const run of mockCrewRun) {
        sendEvent(`${run.eventPrefix}.started`, {
          agent: run.agent,
          task: run.task,
        });
        await sleep(500);

        for (const char of run.output) {
          sendEvent(`${run.eventPrefix}.text.delta`, { text: char });
          await sleep(run.tokenDelayMs);
        }

        sendEvent(`${run.eventPrefix}.completed`, { status: 'success' });
        await sleep(600);
      }

      sendEvent('run.completed', { status: 'done' });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
