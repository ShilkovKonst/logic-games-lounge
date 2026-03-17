# Tic-Tac-Chess — Project Context

## Overview

A collection of digital board games. Currently only chess is implemented in local (hotseat) mode. The project name "tic-tac-chess" reflects the broader vision of adding more games.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.4 (App Router) |
| UI | React 19.1.0 |
| Language | TypeScript 5 (strict mode) |
| Styling | TailwindCSS 4 |
| Localization | Custom (JSON + middleware), `@formatjs/intl-localematcher`, `negotiator` |
| Bundler | Turbopack (dev) |

Path alias: `@/*` → `./src/*`

---

## Project Structure

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx          # Root layout (server component)
│       ├── page.tsx            # Home page
│       └── chess/page.tsx      # Chess game page
├── components/
│   ├── chess/                  # All chess UI components
│   │   ├── Chess.tsx           # Root orchestrator (useReducer, modals)
│   │   ├── Board.tsx           # 8x8 grid, click handling, move calculation
│   │   ├── Cell.tsx            # Individual square (memoized)
│   │   ├── Piece.tsx           # Piece icon + interactivity
│   │   ├── PiecesToExchange.tsx # Pawn promotion picker
│   │   ├── HeaderBlock.tsx     # Turn info, status, restart button
│   │   ├── HeaderButton.tsx    # Reusable header button
│   │   ├── LogBlock.tsx        # Move history (auto-scroll, undo)
│   │   ├── LogRecord.tsx       # Single move entry
│   │   ├── ModalBlock.tsx      # Generic modal
│   │   ├── TakenPiecesBlock.tsx # Captured pieces display
│   │   ├── ColCount.tsx        # Board column labels (a–h)
│   │   └── RowCount.tsx        # Board row labels (1–8)
│   ├── locale/
│   │   └── LocaleBlock.tsx     # Language switcher (URL-based navigation)
│   ├── TopLevelButton.tsx
│   └── TopLevelMenu.tsx        # Navigation menu
├── context/
│   ├── AppProviders.tsx        # Combines all providers
│   ├── GlobalStateContext.tsx  # locale (from useParams), t()
│   └── PlayerStateContext.tsx  # playerState, setPlayerState
├── lib/
│   ├── chess-engine/
│   │   ├── core/                  # Pure game logic — shared by all modes
│   │   │   ├── types.ts           # All TypeScript types & interfaces
│   │   │   ├── constants/
│   │   │   │   ├── board.ts        # Algebraic notation mappings
│   │   │   │   ├── dirs.ts         # Movement direction vectors per piece
│   │   │   │   ├── icons.tsx       # SVG piece icons
│   │   │   │   ├── pieceTypes.ts   # Piece type constants
│   │   │   │   └── san.ts          # Standard Algebraic Notation helpers
│   │   │   ├── utils/
│   │   │   │   ├── cellUtil.ts        # Algebraic notation conversions
│   │   │   │   ├── createBoard.ts     # 8×8 board generation
│   │   │   │   ├── pieceUtils.ts      # Piece query helpers + buildBoardMap
│   │   │   │   ├── populateBoard.ts   # Initial position setup
│   │   │   │   └── styleUtils.ts      # Highlight / style computation + EMPTY_HIGHLIGHT
│   │   │   ├── moveSets/
│   │   │   │   ├── getMoveSet.ts             # Legal moves per piece type
│   │   │   │   ├── generator.ts              # Sliding-piece move + attack generators
│   │   │   │   ├── getAttackSets.ts          # Threat detection per cell
│   │   │   │   ├── getAttackTrajectory.ts    # Path detection for blocking
│   │   │   │   ├── checkKingSafety.ts        # Check / checkmate / stalemate
│   │   │   │   ├── checkMoveSetForThreats.ts # Castling path safety check
│   │   │   │   ├── checkPieceFinalMoves.ts   # Pin detection + final move filter
│   │   │   │   ├── checkPinPiece.ts          # Pin logic
│   │   │   │   ├── filterAllValidMoves.ts    # Top-level move filter
│   │   │   │   └── getAllActiveMoveSets.ts   # All moves for a player
│   │   │   ├── moveExecution/
│   │   │   │   ├── handleCapture.ts    # Marks captured piece as isTaken
│   │   │   │   ├── handleCastling.ts   # Moves rook during castling
│   │   │   │   └── handlePieceState.ts # hasMoved flags, en passant tracking
│   │   │   ├── drawChecker/
│   │   │   │   └── drawChecker.ts  # Stalemate, insufficient material, repetition
│   │   │   └── gameStates/
│   │   │       └── definePlayerState.ts
│   │   ├── local/                 # Hotseat mode — React dispatch orchestration
│   │   │   ├── reducer/
│   │   │   │   └── chessReducer.ts    # Game state reducer (useReducer)
│   │   │   └── moveHandler/
│   │   │       ├── moveHandler.ts     # Piece selection + move execution
│   │   │       └── produceMoves.ts    # Move/exchange producers (call dispatch)
│   │   └── online/                # P2P online mode (future)
│   ├── icons/                     # Generic UI icons (SVG components)
│   ├── locales/
│   │   ├── en.json
│   │   ├── ru.json
│   │   ├── fr.json
│   │   └── locale.ts              # Translation function (dot-notation paths)
├── middleware.ts                  # Locale detection + routing
└── global.css
```

---

## Chess Engine — Implementation Details

### Types (`lib/chess-engine/core/types.ts`)

- **`Color`** — `"white" | "black"`
- **`Pieces`** — `"pawn" | "rook" | "knight" | "bishop" | "queen" | "king"`
- **`GameType`** — `"hotseat" | "online"`
- **`Player`** — `"host" | "guest"`
- **`BasePiece`** — `{ id, cell, color, isTaken, moveSet }`
- **`Pawn`** — adds `hasMoved`, `canBeTakenEnPassant`
- **`Rook`** — adds `hasMoved`
- **`King`** — adds `hasMoved`, `isInDanger`
- **`GameState`** — `{ currentBoardState, currentTurn, currentTurnNo, currentStatus, turnDetails, log, selectedPiece, isExchange }`
- **`TurnDetails`** — full per-move record: `currentPlayer`, `castling`, `check`, `checkmate`, `draw`, `ambiguity`, `hash`, `boardState`
- **`Status`** — `{ check: "CHECK" | "CHECKMATE" | "NORMAL", draw: "stalemate" | "insufficientMaterial" | "repetition" | "none" }`

### Move Generation

| File | Responsibility |
|---|---|
| `getMoveSet.ts` | Per-piece legal move generation (incl. pawn 2-square, en passant) |
| `generator.ts` | Sliding-piece ray generator; separate attack generator |
| `getAttackSets.ts` | Which opponent pieces threaten a given cell |
| `getAttackTrajectory.ts` | Path between attacker and king (for blocking moves) |
| `checkPinPiece.ts` | Detects if moving a piece exposes king to check |
| `checkPieceFinalMoves.ts` | Filters moves: removes pinned-piece illegal moves |
| `filterAllValidMoves.ts` | Top-level legal move filter |
| `getAllActiveMoveSets.ts` | All valid moves for entire current player |

All move generation functions accept `boardMap: Map<string, PieceType>` (built once via `buildBoardMap` in `pieceUtils.ts`) for O(1) cell lookups. The map is built at the two entry points: `getAllActiveMoveSets` and `checkMoveSetForThreats`.

### Check / Checkmate / Draw

- **`checkKingSafety.ts`** — evaluates threats on king, returns check/checkmate/stalemate status
- **Double check** — only king moves are legal
- **Stalemate** — no legal moves + not in check
- **`drawChecker.ts`** — three draw conditions:
  - Stalemate
  - Insufficient material (K vs K, K+N vs K, K+B vs K, K+B(s same color) vs K)
  - Threefold repetition: private `buildPositionHash` unifies both hash variants (board state + active player + castling rights + en passant)

### Special Moves

- **Castling** — `handleCastling.ts`: verifies `hasMoved` on king & rook, clear path, king not in/through check; determines kingside (short) vs queenside (long)
- **En passant** — `handlePieceState.ts` sets `canBeTakenEnPassant` flag for one turn; `getMoveSet.ts` reads it
- **Pawn promotion** — two-phase: `produceMove` executes the pawn move + dispatches `START_EXCHANGE { boardState: workingBoard }`; `produceExchange` applies the type change and dispatches `END_TURN`

### Move Execution Pipeline (`Board.tsx` → `moveHandler.ts`)

1. `produceMove` creates `workingBoard` (shallow copy of all pieces with new `cell` objects)
2. `handleMoveClick(move, workingPiece, workingBoard)` — mutations happen on the copy:
   - `handleCapture()` — marks target as `isTaken`
   - `handleCastling()` — repositions rook if castling
   - `updateFlagsAndPosition()` — sets `hasMoved`, manages en passant, clears moveSet
3. `calcFoeState(workingBoard)` — recalculates all foe moves, check/checkmate/draw
4. Single `dispatch(END_TURN { turnPatch, boardState: workingBoard })`

**Key invariant**: `state.currentBoardState` is never mutated directly. All mutations happen on `workingBoard` copies.

### `handlePieceClick` (piece selection)

Creates a copy of the piece with cleared threats before calling `checkMoveSetForThreats`. Returns the copy — `state.currentBoardState` is never touched.

```ts
const piece = { ...original, cell: { ...original.cell, threats: new Set() },
  moveSet: original.moveSet.map(m => ({ ...m, threats: new Set() })) };
checkMoveSetForThreats(piece, pieces, currentTurn);
return piece;
```

### Reducer Actions (`chessReducer.ts`)

| Action | Effect |
|---|---|
| `INIT` | Initialize new game |
| `SELECT_PIECE` | Store selected piece copy in state |
| `PATCH_TURN` | Update turn details mid-turn |
| `START_EXCHANGE` | Show pawn promotion UI; optionally updates `currentBoardState` via `payload.boardState` |
| `END_EXCHANGE` | (unused — `END_TURN` resets `isExchange`) |
| `END_TURN` | Finalize move, deep-copy board snapshot for log, advance turn, update status |
| `RESET` | Restore to a past position from log, or start fresh |

`END_TURN` reads `currentStatus` from `completedTurn` (not from `state.turnDetails`) so `turnPatch` values for check/checkmate are correctly reflected in status.

---

## Localization

- **Languages**: English (`en`), Russian (`ru`), French (`fr`)
- **Locale detection**: `middleware.ts` — uses `Negotiator` (Accept-Language) + `@formatjs/intl-localematcher`; falls back to `en`; routes to `/[locale]/...`
- **Translation function**: `t("chess.glossary.pieces.pawn")` — dot-notation paths; supports `{{variable}}` interpolation
- **Runtime context**: `GlobalProvider` reads locale from URL via `useParams()` — no localStorage, no manual switching. All client components use `useGlobalState().t()`. The two-argument form `t(locale, path)` is only used in `layout.tsx` (server component, no context access).
- **Switching**: `LocaleBlock.tsx` navigates via `router.push` with replaced locale segment — locale updates automatically via `useParams`.
- **Content covered**: piece names, colors, draw types, castling types, UI labels, move notation, modal messages, meta title/description

---

## State Management

Three layers — no Redux/Zustand:

1. **`GlobalStateContext`** — `locale` (from `useParams`), `t()`
2. **`PlayerStateContext`** — `playerState`, `setPlayerState`
3. **`useReducer` in `Chess.tsx`** — full game state, all chess logic; full move log enables unlimited undo

---

## Rendering — Memoization Notes

- **`Cell`** is wrapped in `memo`. Effective during piece selection (only highlighted cells re-render). During move execution all cells with pieces re-render regardless (new piece objects created in `workingBoard`).
- **`highlights`** in `Board.tsx` is wrapped in `useMemo([selectedPiece])`.
- **`EMPTY_HIGHLIGHT`** — module-level constant in `styleUtils.ts`, used as fallback in `highlight={highlights[cell] ?? EMPTY_HIGHLIGHT}`. Without this, `?? {}` would create a new object reference each render and break `Cell` memo entirely.
- **`dispatch`** from `useReducer` is stable — safe to pass as prop without `useCallback`.
- **`setIsReset` / `setModal`** from `useState` are stable — same.

---

## What Is Implemented

- [x] Chess rules: all piece movements
- [x] Turn order enforcement
- [x] Check detection
- [x] Checkmate detection
- [x] Stalemate detection
- [x] Castling (kingside + queenside)
- [x] En passant
- [x] Pawn promotion
- [x] Insufficient material draw
- [x] Threefold repetition draw
- [x] Pin detection
- [x] Undo (rewind to any past position)
- [x] Move log with Standard Algebraic Notation
- [x] Captured pieces display
- [x] Localization (EN / RU / FR)
- [x] Responsive layout (mobile, tablet, desktop)

## What Is NOT Yet Implemented

- [ ] Online multiplayer (P2P; `online/` directory in chess-engine is the placeholder)
- [ ] Other board games (tic-tac-toe, etc. — project name is aspirational)
- [ ] 50-move rule draw
- [ ] Time controls / chess clock
- [ ] Computer opponent (AI)
- [ ] User accounts / game history persistence
- [ ] Game save / load (PGN export/import)
- [ ] Tests (unit, integration, E2E)

---

## Roadmap / Next Steps

### Optimization (remaining)
- **Immutability in moveSets** — `getAllActiveMoveSets` and `checkMoveSetForThreats` write `piece.moveSet = [...]` directly on objects in `currentBoardState`. Same category as the mutation fixes already applied, but deeper in the engine.
- **Stable piece references** — `workingBoard.map(p => ({ ...p }))` creates new objects for all 32 pieces even if only 2-3 changed. Selective copying would make `Cell` memo work during move execution too.
- **Incremental moveSet recalculation** — `getAllActiveMoveSets` recalculates all pieces after every move. Could recalculate only pieces affected by the move (same rank/file/diagonal as the moved piece).

### Tests
- **Unit tests (Vitest)** — chess engine functions are pure/deterministic; priority: castling, en passant, pawn promotion, pin detection, all draw conditions
- **Reducer integration tests** — `gameReducer` with scripted move sequences
- **E2E (Playwright)** — full game flow, locale switching, undo

### New Functionality
- **Game save/load** — PGN export/import (SAN notation already implemented in `LogRecord`)
- **Online multiplayer (P2P)** — `GameState` + reducer architecture maps cleanly to P2P: serialize state, broadcast to peer; `core/` logic is already transport-agnostic
- **AI opponent** — Stockfish via WebAssembly
- **Chess clock** — per-turn or per-game timer
- **Other games** — `app/[locale]/` structure is ready for expansion

### Code Quality
- **Immutability in engine** — separate pure layer (returns new state) from effectful layer (React dispatch)
- **Remove remaining `as Pieces` casts** — `pieceToMove.slice(0, -2) as Pieces` pattern appears in `LogRecord` / `LogBlock`; could be replaced with a type guard

---

## Public Assets

- `chess-logo.svg` / `chess-logo-dark.svg` — project logos (light/dark)
- Generic Next.js default icons (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)
