# Showrunner's Second Brain

An AI-powered continuity and narrative intelligence workspace for the writers' room of Echoes of Tomorrow.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Optional env: `GEMINI_API_KEY` — enables the real server-side scene analysis pass using Google Gemini

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/showrunners-second-brain/src/App.tsx` — dashboard, screenplay workspace, local Series Bible context, and analysis panel
- `artifacts/api-server/src/routes/scene-analysis.ts` — provider-isolated Gemini analysis endpoint
- `lib/api-spec/openapi.yaml` — source of truth for the scene-analysis request and response contract

## Architecture decisions

- The first version keeps screenplay and Series Bible demo data local so the product can be explored without account setup or a database.
- Scene analysis is server-side; provider credentials never reach the browser, and the frontend only depends on the `/api/scene-analysis` contract.
- Gemini is the current provider adapter because it can be enabled with one optional `GEMINI_API_KEY`; the UI never imports provider SDKs.

## Product

The product gives a television writers' room a dashboard, a screenplay workspace, and a structured series bible. The Analyze Scene action sends the current scene plus canon context to a real AI provider, which returns evidence-backed continuity findings and narrative repairs. Without `GEMINI_API_KEY`, the app reports that analysis is unavailable rather than showing fake output.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
