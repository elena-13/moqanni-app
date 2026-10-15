# Moqanni

Moqanni is a web interface for a multi-agent AI crew. The user sends a prompt, and the app streams the work of several agents (Researcher, Writer, Reviewer) in real time over Server-Sent Events (SSE), rendering each agent's text and widgets (such as images) as separate blocks in the chat feed.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Compiler)
- React 19 and TypeScript
- Tailwind CSS 4 and [shadcn/ui](https://ui.shadcn.com) (Base UI)
- [Zustand](https://zustand.docs.pmnd.rs) for state management
- [eventsource-parser](https://github.com/rexxars/eventsource-parser) for SSE parsing
- Framer Motion, Lucide icons, react-resizable-panels

## Getting Started

### Prerequisites

- Node.js 20 or later
- A running backend (FastAPI) on `http://127.0.0.1:8000` that exposes `POST /api/crew`. Without it, you can use the built-in mock endpoint (see below).

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

## Backend Integration

The chat sends requests to `http://localhost:8000/api/crew` (see `src/hooks/use-chat-stream.ts`). In addition, `next.config.ts` proxies all `/api/*` requests that have no matching Next.js route to the FastAPI server at `http://127.0.0.1:8000`.

The request body:

```json
{
  "prompt": "User message",
  "history": [{ "role": "user", "content": "Previous message" }]
}
```

### Streaming Events

The backend responds with an SSE stream (`Content-Type: text/event-stream`). Supported events, where `<agent>` is `researcher`, `writer`, or `reviewer`:

| Event                | Payload                             | Description                        |
| -------------------- | ----------------------------------- | ---------------------------------- |
| `<agent>.started`    | `{ agent, task }`                   | An agent started working on a task |
| `<agent>.text.delta` | `{ text }`                          | A chunk of generated text          |
| `<agent>.widget`     | `{ agent, task, type, widgetData }` | A complete widget (e.g. an image)  |
| `<agent>.completed`  | `{ status }`                        | The agent finished its task        |
| `run.completed`      | `{ status }`                        | The whole run is finished          |

Text deltas are buffered and flushed to the store every 50 ms to keep rendering efficient.

### Mock Backend

For frontend development without the real backend, there is a mock SSE endpoint at `src/app/api/mock-crew/route.ts`. To use it, change the fetch URL in `src/hooks/use-chat-stream.ts` to `/api/mock-crew`.

## Project Structure

```
src/
├── app/
│   ├── api/mock-crew/       # Mock SSE endpoint
│   ├── layout.tsx
│   └── page.tsx             # Main page (workspace + chat)
├── components/
│   ├── features/agent-chat/ # Chat feed, input, and block renderers
│   ├── layout/              # Resizable workspace layout
│   ├── providers/           # App-level providers
│   └── ui/                  # shadcn/ui components
├── hooks/                   # useChatStream: sending prompts and handling the stream
├── lib/                     # Utilities and mock data
├── services/                # API client and SSE stream parser
├── store/                   # Zustand stores (chat, UI)
└── types/                   # Shared types
```
