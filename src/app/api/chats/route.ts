import { DEFAULT_CHAT_TITLE } from '@/data/config/chat';
import { mockChats } from '@/lib/mock-data';
import type { ChatSummary, CreateChatInput } from '@/types/chat';

// In-memory stand-in for FastAPI; it resets on server restart. Delete this file once /api/chats is served by the backend.
const chats: ChatSummary[] = [...mockChats];

export function GET() {
  const newestFirst = chats.toSorted((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  return Response.json(newestFirst);
}

export async function POST(request: Request) {
  const { id } = (await request.json()) as Partial<CreateChatInput>;
  if (typeof id !== 'string' || id.length === 0) {
    return Response.json({ error: 'id is required' }, { status: 400 });
  }

  // Idempotent on the client-generated id, so a retried request never creates a duplicate.
  const existing = chats.find((chat) => chat.id === id);
  if (existing) return Response.json(existing);

  const chat: ChatSummary = {
    id,
    title: DEFAULT_CHAT_TITLE,
    updatedAt: new Date().toISOString(),
  };
  chats.push(chat);

  return Response.json(chat, { status: 201 });
}
