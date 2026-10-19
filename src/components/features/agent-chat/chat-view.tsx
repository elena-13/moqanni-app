'use client';

import { useEffect } from 'react';

import { ChatFeed } from '@/components/features/agent-chat/chat-feed';
import { ChatInput } from '@/components/features/agent-chat/chat-input';
import { useChatStore } from '@/store/chat-store';

export function ChatView() {
  // The store holds one chat's live blocks until it is keyed by chatId, so leaving a chat empties it.
  useEffect(() => () => useChatStore.getState().clearStore(), []);

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <ChatFeed />
      </div>
      <ChatInput />
    </div>
  );
}
