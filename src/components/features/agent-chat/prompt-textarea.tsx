'use client';

import TextareaAutosize from 'react-textarea-autosize';

interface PromptTextareaProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

export function PromptTextarea({
  value,
  disabled,
  onChange,
}: PromptTextareaProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // isComposing guards IME input, where Enter confirms a candidate rather than sending
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;

    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  };

  return (
    <TextareaAutosize
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      minRows={1}
      maxRows={8}
      placeholder="Describe what to build or change..."
      aria-label="Prompt"
      className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-5 text-white placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
    />
  );
}
