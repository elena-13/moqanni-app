import { ChatView } from '@/components/features/agent-chat/chat-view';

export default async function ChatPage({
  params,
}: PageProps<'/chat/[chatId]'>) {
  const { chatId } = await params;

  return <ChatView key={chatId} />;
}
