import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AgentAnswer({ text }: { text: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-zinc prose-invert prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300">
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
    </div>
  );
}
