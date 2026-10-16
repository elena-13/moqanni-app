'use client';

import { ReactNode } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background font-sans text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <span className="font-heading text-xl text-primary">Moqanni</span>
        <ThemeToggle />
      </header>

      <Group orientation="horizontal" className="flex-1">
        <Panel defaultSize="20%" minSize="15%" className="bg-sidebar p-4">
          <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Project Tree
          </div>
        </Panel>

        <Separator className="w-px cursor-col-resize bg-border transition-colors hover:bg-primary" />

        <Panel
          defaultSize="55%"
          minSize="40%"
          className="relative flex flex-col"
        >
          {children}
        </Panel>

        <Separator className="w-px cursor-col-resize bg-border transition-colors hover:bg-primary" />

        <Panel defaultSize="25%" minSize="20%" className="bg-sidebar p-4">
          <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Tools & Properties
          </div>
        </Panel>
      </Group>
    </div>
  );
}
