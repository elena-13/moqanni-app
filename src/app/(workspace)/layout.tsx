import type { ReactNode } from 'react';

import { ChatHistory } from '@/components/features/chat-history/chat-history';
import { WorkspaceLayout } from '@/components/layout/workspace';

export default function WorkspaceRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WorkspaceLayout sidebar={<ChatHistory />}>{children}</WorkspaceLayout>
  );
}
