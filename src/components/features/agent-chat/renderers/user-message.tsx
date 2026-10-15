export function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-3 text-sm text-foreground">
        {text}
      </div>
    </div>
  );
}
