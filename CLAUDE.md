# CLAUDE.md — flowbite-react-template-vite

Lean reference for every session. Procedures live in `.claude/skills/`, not here.

---

## Tech Stack

| Layer             | Library                                      | Version                      |
| ----------------- | -------------------------------------------- | ---------------------------- |
| UI Framework      | React                                        | 19                           |
| Compiler          | React Compiler (babel-plugin-react-compiler) | 1.x                          |
| Build             | Vite                                         | 8                            |
| Language          | TypeScript                                   | 6, strict                    |
| Component library | flowbite-react                               | 0.12                         |
| Styling           | Tailwind CSS                                 | v4 (via `@tailwindcss/vite`) |
| Data fetching     | TanStack Query                               | v5                           |
| HTTP client       | ky                                           | v2                           |
| URL state         | nuqs                                         | v2                           |
| Debounce          | use-debounce                                 | v10                          |
| Icons             | lucide-react                                 | latest                       |
| Dates             | date-fns                                     | v4                           |
| Error boundary    | react-error-boundary                         | v6                           |

---

## Commands

```bash
npm run dev          # Vite dev server (HMR)
npm run build        # tsc -b && vite build
npm run lint         # ESLint
npm run format       # Prettier (writes)
npm run format:check # Prettier (check only)
npm run preview      # Serve the production build locally
```

There is **no test script and no test framework** in this project — don't invent
`npm test`. The only quality gates are `npm run lint` and `npm run format:check`;
run both before pushing. There is no CI and no pre-commit hook — nothing enforces
this automatically.

---

## Project Structure

```
src/
  components/   # Cross-feature SHARED UI, each in its own folder + index.ts barrel
    ErrorBoundaryFallback/
      ErrorBoundaryFallback.tsx
      index.ts
    index.ts    # top-level barrel re-exporting every shared component
  features/     # Domain modules — see the scaffold-feature skill before adding one
    [domain]/
      api/        # pure async ky fetchers
      components/ # UI local to this feature
      hooks/      # TanStack Query hooks (queries + mutations)
      types/
  pages/        # Route-level views
  App.tsx
  main.tsx      # Root: providers, ErrorBoundary, router
  index.css     # Tailwind base import
```

- **Shared, reused-across-features UI → `components/`.** UI specific to one domain
  → that feature's `components/`. Route-level views → `pages/`.
- **To scaffold a new feature module, follow the `scaffold-feature` skill** — don't
  improvise the folder layout or the data-fetching wiring.

### Component folder convention

Every component lives in its own folder with an `index.ts` barrel that re-exports
it. Keeps imports clean (`from "./components"`, never `../../Foo/Foo`).

```
src/components/MyWidget/
  MyWidget.tsx
  index.ts        # export { MyWidget } from "./MyWidget";
```

---

## Code Style

### Components

- **Arrow-function components, named exports** — never default exports, never
  `function` declarations.
- One component per file; filename matches the component (PascalCase).
- Props typed inline with an `interface` directly above the component. Use `type`
  only for union/intersection types.

```tsx
interface CardProps {
  title: string;
  description?: string;
}

export const Card = ({ title, description }: CardProps) => { ... };
```

### TypeScript

- Strict mode: `strict`, `strictNullChecks`, `noImplicitAny`, `noUnusedLocals`,
  `noUnusedParameters`. Prefix intentionally unused vars/args with `_`.
- `interface` for object shapes; `type` only for unions/intersections.
- Use `satisfies` to validate against a type without widening.
- **Never** use `as` or `// @ts-ignore` to silence a type error — fix the types.
- `!` non-null assertion is acceptable only at the DOM root (`getElementById("root")!`).

### Imports

- Always use `.tsx` / `.ts` extensions (required by `allowImportingTsExtensions`).
- Order: external packages → internal modules → styles.
- Named imports only; no `import *` (barrels excepted).

### React Compiler

The React Compiler auto-memoises components and hook outputs. Therefore:

- **Do not add `useMemo`, `useCallback`, or `memo`** — redundant noise.
- **Do not rely on referential stability** of values returned from hooks.
- Write plain, readable code; let the compiler optimise.

---

## Data, URL state, styling, errors (essentials)

- **Server data → TanStack Query.** Keep fetchers as pure async functions outside
  the component; type the response at the `ky` call site (`ky<T>(url).json()`).
  Always include every dependency in the `queryKey`. Mutations use `useMutation`
  and invalidate the affected key in `onSuccess`. (Full mutation/optimistic-update
  recipe → `scaffold-feature` skill.)
- **Shareable/navigable state → nuqs `useQueryState`** (filters, pagination, tabs).
  `useState` only for ephemeral local UI (open/close, hover). Don't duplicate URL
  params into component state.
- **Styling → Tailwind v4 utilities + flowbite-react.** Check the
  [Flowbite React docs](https://flowbite-react.com/) before hand-rolling a
  component. Dark mode via `dark:` variants + flowbite's `ThemeInit` /
  `DarkThemeToggle`. Classes are auto-sorted by `prettier-plugin-tailwindcss` —
  run `npm run format`. Custom `tailwindAttributes`/`tailwindFunctions` live in
  `prettier.config.js`. No inline styles or arbitrary CSS files.
- **Errors → the root `ErrorBoundary`** (react-error-boundary) in `main.tsx`, using
  `FallbackComponent` (not `fallback`) so the fallback gets `error` +
  `resetErrorBoundary`. Fallback lives in `src/components/ErrorBoundaryFallback/`.
  For feature-level boundaries, wrap the subtree in another `<ErrorBoundary>`
  rather than try/catch in components.

---

## Dos and Don'ts

| Do                                          | Don't                                            |
| ------------------------------------------- | ------------------------------------------------ |
| Named arrow-function components             | Default exports or `function` declarations       |
| `FallbackComponent` on `ErrorBoundary`      | Raw string/node `fallback` prop                  |
| `useQuery` / `useMutation` for server state | `useEffect` + `useState` for fetching            |
| `useQueryState` (nuqs) for URL state        | Duplicating URL params in component state        |
| Lean on React Compiler for memoisation      | Manual `useMemo` / `useCallback` / `memo`        |
| Tailwind utilities + flowbite-react         | Inline styles or arbitrary CSS files             |
| `interface` for object shapes               | `type` for plain object shapes                   |
| `index.ts` barrel in every component folder | Deep import paths like `../../MyWidget/MyWidget` |
| Fix types properly                          | Silence errors with `as` or `// @ts-ignore`      |
