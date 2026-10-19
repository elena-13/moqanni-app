'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { ChatListItem } from '@/components/features/chat-history/chat-list-item';
import { chatListQuery } from '@/components/features/chat-history/chat-queries';

export function ChatList() {
  const { chatId } = useParams<{ chatId?: string }>();
  const { data: chats, isPending, isError, refetch } = useQuery(chatListQuery);

  if (isPending) {
    return (
      <div
        className="flex flex-col gap-1"
        aria-busy="true"
        aria-label="Loading chats"
      >
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-8 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-2 text-sm">
        <p className="text-destructive">Couldn&apos;t load chats.</p>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (chats.length === 0) {
    return <p className="px-2 text-sm text-muted-foreground">No chats yet.</p>;
  }

  return (
    <nav aria-label="Chats">
      <ul className="flex flex-col gap-0.5">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === chatId}
          />
        ))}
      </ul>
    </nav>
  );
}
