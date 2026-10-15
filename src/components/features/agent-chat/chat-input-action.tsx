import { Send, StopCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChatInputActionProps {
  isGenerating: boolean;
  canSubmit: boolean;
  onStop: () => void;
}

const baseClassName =
  "ml-2 flex items-center gap-1 rounded-lg px-4 py-2 text-xs font-medium transition-colors";

export function ChatInputAction({
  isGenerating,
  canSubmit,
  onStop,
}: ChatInputActionProps) {
  if (isGenerating) {
    return (
      <button
        type="button"
        onClick={onStop}
        className={cn(baseClassName, "bg-zinc-800 text-red-400 hover:bg-zinc-700")}
      >
        <StopCircle className="h-4 w-4" /> Stop
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={!canSubmit}
      className={cn(
        baseClassName,
        "bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600",
      )}
    >
      <Send className="h-4 w-4" /> Build
    </button>
  );
}
