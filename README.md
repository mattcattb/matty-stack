# matty-stack

matty-stack is my personal full-stack starter for building new apps quickly with the tools I reach for most: Bun, Hono, React, Better Auth, Drizzle, Postgres, Redis, and shadcn-style UI primitives.

## Live Demo

No hosted demo yet. Run it locally with the commands below.

## Screenshots

Screenshots are not checked in yet.

Suggested structure:

```txt
docs/images/homepage.png
docs/images/dashboard.png
```

## Tech Stack

- Frontend: React, TanStack Router, TanStack Query, Tailwind CSS, Radix UI primitives
- Backend: Bun, Hono, Hono RPC, Zod validation
- Database: PostgreSQL, Drizzle ORM
- Auth: Better Auth with Drizzle adapter
- WebSockets/cache: Redis, Bun/Hono WebSockets
- APIs: Typed Hono RPC client shared with the web app
- Deployment: Not prescribed; designed to work with simple Bun-compatible hosts

## Features

- Better Auth email sign up, sign in, sign out, and session handling.
- Authenticated project example with typed Hono RPC calls from the web app.
- Postgres schema and migrations through Drizzle.
- Redis client and small connection, shutdown, and event lifecycle helpers.
- Basic `/ws` WebSocket endpoint as a starting point for live features.
- Centralized `src/hooks/useWebsocket.ts` hook with `react-use-websocket`, reconnect, and heartbeat defaults.
- Small `src/hooks/useClipboard.ts` example for app-wide reusable UI behavior.
- shadcn/Radix-style UI primitives with `components/common` and `features` examples.
- Docker Compose for local Postgres and Redis.

## Why I Built This

I wanted a starter that gets the boring setup out of the way without becoming a framework I have to fight. The point is to start with my usual stack, keep the code readable, and make every optional piece easy to keep, change, or delete.

## My Role

This is a personal starter. I built the server structure, auth/database setup, Redis and WebSocket scaffolding, frontend routes, UI primitives, common component examples, and feature folder examples.

## Architecture

- React frontend uses TanStack Router for pages and TanStack Query for server state.
- Web routes stay thin and compose feature modules from `src/features`.
- App-wide reusable hooks live in `src/hooks`; feature-only hooks stay colocated with their feature.
- Vite proxies same-origin `/api` and `/ws` requests to configurable upstreams in development and deployed previews.
- Hono server mounts auth, API routes, and WebSocket routes from `src/app.ts`.
- `src/server.ts` handles runtime startup, Redis connection, and cleanup.
- Hono RPC types are exported from the server and consumed by the web client.
- Drizzle manages Postgres schema and migrations.
- Redis is available for caching, WebSocket coordination, scheduled jobs, or temporary state.

## Hard Parts

- Keeping the starter useful without over-abstracting it.
- Setting up auth, database, RPC typing, CORS, Redis, and WebSockets in a way that stays simple.
- Drawing a clear line between reusable UI primitives, common components, and feature-specific code.

## What I Learned

- Starter code should be optimized for deletion as much as reuse.
- Route files stay easier to work with when feature logic is colocated in `src/features`.
- Small runtime helpers are enough for connections, cleanup, events, and scheduled tasks.
- Type inference from Hono RPC, Zod, and Drizzle avoids a lot of one-off local types.

## Running Locally

```bash
git clone <repo-url>
cd matty-stack
cp .env.example .env
bun install
docker compose up -d
bun run db:migrate
bun run dev
```

Default URLs:

- Web: `http://localhost:5173`
- Server: `http://localhost:3000`
- WebSocket: `ws://localhost:3000/ws`

By default the web app calls relative `/api` and `/ws` URLs through the Vite proxy. This keeps cookies first-party and removes browser-facing CORS configuration from the normal path.

For a deployed preview with private upstream services, keep `VITE_API_URL` and `VITE_WS_URL` empty and set server-only proxy targets:

```env
API_PROXY_TARGET=http://api.internal:3000
WS_PROXY_TARGET=http://ws.internal:4001
```

Set `VITE_API_URL` or `VITE_WS_URL` only when the browser genuinely needs to call another public origin.

## Clone Checklist

When cloning this starter into a new app, change the project identity first:

- package names in `package.json` and workspace package files
- `COMPOSE_PROJECT_NAME`, `POSTGRES_DB`, `DATABASE_URL`, and `REDIS_URL`
- published Docker ports if you run multiple cloned apps at once
- `BETTER_AUTH_URL` to the public web origin
- `API_PROXY_TARGET` and `WS_PROXY_TARGET` when the deployed web service proxies to private upstreams
- `CORS_ORIGINS`, `VITE_API_URL`, and `VITE_WS_URL` only for split-origin deployments
- README title, screenshots, hard parts, and feature list

## Optional Areas To Keep Or Delete

- `src/hooks/useWebsocket.ts`: keep when the app needs live updates, delete when basic RPC is enough.
- `src/hooks/useClipboard.ts`: example shape for small reusable app hooks.
- `src/features/projects/ProjectsPanel.tsx`: route-local query and mutation example using inferred Hono RPC types.
- `src/lib/redis.ts`: keep for cache, rate limits, queues, presence, or temporary state.
- `src/common/events.ts`: keep when multiple server modules need to react to runtime events.
- `src/common/server.ts`: can start and stop simple in-process interval tasks; use a worker/queue when jobs need durability.
- `components/common`: promote reusable feature components here only after they are used in more than one feature.

## Testing

Server feature tests use Bun's built-in test runner and real Postgres integration tests.

The pattern is:

- colocate tests beside the feature, for example `src/projects/projects.test.ts`
- use `src/test/db.ts` for shared test setup
- wipe tables before each test and after the suite
- insert only the setup rows the feature needs

Run them with:

```bash
bun run infra:up
bun run db:migrate
bun run test
```

This starter keeps tests intentionally direct. If a feature only needs service-level coverage, test the service against the database. If route behavior matters, add route-level tests around `app.request`.
## Scripts

- `bun run dev` - run server and web
- `bun run dev:server` - run server only
- `bun run dev:web` - run web only
- `bun run build` - build all packages
- `bun run typecheck` - typecheck all packages
- `bun run test` - run server integration tests
- `bun run infra:up` - start Postgres and Redis
- `bun run infra:down` - stop local infra
- `bun run db:generate` - generate Drizzle migrations
- `bun run db:migrate` - run Drizzle migrations
- `bun run db:studio` - open Drizzle Studio
