# kiwivm-cli

CLI tool for managing KiwiVM (BuyVM) VPS instances via the 64clouds API.

## Architecture

```
src/index.ts          — CLI entry point (argument parsing, flat command routing)
src/client.ts         — KiwiVM API client (POST to api.64clouds.com/v1)
src/types.ts          — Shared types: KiwiVMResponse, KiwiVMError, domain interfaces
src/commands/         — Command implementations (one module per command/group)
```

See [doc/cli-design.md](doc/cli-design.md) for the full command reference and routing design.

## API Reference

See [doc/api.md](doc/api.md) for the full KiwiVM REST API documentation.
See [doc/cli-design.md](doc/cli-design.md) for the CLI command design.

## Conventions

- **ESM only** — `"type": "module"` in package.json, use `.ts` extension in relative imports
- **Strict TypeScript** — extends `@tsconfig/strictest`, `@tsconfig/node-lts`, `@tsconfig/node-ts`
- **API client** — all requests go through `KiwiVMClient.call<T>()`, which handles auth (veid + api_key) and error unwrapping
- **Command pattern** — each module exports named handler functions with signature `(args: string[], flags: Record<string, string>, client: KiwiVMClient) => Promise<unknown>`. Flat commands export one function per command; subcommand groups export one function per subcommand.
- **Error handling** — throw `KiwiVMError` for API-level failures; the CLI entry point catches and formats them
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
