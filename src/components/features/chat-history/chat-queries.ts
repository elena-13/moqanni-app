import { queryOptions } from '@tanstack/react-query';
import { fetchChats } from '@/services/api-client';

export const chatListQuery = queryOptions({
  queryKey: ['chats', 'list'],
  queryFn: fetchChats,
});
