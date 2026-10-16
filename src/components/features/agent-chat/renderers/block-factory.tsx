'use client';

import { useChatStore } from '@/store/chat-store';
import { UserMessage } from './user-message';
import { TextChunk } from './text-chunk';
import { ImageWidget } from './image-widget';

export function BlockFactory({ blockId }: { blockId: string }) {
  // Re-renders only when this block's data changes.
  const block = useChatStore((s) => s.blocks[blockId]);

  if (!block) return null;

  if (block.role === 'user') {
    return <UserMessage text={block.text} />;
  }

  switch (block.type) {
    case 'text':
      return <TextChunk block={block} />;
    case 'image_widget':
      return <ImageWidget block={block} />;
    default:
      return (
        <div className="text-destructive">Unknown block type: {block.type}</div>
      );
  }
}
