---
name: architecture
description: >
  Use this skill for application architecture decisions: system design, component
  decomposition, service boundaries, data flow design, API design, database schema
  planning, scalability planning, and technology selection. Trigger when the user
  asks "how should I structure...", "what's the best architecture for...", "should
  I use X or Y for...", or is starting a new feature/service/system. Also trigger
  for ADR (Architecture Decision Record) creation, C4 diagrams, and reviewing
  existing architecture for issues. Use proactively before any large implementation.
allowed-tools: Read, Write, Grep, Glob
---

# Architecture Skill

Architecture decisions are expensive to reverse. Take time to enumerate options,
make tradeoffs explicit, and document decisions. Prefer boring technology.

## Before Designing — Gather Requirements

### Functional
- What does the system do? (user stories / use cases)
- What are the core entities and their relationships?
- What are the read/write patterns?
- What integrations are required (external APIs, third parties)?
- **Project domain model:** Core entities — `PieceType` (6 subtypes: Pawn, Rook, Knight, Bishop, Queen, King) × 2 colors × up to 16 per side; `MoveType` (target cell + threat set + optional Castling/EnPassant special); `TurnDetails` (full per-move record including SAN components, hash); `GameState` (board + turn + log + status). Relationships: a `GameState` owns a `PieceType[]` (currentBoardState) and a `TurnDetails[][]` log. Invariant: `currentBoardState` is never mutated directly — all moves produce a `workingBoard` copy.

### Non-Functional (fill in targets)
| Quality | Target | Notes |
|---------|--------|-------|
| Latency | <16 ms | Move generation (synchronous, browser main thread) |
| Throughput | 1 game session / 2 users | No server — client-only; P2P scales per browser pair |
| Availability | client-side only | PeerJS signaling server outage = can't start online game |
| Data durability | in-memory only | Game state lost on page refresh; no persistence |
| Recovery time | instant | Reload page to restart; no server recovery needed |
| Scale ceiling | unlimited concurrent games | Each game is independent P2P pair; no shared server |
| Security classification | public | No auth, no sensitive data; open board game |

## Architecture Patterns Menu

### Structural Patterns
- **Monolith** — start here unless you have strong evidence against it
- **Modular monolith** — bounded modules, single deploy unit
- **Microservices** — independent deploy, independent scale; high operational cost
- **Serverless** — event-driven, pay-per-use; cold starts, vendor lock-in
- **Project:** Modular monolith — single Next.js 15 App Router application. Modules are bounded by directory: `core/` (pure engine), `local/` (hotseat orchestration), `online/` (P2P bridge), `components/chess/` (UI), `context/` (shared state). Single deploy unit (Vercel or static export).

### Data Patterns
- **Single database** — ACID, simple; scale ceiling
- **Read replicas** — scale reads; eventual consistency on reads
- **CQRS** — separate read/write models; complexity cost
- **Event sourcing** — full audit log, time-travel; storage and query complexity
- **Sharding** — horizontal scale; cross-shard queries expensive
- **Project:** No database. All state is in-memory React state: `useReducer` (`GameState`) for game logic, React Context for shared/cross-component state (`GlobalStateContext`, `PlayerStateContext`, `P2PContext`). No persistence — game state is lost on refresh.

### Communication Patterns
| Need | Pattern | Technology options |
|------|---------|-------------------|
| Sync request-response | REST / gRPC / GraphQL | HTTP, HTTP/2 |
| Async work queue | Message queue | RabbitMQ, SQS, Redis |
| Event streaming | Event bus | Kafka, Kinesis, NATS |
| Real-time push | WebSocket / SSE | ws, socket.io |
| P2P | libp2p, WebRTC | see p2p-protocols skill |
- **Project:** Intra-component communication via React props + dispatch (reducer actions). Cross-component via React Context. Online move delivery via WebRTC DataChannel (PeerJS). No HTTP API, no WebSocket server, no message queue.

### Caching Strategy
- **No cache** — correct default until proven slow
- **In-process cache** — fastest, not shared, invalidation hard
- **Distributed cache** — shared, adds network hop, Redis/Memcached
- Cache invalidation triggers: TTL / event-based / write-through
- **Project:** In-process only. `useMemo([selectedPiece])` for `highlights` in `Board.tsx`. `EMPTY_HIGHLIGHT` module-level constant as stable fallback. `buildBoardMap(board)` called once per move-generation cycle (not cached across moves). No distributed cache; no TTL.

## Boundary Design (Bounded Contexts)

For each major module/service, define:
```
Name: <service/module name>
Responsibility: <one sentence — what it owns>
Owns data: <entities this service is the source of truth for>
Depends on: <other services/modules it calls>
Exposes: <APIs / events it publishes>
Does NOT do: <explicit exclusions to prevent scope creep>
```

## API Design Checklist
- [ ] Versioning strategy (URL path v1/ vs header vs content negotiation)
- [ ] Error response format consistent across all endpoints
- [ ] Pagination for all list endpoints
- [ ] Idempotency for all mutating operations (idempotency keys)
- [ ] Rate limiting and auth on all external endpoints
- [ ] OpenAPI / protobuf schema generated from code (not hand-written)
- **Project:** No REST API. Internal "API" is: (1) reducer `GameAction` union type in `chessReducer.ts` — dispatch actions are the write interface; (2) P2P wire protocol (UCI strings + JSON) documented in `CLAUDE.md` and `uciUtil.ts`; (3) React component props — TypeScript types are the contract. No versioning needed (single-client app).

## Database Schema Principles
- Every table has a surrogate primary key
- Foreign keys enforced at DB level (not just application)
- Index strategy documented per table
- Soft deletes vs hard deletes — decide and be consistent
- Migrations are backward compatible (expand/contract pattern)
- **Project:** No database. All data is in-memory React state. If persistence is added in the future, consider: PGN export to localStorage for game save/load; IndexedDB for game history; backend DB only for Mode 2 (WebSocket + accounts, see MULTIPLAYER_PLAN.md).

## Decision Record Template (ADR)

Create an ADR for every significant architectural decision:

```markdown
# ADR-NNN: <Title>

Date: YYYY-MM-DD
Status: Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Context
<What situation are we in? What problem needs solving?>

## Decision
<What have we decided to do?>

## Options Considered
### Option A: <name>
Pros: ...  Cons: ...

### Option B: <name>
Pros: ...  Cons: ...

## Consequences
Positive: ...
Negative: ...
Risks: ...

## Revisit Trigger
<What change in conditions would cause us to revisit this?>
```

Store ADRs in: `docs/adr/` (directory not yet created — create it when writing the first ADR)

## Architecture Review Checklist

Before finalising a design, verify:
- [ ] Single points of failure identified and mitigated
- [ ] Data flow diagram drawn (who reads/writes what)
- [ ] Security model: auth, authz, data at rest, data in transit
- [ ] Observability: metrics, logs, traces planned
- [ ] Failure modes enumerated (what happens when X goes down)
- [ ] Cost estimate for expected load
- [ ] Operational runbook for common failure scenarios
- [ ] Migration / rollout strategy from current state
- **Project review gates:** TypeScript strict mode must pass (`tsc --noEmit`); ESLint must pass (`next lint`); no `"use client"` on server components; no direct mutation of `state.currentBoardState`; new online wire messages must be handled in both `P2PContext.handleMessage` and documented in `uciUtil.ts` or `CLAUDE.md`.

## Technology Selection Criteria
When choosing between technologies, score on:
1. **Proven at our scale** — has it worked at similar load?
2. **Team familiarity** — learning curve cost
3. **Operational maturity** — tooling, monitoring, community
4. **Vendor risk** — open source vs. managed vs. proprietary
5. **Fit for purpose** — don't use a distributed system when SQLite works

Default to **the most boring option that meets requirements**.