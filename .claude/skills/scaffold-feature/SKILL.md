---
name: scaffold-feature
description: Scaffold a new domain feature module under src/pages/ with the project's api/components/hooks/types layout, TanStack Query + ky wiring, and the standard optimistic-mutation pipeline. Use when adding a new feature/domain, a new data-backed view, or wiring up queries and mutations for a resource.
---

# Scaffold a feature module

Use this when creating a new domain module under `src/features/`. Shared UI reused
across features stays in `src/components/`; route-level views go in `src/pages/`.
Only reach for a `features/` module when the work is a self-contained domain with
its own data fetching.

## 1. Directory layout

Replace `[domain]` with a lowercase kebab-case name. Every folder communicates only
through its `index.ts` barrel.

```text
src/features/[domain]/
├── api/                 # pure async ky fetchers — no React, no hooks
│   ├── fetch[Domain].ts
│   └── [domain].handlers.ts  # MSW handlers for this feature's endpoints (see §5)
├── components/          # UI local to this feature, each in its own folder
│   ├── [SubComponent]/
│   │   ├── [SubComponent].tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/               # TanStack Query queries + mutations
│   └── use[Domain]Data.ts
├── types/
│   └── index.ts         # exported interfaces for this domain
└── index.ts             # public surface of the feature
```

## 2. Rules

- **`api/` is pure data access.** Fetchers are plain `async` functions using `ky`,
  with the response typed at the call site: `ky<Resource>(url).json()`. No React,
  no hooks, no parsing chains inside components.
- **`hooks/` owns server state.** All queries/mutations go through TanStack Query.
  Always put every dependency in the `queryKey` (`["[domain]", id]`).
- **Shared/navigable state → nuqs `useQueryState`** (sort, active item, filters,
  pagination). Don't copy URL params into component state. `useState` only for
  ephemeral local UI (modals, hover, mobile sidebar).
- **No manual memoisation** — the React Compiler handles it. Never add `useMemo`,
  `useCallback`, or `memo`.
- **Styling**: Tailwind v4 utilities + flowbite-react components, with `dark:`
  variants for dark mode. Check flowbite-react before hand-rolling UI.
- **Components** are named arrow functions with inline `interface` props; one per
  file; PascalCase filename; each in its own folder with an `index.ts` barrel.

## 3. Optimistic-mutation pipeline

For mutations that add/update/delete items in a cached collection, wire `useMutation`
exactly like this:

```ts
const useUpdateThing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateThing, // from api/
    onMutate: async (next) => {
      // 1. Cancel in-flight refetches for this key so they don't clobber us.
      await queryClient.cancelQueries({ queryKey: ["[domain]"] });
      // 2. Snapshot current cache for rollback.
      const previous = queryClient.getQueryData(["[domain]"]);
      // 3. Optimistically write the expected next state.
      queryClient.setQueryData(["[domain]"], (old) => applyUpdate(old, next));
      // 4. Hand the snapshot to onError via context.
      return { previous };
    },
    onError: (_err, _next, context) => {
      // 5. Roll back to the snapshot.
      if (context) queryClient.setQueryData(["[domain]"], context.previous);
    },
    onSettled: () => {
      // 6. Revalidate against the server.
      queryClient.invalidateQueries({ queryKey: ["[domain]"] });
    },
  });
};
```

Simple (non-collection) mutations may skip the optimistic steps and just
`invalidateQueries` in `onSuccess`.

## 4. Mocking this feature's API for tests

Don't append this feature's endpoints directly into the shared
`src/mocks/handlers.ts` array — every feature editing that same literal array
is a routine merge-conflict generator. Instead:

```ts
// src/features/[domain]/api/[domain].handlers.ts
import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";

export const [domain]Handlers: HttpHandler[] = [
  http.get("/api/[domain]", () => HttpResponse.json([/* ... */])),
];
```

```ts
// src/mocks/handlers.ts
import { [domain]Handlers } from "../features/[domain]/api/[domain].handlers.ts";

export const handlers: HttpHandler[] = [...[domain]Handlers];
```

Component tests for this feature (`use[Domain]Data.test.ts`, etc.) then rely on
the shared `src/test/setup.ts` MSW server — no per-test `setupServer` needed.

## 5. Before finishing

- Each new component folder has an `index.ts` barrel; the feature's top-level
  `index.ts` re-exports its public surface.
- Types live in `types/`, imported with `.ts` extensions.
- `npm run lint && npm run format:check` both pass.
