// Лента сообщений
'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chat-store';
import { BlockFactory } from './renderers/block-factory';

export function ChatFeed() {
  // Подписываемся ТОЛЬКО на массив ID.
  // Изменение текста внутри блоков не вызовет перерендер этого списка!
  const blockIds = useChatStore((s) => s.blockIds);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при появлении новых блоков
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [blockIds.length]);

  if (blockIds.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Describe what to build or change...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 pb-32">
      {blockIds.map((id) => (
        <BlockFactory key={id} blockId={id} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
