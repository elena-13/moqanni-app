import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AgentAnswer({ text }: { text: string }) {
  return (
    <div className="prose prose-sm max-w-none">
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
    </div>
  );
}
