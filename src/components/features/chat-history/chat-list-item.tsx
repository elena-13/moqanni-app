import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { ChatSummary } from '@/types/chat';

interface ChatListItemProps {
  chat: ChatSummary;
  isActive: boolean;
}

export function ChatListItem({ chat, isActive }: ChatListItemProps) {
  return (
    <li>
      <Link
        href={`/chat/${chat.id}`}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'block truncate rounded-md px-2 py-1.5 text-sm transition-colors',
          isActive
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        )}
      >
        {chat.title}
      </Link>
    </li>
  );
}
