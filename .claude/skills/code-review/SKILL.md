---
name: code-review
description: >
  Apply this skill whenever code needs to be reviewed, audited, or critiqued —
  before a PR, after writing a feature, when debugging regressions, or when the
  user asks to "check", "review", "audit", or "look over" any code. Also trigger
  for security audits, performance analysis of existing code, and style/consistency
  checks. Use proactively after any large code generation session.
allowed-tools: Read, Grep, Glob, Bash
---
 
# Code Review Skill
 
You are conducting a structured code review. Work systematically through the checklist
below. Be specific: cite file + line numbers, explain *why* something is a problem,
and always propose a concrete fix or improvement.
 
## Review Priorities (in order)
 
### 1. Correctness & Logic
- Off-by-one errors, wrong boundary conditions
- Race conditions, shared mutable state
- Incorrect assumptions about input (nulls, empty, negative numbers)
- Error paths that silently swallow exceptions
- Return values that are ignored when they shouldn't be
 
### 2. Security
- Injection vectors (SQL, shell, template, path traversal)
- Secrets or credentials in code / logs
- Missing input validation or sanitization
- Insecure defaults (no TLS, weak crypto, world-readable files)
- Authentication / authorization gaps
- **Project-specific:** UCI message not validated before `decodeMove` (must be 4–5 chars, alphanumeric); `as` type casts (`as Pieces`, `as PieceType`) that silently bypass type safety; `dangerouslySetInnerHTML` — not used currently, must stay that way; PeerJS peer IDs shared via URL param `?join=` — never log or expose beyond intentional sharing
 
### 3. Performance
- N+1 query patterns
- Unnecessary allocations in hot paths
- Missing indexes or cache opportunities
- Blocking I/O in async contexts
- **Project-specific SLAs:** Move generation runs synchronously in the browser render loop — must complete in <16 ms (60 fps). Known bottlenecks: `workingBoard.map(p => ({ ...p }))` copies all 32 pieces on every move; `getAllActiveMoveSets` and `checkMoveSetForThreats` mutate `piece.moveSet` directly on `currentBoardState` objects. Check for new O(n²) scans over the 64-cell board or 32-piece array. `useMemo` and `memo()` on `Cell`/`Board` — verify deps arrays don't introduce unnecessary re-renders.
 
### 4. Maintainability
- Functions / methods doing more than one thing
- Magic numbers or unexplained constants
- Naming that misleads or omits intent
- Missing or outdated comments on non-obvious logic
- Dead code, commented-out blocks
 
### 5. Test Coverage
- Happy path only — are error branches tested?
- Missing edge cases (empty, max, concurrent)
- Tests that assert implementation rather than behaviour
- **Project-specific:** No tests exist yet. When tests are added (Vitest planned), chess engine pure functions should reach ~100%, game reducer ~90%. No CI configured — tests run locally with `npx vitest`.

### 6. Project Conventions
- **Naming:** PascalCase for React components (`Chess.tsx`, `Board.tsx`) and TypeScript types/interfaces (`GameState`, `TurnDetails`); camelCase for utilities, hooks, and functions (`getMoveSet`, `handleCapture`, `useP2PGame`); SCREAMING_SNAKE_CASE for reducer actions (`END_TURN`, `START_EXCHANGE`) and module-level constants (`EMPTY_HIGHLIGHT`).
- **File structure:** Components in `src/components/chess/`; engine pure logic in `src/lib/chess-engine/core/`; hotseat orchestration in `src/lib/chess-engine/local/`; online in `src/lib/chess-engine/online/`; hooks in `src/hooks/`; contexts in `src/context/`. Path alias `@/*` → `./src/*` — use it everywhere, no relative `../../` imports across module boundaries.
- **"use client" directive:** Required at top of any file using React hooks or browser APIs; server components (layout, page with no hooks) have no directive.
- **Error handling:** No error boundaries or global error handlers currently. P2P errors set `status = "error"` in `useP2PGame`. Engine errors should surface as TypeScript compile errors (strict mode). Do NOT silently swallow unexpected errors — flag or propagate.
- **Logging:** No logging infrastructure. `console.log` is dev-only debugging; do not commit `console.log` calls to production paths.
 
## Output Format
 
For each finding:
```
[SEVERITY: CRITICAL|HIGH|MEDIUM|LOW|NIT] filename:line
Problem: <one sentence>
Why it matters: <one sentence>
Suggested fix:
  <code or description>
```
 
Severities:
- **CRITICAL** — data loss, security breach, crash in production
- **HIGH** — likely bug or significant perf regression
- **MEDIUM** — correctness risk under edge cases
- **LOW** — maintainability / readability
- **NIT** — style, minor polish
 
End with a **Summary** section: counts per severity, overall assessment (Approve / Request Changes / Needs Discussion).
 
## What NOT to flag
- Personal style preferences not covered by project conventions
- Refactors that are purely aesthetic with no correctness/perf benefit
- Speculative future problems with no current evidence
 