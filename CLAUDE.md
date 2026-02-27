# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Backendless JavaScript SDK (v7.4.9) — a multi-platform SDK providing access to Backendless BaaS services. Targets browser, Node.js, and TypeScript environments.

## Related Projects

All three projects live as siblings under the same parent directory:

```
../
├── JS-SDK/       # This repo — Backendless JS SDK
├── RT-Client/    # RT client library (dependency of this SDK)
└── rt-server/    # RT server (the server RT-Client connects to)
```

The dependency chain is: **JS-SDK → RT-Client → rt-server**

## Common Commands

```bash
npm run test:unit              # Run unit tests (most common during development)
npm run test:tsc               # TypeScript type-check only (validates backendless.d.ts)
npm test                       # Full test suite (tsc + unit tests + coverage)
npm run lint                   # ESLint with auto-fix on src/
npm run build:commonjs         # Compile to CommonJS (lib/)
npm run build:es               # Compile to ES modules (es/)
npm run build                  # Full production build (clean + lint + test + all formats)
npm run dev                    # Watch mode — rebuilds CommonJS on src/ changes
```

### Running a Single Test

```bash
npx mocha --require @babel/register test/unit/specs/data/store.js
npx mocha --require @babel/register --grep "pattern" --recursive test/unit/specs
```

Note: `--require @babel/register` is needed because source uses ES6 imports/decorators.

## Code Style

- No semicolons
- Single quotes
- Max line length: 120 characters
- `const`/`let` preferred over `var`
- Arrow function parens only when needed (`as-needed`)
- `no-console` is an error (use `// eslint-disable-next-line no-console` when necessary)
- Smart equality (`eqeqeq: smart`) — `===` required except for null comparisons

## Architecture

### Entry Point & Singleton Pattern

`src/index.js` exports a singleton `Backendless` instance. The `Backendless` class uses lazy-loaded services via getters — each service is instantiated on first access through `__getService()`.

### initApp Signatures

```javascript
Backendless.initApp('APP_ID', 'API_KEY')                // Two args
Backendless.initApp({ domain: 'https://example.com' })  // Options object
Backendless.initApp('https://example.com')               // Domain string
```

Passing `{ standalone: true }` creates an isolated instance instead of mutating the global singleton.

### Services (lazy-loaded from src/)

| Service | Module | Description |
|---------|--------|-------------|
| `Data` | `src/data/` | Persistence — DataStore CRUD, query builders, geo types, RT handlers |
| `Users` | `src/users/` | User management, roles, social login |
| `Files` | `src/files/` | File operations and permissions |
| `Messaging` | `src/messaging/` | Pub/Sub channels, push notifications, email |
| `BL` | `src/bl/` | Business Logic — custom services (`CustomServices`), `Events` |
| `Hive` | `src/hive/` | Key-value store with typed stores (KeyValue, List, Map, Set, SortedSet) |
| `Cache` | `src/cache/` | Server-side caching |
| `Counters` | `src/counters/` | Atomic counters |
| `Logging` | `src/logging/` | Remote logging |
| `RT` | `src/rt.js` | Real-time client (wraps `backendless-rt-client`) |
| `SharedObject` | `src/rso/` | Real-time shared objects |
| `UnitOfWork` | `src/unit-of-work/` | Transactions/batch operations |
| `LocalCache` | `src/local-cache/` | Client-side storage (localStorage or virtual) |
| `Automations` | `src/automations/` | Automations service |
| `Management` | `src/management/` | Management operations |

### Key Support Modules

- `src/request/` — `APIRequest` class wrapping `backendless-request` for HTTP communication
- `src/urls.js` — URL builder for all API endpoints
- `src/expression.js` — Expression/query syntax support
- `src/decorators/` — Custom decorators including `@deprecated`

### Backward Compatibility Aliases

- `Backendless.Persistence` → `Backendless.Data`
- `Backendless.applicationId` → `Backendless.appId`
- `Backendless.secretKey` → `Backendless.apiKey`

### Build Outputs

Three distribution formats produced by Babel/Webpack:
- `lib/` — CommonJS (package.json `main`)
- `es/` — ES Modules (package.json `module`)
- `dist/` — UMD browser bundle (package.json `browser`)

### TypeScript Definitions

`backendless.d.ts` in the project root — manually maintained, validated by `npm run test:tsc`.

## Test Structure

- **Framework:** Mocha + Chai + chai-spies
- **Unit tests:** `test/unit/specs/` (89 files, organized by service)
- **E2E tests:** `test/e2e/specs/`
- **Test sandbox:** `test/unit/helpers/sandbox.js` — provides `forTest()`, `forSuite()`, `prepareMockRequest()`, and re-exports a configured `Backendless` instance

### Test Pattern

```javascript
import Backendless, { forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('ServiceName', function() {
  forTest(this)

  it('does something', async () => {
    const req = prepareMockRequest({ objectId: 'test-id' })
    const result = await Backendless.Data.of('Table').save({ name: 'foo' })
    // assertions using chai expect
  })
})
```

`prepareMockRequest()` intercepts HTTP calls — tests do not hit a real server. The mock queues responses and captures request details (path, method, headers, body) for assertions.

## Dependencies

- `backendless-request` — HTTP abstraction layer
- `backendless-rt-client` — Real-time WebSocket client
- `@babel/runtime` — Babel runtime helpers
