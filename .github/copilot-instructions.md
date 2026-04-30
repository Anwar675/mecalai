# AI Coding Instructions for MecaLai

## Project Overview
MecaLai is a Next.js SaaS application for AI-powered meeting management. Users create customizable AI agents, conduct video meetings via Stream SDK, and get automated transcripts and summaries processed asynchronously with Inngest and OpenAI.

**Core Architecture:**
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend:** tRPC for type-safe APIs, Drizzle ORM with PostgreSQL (Neon), Better Auth for authentication
- **Real-time:** Stream SDK for video calls and chat
- **Async Processing:** Inngest for background jobs (meeting transcription/summarization)
- **Payments:** Polar.sh integration for subscriptions
- **State Management:** TanStack Query for server state, nuqs for URL state

**Key Data Flow:**
1. User creates agent with custom instructions
2. User starts meeting with agent (video call via Stream)
3. Meeting ends, triggers Inngest function to process transcript
4. OpenAI summarizes transcript, updates meeting record

## Module Structure
Features are organized in `src/modules/` with consistent structure:
- `hooks/`: Custom React hooks (e.g., `useAgentsFilters` uses nuqs for URL params)
- `server/`: tRPC procedures, schemas, types
  - `procedures.ts`: Router with CRUD operations
  - `schema.ts`: Zod schemas for validation
  - `type.ts`: TypeScript types derived from schemas
- `ui/`: React components (forms, tables, views)

Example: `src/modules/agents/` implements agent management with full CRUD.

## Authentication & Authorization
- Uses Better Auth with email/password + social providers (GitHub, Google)
- tRPC procedures: `protectedProcedure` requires session, `premiumProcedure` checks Polar subscription
- Session retrieved via `auth.api.getSession({ headers: await headers() })` in tRPC context
- Premium limits enforced in procedures (e.g., `MAX_AGENT_FREE`, `MAX_FREE_MEETING`)

## Database Patterns
- Drizzle ORM with PostgreSQL
- Schema in `src/db/schema.ts` (separate auth schema in `auth-schema.ts` for Better Auth)
- Relations: `user` → `agents` → `meetings`
- Migrations via `drizzle/` folder
- Commands: `npm run db:push` (apply schema), `npm run db:studio` (view DB)

## API Layer (tRPC)
- Routers in `src/trpc/routes/`
- Procedures use `protectedProcedure` or `premiumProcedure`
- Mutations invalidate queries: `queryClient.invalidateQueries(trpc.agents.getMany.queryOptions())`
- Error handling: Throw `TRPCError` with codes like "NOT_FOUND", "FORBIDDEN"

## UI Patterns
- Forms: React Hook Form + Zod resolver, Controller for controlled inputs
- Components: shadcn/ui (Button, Input, Table, etc.)
- Data fetching: TanStack Query with tRPC integration
- Notifications: Sonner toasts for success/error
- Routing: Next.js `useRouter` for navigation (e.g., redirect to `/upgrade` on premium required)

## Async Processing (Inngest)
- Functions in `src/inngest/functions.ts`
- Events trigger processing (e.g., `"meetings/processing"`)
- Steps: Fetch data, process with AI agents (OpenAI), update DB
- AI agents created with `@inngest/agent-kit` for summarization

## Development Workflow
- **Start dev:** `npm run dev` (uses Turbopack)
- **Build:** `npm run build` (Turbopack enabled)
- **DB setup:** `npm run db:push` to sync schema
- **DB inspection:** `npm run db:studio`
- **Linting:** `npm run lint` (ESLint)
- **Webhooks dev:** `npm run dev:webhook` (ngrok tunnel)

## Key Files to Reference
- `src/db/schema.ts`: Database schema and relations
- `src/trpc/init.ts`: tRPC setup with auth and premium middleware
- `src/modules/agents/server/procedures.ts`: Example tRPC router
- `src/modules/agents/ui/agent-form.tsx`: Example form with validation and mutations
- `src/inngest/functions.ts`: Async processing with AI summarization
- `src/lib/auth.ts`: Better Auth configuration with Polar integration

## Conventions
- Use `nanoid()` for string IDs (agents, meetings)
- Premium checks: Query Polar customer state, count user entities
- Error redirects: Router.push("/upgrade") on "FORBIDDEN" errors
- Query invalidation: Always invalidate related queries after mutations
- URL state: Use nuqs parsers for filters/pagination (e.g., `parseAsString.withDefault("")`)
- Component props: `onSuccess`, `onCancel` callbacks for modals/forms