import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChatList } from '@/components/features/chat-history/chat-list';
import { NewChatButton } from '@/components/features/chat-history/new-chat-button';

export function ChatHistory() {
  return (
    <div className="flex h-full flex-col gap-4">
      <NewChatButton />
      <div className="-mx-2 min-h-0 flex-1 overflow-y-auto px-2">
        <Accordion defaultValue={['recent']}>
          <AccordionItem value="recent">
            <AccordionTrigger className="cursor-pointer px-2 py-1.5 font-sans text-xs tracking-wider text-muted-foreground uppercase hover:text-foreground hover:no-underline">
              Recent
            </AccordionTrigger>
            <AccordionContent className="pb-0 [&_a]:no-underline">
              <ChatList />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
