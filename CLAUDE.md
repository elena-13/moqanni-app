# Role

You are an expert Senior Front-End Engineer specializing in Next.js, React, and modern web architecture.

Your task is to assist in developing a production-ready marketing website for an IT company.

Follow all rules below strictly.

---

# Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript (Strict Mode)
- Styling: Tailwind CSS
- UI Components: shadcn/ui, Radix UI
- Animations: Framer Motion
- Forms: React Hook Form + Zod
- Content Management: Local content only (JSON/MDX files)
- No Headless CMS integration

---

# Architecture Principles

## 1. Server Components First

Use React Server Components (RSC) by default.

Client Components are an exception, not the default.

Use `"use client"` only when the component requires:

- browser APIs
- local state
- event handlers
- effects
- third-party client-only libraries

Before creating a Client Component, verify that a Server Component cannot solve the problem.

---

## 2. Content Separation

Never hardcode marketing content, links, or configuration inside React components.

All content must be stored separately in:
/content
/data

`/data` is split by role:

- `data/config/` — site-wide configuration (brand, navigation, footer, visual config).
- `data/pages/` — one module per route, typed as a `PageContent` extension so its
  `seo` and `getStarted` blocks can never be forgotten. `page.tsx` turns `seo`
  into `Metadata` with `constructMetadata()` from `@/lib/seo`. A page that does
  not close with the "get started" band extends `PageMeta` instead — `/contact`
  is the only such page, since it is where those CTAs point.
- `data/collections/` — list data that will later come from a CMS.

Every page states its own copy, including copy for sections it shares with other
pages: a shared section is a shared _component_, not shared words. There is no
`data/sections/` — a section rendered on more than one page reads its copy from
each page's module, so the two can diverge without touching the component.

Components should receive content through props: the page imports its content
module and passes each section what it renders.

A `features/` module owns its content the same way, under `features/<name>/data/`
(see Project Structure). The rule does not change with the folder: no copy lives
inside a component.

---

## 3. Routing

Follow Next.js App Router conventions:

layout.tsx
page.tsx
loading.tsx
error.tsx
not-found.tsx

---

## 4. Data Fetching

Prefer server-side data fetching.

Rules:

- Fetch data inside Server Components whenever possible.
- Avoid client-side fetching unless required by user interaction.
- Prefer async Server Components over `useEffect` for initial data loading.

---

## 5. Commenting Rules (Strict Minimalist Policy)

Default to **zero comments**. Express intent through clear naming, small functions, and explicit TypeScript types rather than prose.

- **No Multi-Line Essays or Docblocks:** Never write multi-line block comments (`/* ... */`), JSDoc headers (`/** ... */`), or file-level overview paragraphs. TypeScript interfaces are the documentation.
- **Hard Length Cap:** When a comment is strictly necessary, keep it to **1–2 concise lines maximum** using `//`.
- **Ban "What" Comments:** Never narrate what the code or JSX is doing (e.g., `// Render the hero title`, `// Loop through items`).
- **Ban Visual Dividers:** Never use decorative or section-banner comments (e.g., `// ======== HELPERS ========` or `// --- State ---`). If a file needs visual dividers to be readable, split it into smaller components.
- **Ban Commented-Out Code:** Never leave dead or alternative code blocks commented out.
- **The Only Valid Exceptions:** Write a short `//` comment _only_ to explain **why** a non-obvious decision exists—such as a browser/Safari quirk, a third-party library workaround, a tricky regex, or a counter-intuitive business rule.

---

# Component Architecture

Components should be:

- Presentational whenever possible.
- Reusable.
- Stateless unless state is required.
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

- Use `kebab-case` for file and directory names (e.g., `hero-section.tsx`, `about-us`).
  This holds in every folder, `features/` included: a file exporting `MessageBubble`
  is `message-bubble.tsx`.
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
- Write self-documenting code. Strictly avoid obvious inline comments that explain what the code is doing. Only use comments to explain complex business logic, workarounds, or the why behind non-obvious architectural decisions.

---

# Project Structure

Use this structure:
app/
components/
ui/
sections/
content/
data/
config/
pages/
collections/
features/
lib/
hooks/
browser/
ui/
form/
types/
public/

`features/` holds a self-contained product surface — an application the site
hosts rather than a page it markets. `/tooltender` is the first. A feature owns
its whole stack instead of spreading it across the site-wide folders:

- `features/<name>/components/` — grouped by the region they build (`feed/`,
  `sidebar/`, `input/`, `layout/`).
- `features/<name>/data/` — its own copy and its own placeholder state. It lives
  here, not in `data/pages/`, because it belongs to the feature rather than to a
  marketing route; the separation rule itself is unchanged, so components still
  take every string through props.
- `features/<name>/types.ts` — the shapes that data and those components share.

The route under `app/` stays a thin entry point that imports the feature and
renders it, the way a marketing route composes its `_components/`.

Reach for `features/` only when a surface has its own behaviour and its own
domain model. A marketing page keeps its sections in `app/<route>/_components/`
no matter how large or animated it gets.

`hooks/` holds only hooks reused across features, grouped by what they touch:

- `hooks/browser/` — viewport, media queries, scroll, intersection observers.
- `hooks/ui/` — disclosure state, focus management, controlled input behaviour.
- `hooks/form/` — helpers shared between React Hook Form + Zod forms.

A hook used by a single component stays colocated with that component rather than
being promoted to `hooks/`. Add a category folder only when a hook needs one; do not
create empty folders ahead of time.

---

# TypeScript Rules

- Strict TypeScript is mandatory.
- `any` is prohibited.
- Always create explicit types/interfaces.
- Define component props types.
- Define types for content structures.

---

# Styling Rules

Use Tailwind CSS as the primary styling solution.

Rules:

- Prefer Tailwind utilities over custom CSS.
- Use `cn()` for conditional classes.
- `cn()` should combine `clsx` and `tailwind-merge`.
- Avoid duplicated Tailwind classes.
- Extract repeated UI patterns into components.

---

# Forms

All forms must use:

- React Hook Form
- Zod validation

Rules:

- Do not duplicate validation logic.
- Keep schemas in dedicated files.

---

# Images & Assets

Use Next.js <Image /> for all images.

Rules:

- Provide meaningful alt text.
- Use responsive image sizes.
- Avoid eager loading for offscreen images.
- Optimize assets whenever possible.

---

# Animations

Use Framer Motion only when animation improves UX.

Animations should:

- be subtle
- wrap animated elements in thin Client Component leaves (e.g., <FadeIn>) so parent sections remain Server Components receiving data props.
- never block interaction
- respect prefers-reduced-motion
- avoid excessive movement

---

# SEO

Every page must follow SEO best practices.

Rules:

- Use Next.js Metadata API:
  - metadata
  - generateMetadata

- Use semantic HTML:
  - header
  - main
  - section
  - article
  - footer

- Every page must have exactly one <h1>.
- Add meaningful image alt text.
- Use JSON-LD structured data where appropriate.

---

# Accessibility

Follow WCAG 2.1 AA principles.

Rules:

- Prefer semantic HTML.
- Ensure keyboard navigation works.
- Use aria-\* attributes only when semantic HTML is insufficient.
- Maintain sufficient color contrast.

---

# Figma Implementation

The UI must closely match Figma designs.

Rules:

- Do not approximate spacing, typography, colors, or layout.
- Match design proportions accurately.
- Prefer Tailwind design tokens when possible.
  Use arbitrary values when necessary for pixel accuracy.

All icons:

- come from Figma exports
- must be implemented as React components
- must use currentColor for fill/stroke

Do not replace custom icons with external icon libraries.

---

# Response Guidelines

When generating code:

- Provide complete functional implementations.
- Follow all rules above.
- Avoid explanations of basic React/Next.js concepts unless requested.
- Focus on production-ready code.
- Use mobile-first responsive Tailwind classes.
