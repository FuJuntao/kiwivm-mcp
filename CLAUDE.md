# kiwivm-mcp

MCP server for managing KiwiVM (BuyVM) VPS instances via the 64clouds API.

## Architecture

```
src/index.ts          — MCP server entry point (stdio transport, McpServer)
src/client.ts         — KiwiVM API client (POST to api.64clouds.com/v1)
src/types.ts          — Shared types: KiwiVMResponse, KiwiVMError, domain interfaces
src/tools/            — Tool implementations (Zod schemas + registerTool)
```

### Tool Categories

| Module | Purpose |
|--------|---------|
| `power.ts` | Start, stop, restart, force kill VPS |
| `info.ts` | Service info, plan details, IPs, bandwidth; optional live status (CPU, RAM, disk, uptime) |
| `snapshots.ts` | Create, list, delete, restore, toggle sticky, export/import snapshots |
| `backups.ts` | List automatic backups, copy backup to restorable snapshot |
| `system.ts` | Set hostname, PTR/rDNS, reset root password, manage SSH keys, list/reinstall OS templates |
| `network.ts` | Add/delete IPv6 /64 subnets, assign/delete/list private IP addresses |
| `monitoring.ts` | Audit log, API rate limit status |
| `admin.ts` | Get suspensions/policy violations, unsuspend, resolve violations |

## Conventions

- **ESM only** — `"type": "module"` in package.json, use `.ts` extension in relative imports
- **Strict TypeScript** — extends `@tsconfig/strictest`, `@tsconfig/node-lts`, `@tsconfig/node-ts`
- **API client** — all requests go through `KiwiVMClient.call<T>()`, which handles auth (veid + api_key) and error unwrapping
- **Tool pattern** — each module exports a `create*Tools(server, client)` function that registers tools via `server.registerTool()` with Zod input schemas
- **Error handling** — throw `KiwiVMError` for API-level failures; the server handler catches and formats them
- **Linting/formatting** — Biome (`npm run lint`, `npm run format`, `npm run check`)
- **Testing** — vitest, colocated `*.test.ts` files
- **Build** — tsdown bundler (`npm run build` produces `dist/index.mjs`)
- **Commits** — follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description` (e.g., `feat(snapshots): add export support`, `fix(info): handle missing bandwidth data`). Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

## Scripts

```bash
npm test          # run vitest
npm run typecheck # tsc --noEmit
npm run build     # tsdown bundler → dist/index.mjs
npm run lint      # biome lint
npm run format    # biome format --write
npm run check     # biome check (lint + format dry run)
```

## Environment

Requires `KIWIVM_VEID` and `KIWIVM_API_KEY` to run.
