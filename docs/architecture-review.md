# Architecture review

This review compares Matty Stack with the projects that have extended it most recently. It records what belongs in the starter and what should remain application-specific.

## Projects reviewed

### break-my-system

Useful baseline additions:

- The Vite development and preview servers share the same proxy configuration.
- `API_PROXY_TARGET` stays server-side, while the browser continues to use relative URLs.
- Railway domains and explicit extra hosts are allowed without accepting every host.
- The web `start` command binds to the platform-provided port.

Application-specific behavior such as sandbox scoping, terminal transport, cleanup intervals, and Redis inspection should stay out of the starter.

### mood-spotify-prints

Useful baseline additions:

- The Hono RPC client includes the `/api` mount point. Matty Stack previously created a client for the mounted sub-router but called `/projects` instead of `/api/projects`.
- Auth falls back to the page origin.
- A single Bun service can serve the built web app when a one-service deployment is preferable.

The static-serving choice is a deployment profile, not a universal default. The proxy model is more flexible because it also supports separate API and WebSocket services.

### spotify-roadtrip

Useful baseline additions:

- Production configuration fails early when required provider credentials or origins are missing.
- Related credentials are validated together instead of allowing a half-configured integration.
- Better Auth receives explicit base URL and trusted origins.

Provider-specific validation and cross-origin cookie settings should be added only when the application selects that deployment shape.

### swamp-sync-v2 and nicherank-v2

These projects confirm the value of the original Hono RPC, Better Auth, Drizzle, Redis, WebSocket, and integration-test foundation. They also preserve older copied setup, including the API mount mismatch and browser-facing localhost defaults, so they should not be copied back wholesale.

### Reroll

Useful baseline additions:

- The public web service is the browser edge and proxies `/api` and `/ws` to private upstreams.
- API and WebSocket proxy targets are independent.
- Empty `VITE_API_URL` and `VITE_WS_URL` values intentionally mean same-origin.
- Host-only cookies and same-origin routing avoid unnecessary cross-site cookie behavior.
- Runtime configuration is owned by the service that consumes it.

Reroll's circuit breakers, token refresh coordination, separate API/WebSocket/worker runtimes, shared packages, monitoring, and environment policy solve real production needs, but they are too specialized for a two-package starter.

## Changes adopted in Matty Stack

- Corrected Hono RPC URLs to include `/api`.
- Made auth, RPC, and WebSocket clients same-origin by default.
- Added configurable API and WebSocket proxy targets to both Vite dev and preview.
- Added safe deployed-host configuration and a platform-port-aware web start command.
- Passed explicit base URL, secret, and trusted origins to Better Auth.
- Added a workspace typecheck command.
- Removed an unmounted profile feature and a duplicate, unused fetch client.
- Colocated the project query and mutation with their only consumer.
- Removed unused UI primitives, dependencies, middleware, and helper exports; add them back when a feature actually needs them.

## Reroll template boundary

The recommended Reroll template should start from this smaller baseline and change only organization-owned defaults:

- package scope and project identity
- current Bun and shared dependency versions approved by Reroll
- same-origin web edge with independent private API and WebSocket proxy targets
- Reroll lint, format, CI, and environment-policy packages when those are available outside the main monorepo

It should not copy the production monorepo's game, payments, monitoring, worker, resilience, or authentication implementation. Those belong to product services and would turn a starter into a stale second platform.
