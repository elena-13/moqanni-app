import type { ChatSummary, CreateChatInput } from '@/types/chat';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    throw new Error(
      `${init?.method ?? 'GET'} ${path} failed with ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}

export function fetchChats() {
  return request<ChatSummary[]>('/api/chats');
}

export function createChat(input: CreateChatInput) {
  return request<ChatSummary>('/api/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}
