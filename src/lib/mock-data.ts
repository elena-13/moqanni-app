import type { ChatSummary } from '@/types/chat';

export interface MockAgentRun {
  eventPrefix: 'researcher' | 'writer' | 'reviewer';
  agent: string;
  task: string;
  output: string;
  tokenDelayMs: number;
}

export const mockCrewRun: MockAgentRun[] = [
  {
    eventPrefix: 'researcher',
    agent: 'Researcher',
    task: 'Analyze market',
    tokenDelayMs: 12,
    output: `Thought: Нужно понять, куда смещается фокус рынка AI-интерфейсов. Сравню свежие релизы агентных продуктов и посмотрю, какие паттерны UI повторяются чаще всего.
Похоже, почти все перешли на потоковый вывод и показывают ход рассуждений агента отдельно от результата.
Final Answer: ## Ключевые тренды

- **Потоковые интерфейсы** — ответ появляется по мере генерации, а не после.
- **Прозрачность рассуждений** — ход мысли агента виден, но свёрнут по умолчанию.
- **Defence Tech** — растущий спрос на мультиагентную оркестрацию.`,
  },
  {
    eventPrefix: 'writer',
    agent: 'Writer',
    task: 'Draft response',
    tokenDelayMs: 15,
    output: `Thought: Исследователь выделил потоковый вывод и прозрачность рассуждений. Сформулирую рекомендацию по архитектуре так, чтобы она опиралась на оба пункта.
Final Answer: На основе данных исследователя лучшим решением будет **архитектура SSE** с гранулярным стейтом:

1. Каждый агент пишет в свой блок, поэтому перерисовывается только он.
2. Рассуждения и итоговый ответ разделяются прямо в потоке.`,
  },
];

export const mockChats: ChatSummary[] = [
  {
    id: '0b7c2f4e-9a1d-4c3b-8e5f-1a2b3c4d5e6f',
    title: 'Market trends for AI interfaces',
    updatedAt: '2026-10-16T14:20:00.000Z',
  },
  {
    id: '5d8e1a2b-3c4f-4e6a-9b7c-2d3e4f5a6b7c',
    title: 'SSE architecture review',
    updatedAt: '2026-10-15T09:05:00.000Z',
  },
  {
    id: '9f1a3b5c-7d2e-4f8a-b6c4-3e5f7a9b1c2d',
    title: 'Landing page copy draft',
    updatedAt: '2026-10-12T18:40:00.000Z',
  },
];
