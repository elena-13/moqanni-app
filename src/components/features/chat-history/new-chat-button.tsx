'use client';

import { useRouter } from 'next/navigation';
import { SquarePen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCreateChat } from '@/components/features/chat-history/use-create-chat';

export function NewChatButton() {
  const router = useRouter();
  const { mutate, isPending } = useCreateChat();

  const handleClick = () => {
    const id = crypto.randomUUID();
    const chatPath = `/chat/${id}`;

    mutate(
      { id },
      {
        onError: () => {
          if (window.location.pathname === chatPath) router.replace('/');
        },
      },
    );
    router.push(chatPath);
  };

  return (
    <Button
      className="w-full cursor-pointer justify-start"
      disabled={isPending}
      onClick={handleClick}
    >
      <SquarePen /> New chat
    </Button>
  );
}
