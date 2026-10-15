// Его единственная задача — принять объект MessageBlock, проверить поле type и отрендерить нужный микро-компонент. Лента сообщений просто вызывает Фабрику, оставаясь идеально чистой.
'use client';

import { useChatStore } from '@/store/chat-store';
import { UserMessage } from './user-message';
import { TextChunk } from './text-chunk';
import { ImageWidget } from './image-widget';

export function BlockFactory({ blockId }: { blockId: string }) {
  // Компонент перерисуется, только если изменятся данные ИМЕННО ЭТОГО блока
  const block = useChatStore((s) => s.blocks[blockId]);

  if (!block) return null;

  // Рендер сообщения пользователя
  if (block.role === 'user') {
    return <UserMessage text={block.text} />;
  }

  // Рендер ответов агентов
  switch (block.type) {
    case 'text':
      return <TextChunk block={block} />;
    case 'image_widget':
      return <ImageWidget block={block} />;
    default:
      return (
        <div className="text-red-500">Unknown block type: {block.type}</div>
      );
  }
}
