"use client";

import { ReactNode } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";

export function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-zinc-950 font-sans text-zinc-50 overflow-hidden">
      {/* Верхний Navbar */}
      <header className="flex h-12 shrink-0 items-center border-b border-white/10 px-4">
        <span className="font-semibold text-sky-400">Moqanni</span>
      </header>

      {/* Основная рабочая зона */}
      <Group orientation="horizontal" className="flex-1">
        {/* Левая панель: История / Файлы */}
        <Panel defaultSize="20%" minSize="15%" className="bg-zinc-900/30 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Project Tree
          </div>
        </Panel>

        {/* Разделитель с ховером */}
        <Separator className="w-[1px] bg-white/10 transition-all hover:w-1 hover:bg-sky-500/50 cursor-col-resize" />

        {/* Центральная панель: Чат (Контент страницы) */}
        <Panel defaultSize="55%" minSize="40%" className="relative flex flex-col">
          {children}
        </Panel>

        <Separator className="w-[1px] bg-white/10 transition-all hover:w-1 hover:bg-sky-500/50 cursor-col-resize" />

        {/* Правая панель: Настройки */}
        <Panel defaultSize="25%" minSize="20%" className="bg-zinc-900/30 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Tools & Properties
          </div>
        </Panel>
      </Group>
    </div>
  );
}
