// Server-Sent Events Mock-server for the crew API route
export const runtime = 'edge';

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Хелпер для отправки SSE формата
      const sendEvent = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      // 1. Researcher Phase
      sendEvent('researcher.started', {
        agent: 'Researcher',
        task: 'Analyze market',
      });
      await sleep(600);

      const text1 =
        'Я проанализировал текущие тренды. Мы видим смещение фокуса на потоковые интерфейсы и Defence Tech.';
      for (const char of text1) {
        sendEvent('researcher.text.delta', { text: char });
        await sleep(20); // Имитация скорости генерации токенов
      }

      sendEvent('researcher.completed', { status: 'success' });
      await sleep(800);

      // 2. Writer Phase
      sendEvent('writer.started', { agent: 'Writer', task: 'Draft response' });
      await sleep(500);

      const text2 =
        'На основе данных исследователя, архитектура SSE и гранулярный стейт — это лучшее решение.';
      for (const char of text2) {
        sendEvent('writer.text.delta', { text: char });
        await sleep(30);
      }
      sendEvent('writer.completed', { status: 'success' });
      await sleep(400);

      // 3. Финиш
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
