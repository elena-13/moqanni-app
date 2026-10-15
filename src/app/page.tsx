import Image from 'next/image';

import { WorkspaceLayout } from '@/components/layout/workspace';
import { ChatFeed } from '@/components/features/agent-chat/chat-feed';
import { ChatInput } from '@/components/features/agent-chat/chat-input';

export default function TooltenderPage() {
  return (
    <WorkspaceLayout>
      <div className="relative flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatFeed />
        </div>
        <ChatInput />
      </div>
      {/* <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <p className="text-sm text-zinc-500">What&apos;s up next?</p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 w-full max-w-3xl -translate-x-1/2 px-4">
          <div className="relative flex items-center rounded-xl border border-white/10 bg-zinc-900/80 p-2 shadow-2xl backdrop-blur-md">
            <input
              type="text"
              placeholder="Describe what to build or change..."
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
            <button className="ml-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sky-500">
              Build
            </button>
          </div>
        </div>
      </div> */}
    </WorkspaceLayout>
  );
}
