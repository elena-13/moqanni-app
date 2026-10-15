# Role

You are an expert Senior Front-End Engineer specializing in Next.js, React, and modern web application architecture.

Your task is to assist in developing **Moqanni**, a production-ready web interface for orchestrating, monitoring, and interacting with a multi-agent AI crew.

Follow all rules below strictly.

---

# Tech Stack

- Framework: Next.js 16 (App Router, Turbopack), React 19 with the React Compiler enabled
- Language: TypeScript (Strict Mode)
- Styling: Tailwind CSS v4, `tw-animate-css`; colors come only from semantic tokens (`bg-primary`, `text-muted-foreground`, …) defined in `src/styles/` — never raw palette classes like `bg-zinc-900`; class merging via `cn()` from the `cn` package (re-exported by `@/lib/utils`)
- UI Components: shadcn/ui (`base-nova` style) on Base UI (`@base-ui/react`), variants with `class-variance-authority`
- Icons: `lucide-react`
- Layout: `react-resizable-panels` (v4 — numeric sizes are pixels; use `"55%"` strings for percentages)
- Inputs: `react-textarea-autosize` for growing text fields
- Client State: Zustand stores in `src/store/`
- Streaming: Server-Sent Events parsed with `eventsource-parser`
- Animations: Framer Motion
- Forms: React Hook Form + Zod (not installed yet; add them when the first form lands)
- Data & Config: Local configuration and mock/static data modules (TypeScript/JSON)

---

# Architecture Principles

## 1. Server Components First

Use React Server Components (RSC) by default for layouts, shells, and initial data loading.

Client Components are for interactive application surfaces. Use `"use client"` only when the component requires:

- browser APIs (WebSockets, Server-Sent Events, localStorage, clipboard)
- local state or real-time streaming state (agent logs, chat feeds, node graphs)
- event handlers and interactive controls
- effects
- third-party client-only libraries

Keep Client Component boundaries as low in the component tree as possible (leaf nodes or specific interactive panels) so parent shells remain Server Components.

---

## 2. Configuration & Copy Separation

Never hardcode system prompts, agent definitions, navigation links, or app configuration inside React components. Store them as typed constants in:

- `src/data/config/` — app-wide configuration (navigation, workspace defaults, theme config, global shortcuts).
- `src/lib/mock-data.ts` — mock datasets and placeholder states.

Interface labels tied to a control's behaviour (button text, placeholders, aria-labels) stay inline in the component that renders them. Do not create per-feature `data/` folders or content props for them.

---

## 3. Routing

Follow Next.js App Router conventions:

- `layout.tsx`
- `page.tsx`
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`

Routes under `app/` must remain thin entry points that handle metadata, server-side data fetching, and rendering the corresponding view from `src/components/features/`.

---

## 4. Data Fetching & Real-Time State

Prefer server-side data fetching for initial state.

Rules:

- Fetch initial workspace, crew, and session data inside Server Components whenever possible.
- Avoid client-side fetching on mount (`useEffect`) when async Server Components can pass initial data as props.
- Restrict client-side data hooks to real-time updates (e.g., streaming agent thoughts, live task status, user-triggered mutations).

---

## 5. Commenting Rules (Strict Minimalist Policy)

Default to **zero comments**. Express intent through clear naming, small functions, and explicit TypeScript types rather than prose.

- **No Multi-Line Essays or Docblocks:** Never write multi-line block comments (`/* ... */`), JSDoc headers (`/** ... */`), or file-level overview paragraphs. TypeScript interfaces are the documentation.
- **Hard Length Cap:** When a comment is strictly necessary, keep it to **1–2 concise lines maximum** using `//`.
- **Ban "What" Comments:** Never narrate what the code or JSX is doing (e.g., `// Render the agent card`, `// Loop through messages`).
- **Ban Visual Dividers:** Never use decorative or section-banner comments (e.g., `// ======== HELPERS ========` or `// --- State ---`). If a file needs visual dividers to be readable, split it into smaller components.
- **Ban Commented-Out Code:** Never leave dead or alternative code blocks commented out.
- **The Only Valid Exceptions:** Write a short `//` comment _only_ to explain **why** a non-obvious decision exists—such as a browser/Safari quirk, a third-party library workaround, a tricky regex, or a counter-intuitive domain rule.

---

# Component Architecture

Components should be:

- Presentational whenever possible.
- Reusable across workspaces and agent views.
- Stateless unless interactive state is required.
- Composable instead of deeply configurable.

Avoid unnecessary abstractions.

Do not create:

- custom hooks
- context providers
- generic components
- utility functions

unless they provide clear reuse or simplify the implementation.

Prefer simple, readable solutions.

---

# Code Conventions & Style

## 1. Naming Conventions

- Use `kebab-case` for file and directory names (e.g., `agent-card.tsx`, `crew-builder`). This holds in every folder, `features/` included: a file exporting `MessageBubble` is `message-bubble.tsx`.
- Use `PascalCase` for React component names and exported types/interfaces.
- Use `camelCase` for variables and utility functions.

## 2. Imports

- Always use absolute imports with the `@/` alias (e.g., `@/components/ui/button` instead of `../../components/ui/button`).

## 3. Clean Code Rules

- Keep components small and focused.
- Prefer early returns.
- Avoid deep nesting.
- Optimize for readability and maintainability.
- Prefer the simplest implementation when multiple solutions exist.
- Avoid premature optimization and over-engineering.
- Write self-documenting code.

---

# Project Structure

All source lives under `src/`; the `@/` alias points to `src/`.

```text
src/
  app/                  # routes; api/ holds route handlers (e.g. the mock-crew SSE stream)
  components/
    ui/                 # shadcn/ui primitives
    layout/             # app shell (workspace panels)
    providers/          # client providers mounted in the root layout
    features/
      <feature-name>/   # e.g. agent-chat
        renderers/      # optional sub-groups by region or role
  data/
    config/             # app-wide configuration (create when first needed)
  hooks/                # hooks reused across features
  lib/                  # utilities and mock data
  services/             # API client and stream parsing
  styles/               # theme CSS imported by app/globals.css (tokens/, themes/)
  store/                # Zustand stores
  types/                # shared domain types (e.g. crew-ai.ts)
public/
```

A hook used by a single feature stays inside that feature's folder rather than in `src/hooks/`. Do not create empty folders ahead of time.
