---
name: testing
description: >
  Use this skill when writing, reviewing, or improving tests of any kind —
  unit, integration, end-to-end, property-based, load, or snapshot tests.
  Trigger when the user says "write tests", "add coverage", "test this function",
  "what should I test here", or when test coverage is missing after code generation.
  Also trigger for test architecture decisions: what to mock, what to stub,
  how to structure test suites, and debugging flaky tests.
allowed-tools: Read, Write, Bash, Grep, Glob
---

# Testing Skill

You are a test-design expert. Before writing a single test, understand the *behaviour*
being tested — not the implementation. Tests should survive refactors.

## Test Design Principles

### What to test
1. **Public contracts** — inputs → outputs, not internal state
2. **Business invariants** — rules that must always hold
3. **Failure modes** — what happens when dependencies fail, inputs are wrong
4. **Boundaries** — 0, 1, max, empty, negative, null/nil
5. **Concurrency** — if the code is concurrent, tests must exercise that

### What NOT to test
- Private methods directly (test via public API instead)
- Framework/library internals
- Trivial getters/setters with no logic
- **Project-specific exempt areas:** SVG icon components (`src/lib/icons/`, `src/lib/chess-engine/core/constants/icons.tsx`); locale JSON files (`src/lib/locales/*.json`); `global.css` TailwindCSS config; Next.js page wrappers that only render a single component.

## Test Anatomy (AAA)

```
// Arrange — set up state, mocks, inputs
// Act     — call the unit under test (one call per test)
// Assert  — verify outcomes (prefer one logical assertion)
```

Each test name: `<unit>_<scenario>_<expected result>`
Example: `processPayment_withExpiredCard_returnsDeclinedError`

## Coverage Strategy

| Layer | Target | Approach |
|-------|--------|----------|
| Pure functions / utils | ~100% | Unit tests |
| Business logic | ~90% | Unit + integration |
| I/O adapters (DB, HTTP) | N/A | No database, no HTTP API — client-only app |
| Critical user flows | key paths | E2E |
| Chess engine (`core/`) | ~100% | Vitest unit tests — functions are pure and deterministic |
| Game reducer (`chessReducer`) | ~90% | Vitest integration — scripted move sequences via `gameReducer()` |
| React components (`components/chess/`) | key interactions | React Testing Library — selection, move, promotion flows |
| P2P layer (`useP2PGame`, `applyRemoteMove`) | connection events + move decode | Vitest with mocked PeerJS `DataConnection` |
| E2E (full game flow) | critical paths | Playwright — game start, undo, locale switch, lobby flow |

## Mocking Guidelines
- Mock **at the boundary** (network, filesystem, time, randomness)
- Do NOT mock types you don't own (wrap them first)
- Prefer fakes over mocks for complex dependencies
- **Project-specific test doubles:** PeerJS `Peer` and `DataConnection` — stub with EventEmitter-like fake (emit `"open"`, `"data"`, `"close"` events manually); do NOT mock chess engine pure functions — call them directly with fabricated board states built via `populateBoard()` or `createBoard()` + manual piece placement; use `gameReducer()` directly for reducer tests (no React needed).

## Test Framework Conventions
- **Test runner:** Vitest (planned — not yet installed). Add with `npm install -D vitest @vitest/coverage-v8`. Run: `npx vitest`, watch: `npx vitest --watch`, coverage: `npx vitest --coverage`.
- **Assertion library:** Vitest built-in `expect` (compatible with Jest API). For React components: `@testing-library/react` + `@testing-library/user-event`.
- **Fixture / factory patterns:** Build board state via `populateBoard("white")` for a full starting position; for specific scenarios use `createBoard()` and place pieces manually by mutating the `cell` field. The `gameReducer` with `INIT` action is the cleanest way to create a testable `GameState`.
- **No database setup/teardown** — app is entirely client-side; no DB, no external services to spin up for unit/integration tests.
- **CI:** Not configured yet. When added, run `npx vitest run` (no watch) as part of the build step. E2E (Playwright) runs separately against `next dev` or `next start`.

## Flaky Test Checklist
When a test is intermittently failing, check:
- [ ] Time-dependent logic (use fake clock)
- [ ] Network / external service calls (mock them)
- [ ] Shared global state between tests (isolate)
- [ ] Random data without seed (fix seed)
- [ ] Race condition in async code (use proper await/synchronisation)
- [ ] Ordering dependency between tests (each test must be independent)

## Output Format

When writing tests, produce:
1. **Test file** with all cases
2. **Coverage note** — what scenarios are covered and what's explicitly left out
3. **Setup instructions** if new dependencies or config are needed