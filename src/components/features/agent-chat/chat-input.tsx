'use client';

import { useState } from 'react';

import { ChatInputAction } from '@/components/features/agent-chat/chat-input-action';
import { PromptTextarea } from '@/components/features/agent-chat/prompt-textarea';
import { useChatStream } from '@/hooks/use-chat-stream';
import { useChatStore } from '@/store/chat-store';

export function ChatInput() {
  const [prompt, setPrompt] = useState('');
  const { startStream, abort } = useChatStream();
  const isGenerating = useChatStore((s) =>
    Object.values(s.blocks).some((b) => b.status === 'running'),
  );

  const canSubmit = prompt.trim().length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isGenerating) return;

    startStream(prompt);
    setPrompt('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-6 left-1/2 w-full max-w-3xl -translate-x-1/2 px-4"
    >
      <div className="relative flex items-end rounded-prompt border border-border bg-card/80 p-2 backdrop-blur-md transition-all focus-within:border-ring/50 focus-within:ring-1 focus-within:ring-ring/50">
        <PromptTextarea
          value={prompt}
          disabled={isGenerating}
          onChange={setPrompt}
        />
        <ChatInputAction
          isGenerating={isGenerating}
          canSubmit={canSubmit}
          onStop={abort}
        />
      </div>
    </form>
  );
}
