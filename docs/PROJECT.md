# x-web

Twitter (X) clone. Development-only project: it will never be deployed to production.
Optimized for a fast, clean build — not for scale, hardening or observability.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (database + auth)

## Scope

### In

- Auth: sign up, log in, log out
- Home feed (timeline)
- Compose tweet
- Tweet detail with replies
- User profile
- Follow / unfollow
- Like
- Retweet

### Out

Direct messages, notifications, search, media upload, lists, communities, spaces, premium.

Cut because each one needs infrastructure the project does not need: realtime,
an event system, indexing or file storage. Revisit only if the core is finished.

## Phases

Each phase is split into blocks. A block is finished when it type-checks, lints,
builds, and the user has a commit message for it.

### Phase 0 — Foundations

1. Scope and routes
2. Data contracts (TypeScript types shared by UI and backend)
3. Design system: tokens, then primitives
4. Folder structure and data-access layer returning mocks

### Phase 1 — UI

Base layout → feed → composer → tweet detail → profile → auth.
All screens run on mocks typed against the Phase 0 contracts.

### Phase 2 — Backend

Supabase schema → RLS → auth → data access per resource.
An existing Supabase project is used; it is not created from scratch.

### Phase 3 — Wiring

Swap mocks for real data inside the data-access layer only.
No component should need to change.

## Architecture

Based on [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md),
adapted to the Next App Router.

```
src/
├── app/         Next routes only. Pages compose feature components, nothing more.
├── components/
│   ├── ui/      Design system primitives
│   └── layout/  Shared layout shells
├── config/      Constants, route definitions
├── features/    Feature modules (see below)
├── hooks/       Shared hooks
├── lib/         Preconfigured libraries (Supabase client, utils)
├── types/       Shared data contracts
└── utils/       Shared helpers
```

```
src/features/<feature>/
├── api/         Data access for this feature
├── components/  Feature-scoped components
├── hooks/
├── types/
└── utils/
```

### Rules

- **Unidirectional flow: shared → features → app.** Shared modules are importable
  anywhere. Features import only from shared. The app layer imports from both.
- **A feature never imports from another feature.** If two features need the same
  thing, it moves to shared.
- **No barrel files.** Import directly from the source file.
- **Routes stay thin.** Data fetching and composition live in the route; logic and
  markup live in the feature.
- **Components fetch nothing directly.** All data goes through a feature's `api/`
  layer, so Phase 3 touches one folder per feature.
- Server Components by default. Client Components only where interactivity requires it.
- **The Supabase client is called directly from a feature's `api/` layer.** No Next
  Route Handlers sit in between: Supabase already is the API, and an extra hop would
  be code with no purpose here.

## Working principles

- Componentize features and elements aggressively. Reuse before writing new code.
- Do not over-engineer. The simplest thing that is still clean wins.
- No abstractions built for a second use case that does not exist yet.

## Typography compensation

X uses Chirp, which is proprietary and not redistributable, so the app runs on
Inter. Inter reads lighter and wider at the same nominal values, so `globals.css`
shifts every Tailwind font-weight token up by 100 and applies `-0.4px` of
letter-spacing on `body`.

The consequence: `font-bold` renders at 800, not 700, and unstyled text at 500,
not 400. **Values measured on X are used as-is** — a heading measured at 700 is
written as `font-bold` and comes out at 800 on purpose.

If Chirp ever becomes available, reverting the token block in `globals.css`
restores every weight in the app at once.
