'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chat-store';
import { BlockFactory } from './renderers/block-factory';

export function ChatFeed() {
  // Subscribing to ids only, so streaming text inside a block doesn't re-render the list.
  const blockIds = useChatStore((s) => s.blockIds);
  const bottomRef = useRef<HTMLDivElement>(null);

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
