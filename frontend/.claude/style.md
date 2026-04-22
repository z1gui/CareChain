# Code Style Guide

## File & Directory

- **kebab-case** for all files and directories under `src/` (except `*.md`, `*.env`).
- One React component per file, named after the file.
- Page routes use `page.tsx` inside named folders (Next.js App Router convention).

## Component Patterns

- Export a **named function** for React components. Never use `export default`.
- Prefer interfaces over types for component props.
- Props interface is named `{ComponentName}Props`.
- Use `'use client'` only when client interactivity (hooks, browser APIs) is actually needed.

```tsx
// Good
interface StatCardProps {
  label: string
  value: string | number
}

export function StatCard({ label, value }: StatCardProps) {
  return <div>{value}</div>
}

// Bad
export default function StatCard(props: { label: string }) {
  return <div />
}
```

## Imports

- Use `@/` path alias for internal imports.
- Group imports in this order, enforced by ESLint perfectionist:
  1. Types (`import type`)
  2. Builtins (React, Next.js)
  3. External libraries
  4. Internal (`@/`)
  5. Relative imports
  6. Side effects
- Never leave unused imports.

```tsx
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { useWalletConnection } from '@solana/react-hooks'
import { motion } from 'motion/react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/utils'
```

## Styling (Tailwind CSS v4)

- Use Tailwind utility classes only. No inline `style` props except for dynamic values (e.g. width percentages).
- Prefer project design tokens over arbitrary values:
  - `bg-surface`, `text-on-surface`, `border-outline-variant`
  - `rounded-5xl`, `rounded-xl` — never raw pixel values like `rounded-[16px]`
- Combine with `cn()` for conditional classes.
- Use `space-y-*` and `gap-*` for spacing; avoid margin-top on first children.

```tsx
// Good
className={cn(
  'bg-surface-container-low p-6 rounded-xl',
  isActive && 'ring-2 ring-primary',
  className,
)}

// Bad
className="p-[24px] bg-[#fafafa]"
```

## shadcn/ui Components

- Add via `pnpm run shadcn`, never global `shadcn` CLI.
- Built on `@base-ui/react` primitives, not Radix.
- Use `cva` for variants and `cn()` for class merging.
- Keep components in `src/components/ui/` with kebab-case filenames.

## Icons

- Use **Material Symbols Outlined** for UI icons:
  ```tsx
  <span className="material-symbols-outlined">settings</span>
  ```
- Use **lucide-react** only inside shadcn/ui primitives where required.

## TypeScript

- Strict mode enabled. No `any` without justification.
- Nullable values use the global `Nullable<T>` type.
- Prefer explicit return types on public utilities, not on React components.

## State & Hooks

- Use React hooks directly. No custom hook abstractions unless reused 3+ times.
- `useMemo` / `useCallback` only when profiling shows a real benefit.
- Form state: keep it local with `useState` unless shared across routes.

## Error Handling

- Catch and handle wallet connection errors gracefully.
- Async functions: use `try/catch`, never silent `.catch()`.

## Formatting

- Single quotes, no semicolons, 2-space indent — enforced by ESLint.
- Run `pnpm lint:fix` before committing.
