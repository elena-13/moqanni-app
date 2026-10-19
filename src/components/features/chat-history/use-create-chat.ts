import { useMutation, useQueryClient } from '@tanstack/react-query';

import { chatListQuery } from '@/components/features/chat-history/chat-queries';
import { DEFAULT_CHAT_TITLE } from '@/data/config/chat';
import { createChat } from '@/services/api-client';

const { queryKey } = chatListQuery;

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChat,
    onMutate: async ({ id }) => {
      // A list refetch already in flight would overwrite the optimistic entry when it lands.
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (chats = []) => [
        { id, title: DEFAULT_CHAT_TITLE, updatedAt: new Date().toISOString() },
        ...chats,
      ]);

      return { previous };
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}
