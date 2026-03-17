# Tic-Tac-Chess — Project Context

## Overview

A collection of digital board games. Currently chess is implemented in two modes: **hotseat** (local pass-and-play) and **online** (P2P via WebRTC/PeerJS). The project name "tic-tac-chess" reflects the broader vision of adding more games.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.4 (App Router) |
| UI | React 19.1.0 |
| Language | TypeScript 5 (strict mode) |
| Styling | TailwindCSS 4 |
| Localization | Custom (JSON + middleware), `@formatjs/intl-localematcher`, `negotiator` |
| P2P networking | PeerJS (WebRTC; free signaling server for handshake only) |
| Bundler | Turbopack (dev) |

Path alias: `@/*` → `./src/*`

---

## Project Structure

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx                  # Root layout (server component)
│       ├── page.tsx                    # Landing page (mode + game selection)
│       ├── chess/
│       │   ├── page.tsx                # Chess hotseat page
│       │   └── online/page.tsx         # Chess online page (P2P)
│       └── lobby/page.tsx              # Universal P2P lobby (3 screens: select/host/guest)
├── components/
│   ├── chess/                          # All chess UI components
│   │   ├── Chess.tsx                   # Root orchestrator (useReducer, modals)
│   │   ├── Board.tsx                   # 8x8 grid, click handling, move calculation
│   │   ├── Cell.tsx                    # Individual square (memoized)
│   │   ├── Piece.tsx                   # Piece icon + interactivity
│   │   ├── PiecesToExchange.tsx        # Pawn promotion picker
│   │   ├── HeaderBlock.tsx             # Turn info, status, restart; online: color label + hourglass
│   │   ├── HeaderButton.tsx            # Reusable header button
│   │   ├── LogBlock.tsx                # Move history (auto-scroll, undo)
│   │   ├── LogRecord.tsx               # Single move entry; online: color circle instead of undo
│   │   ├── ModalBlock.tsx              # Generic modal (chess-specific: takes TurnDetails)
│   │   ├── TakenPiecesBlock.tsx        # Captured pieces display
│   │   ├── ColCount.tsx                # Board column labels (a–h)
│   │   └── RowCount.tsx                # Board row labels (1–8)
│   ├── locale/
│   │   └── LocaleBlock.tsx             # Language switcher (URL-based navigation)
│   ├── TopLevelButton.tsx
│   └── TopLevelMenu.tsx                # Navigation menu; hidden on landing+lobby; confirm modal in online
├── context/
│   ├── AppProviders.tsx                # Combines all providers (P2PProvider outermost)
│   ├── GlobalStateContext.tsx          # locale (from useParams), t()
│   ├── PlayerStateContext.tsx          # playerState, setPlayerState
│   └── P2PContext.tsx                  # P2P state: peerId, status, opponentLeft, enable/connect/leaveGame etc.
├── hooks/
│   └── useP2PGame.ts                   # PeerJS hook (enabled flag, dynamic import for SSR)
├── lib/
│   ├── chess-engine/
│   │   ├── core/                       # Pure game logic — shared by all modes
│   │   │   ├── types.ts                # All TypeScript types & interfaces
│   │   │   ├── constants/
│   │   │   │   ├── board.ts            # Algebraic notation mappings
│   │   │   │   ├── dirs.ts             # Movement direction vectors per piece
│   │   │   │   ├── icons.tsx           # SVG piece icons
│   │   │   │   ├── pieceTypes.ts       # Piece type constants
│   │   │   │   └── san.ts              # Standard Algebraic Notation helpers
│   │   │   ├── utils/
│   │   │   │   ├── cellUtil.ts         # Algebraic notation conversions
│   │   │   │   ├── createBoard.ts      # 8×8 board generation
│   │   │   │   ├── pieceUtils.ts       # Piece query helpers + buildBoardMap
│   │   │   │   ├── populateBoard.ts    # Initial position setup
│   │   │   │   ├── styleUtils.ts       # Highlight / style computation + EMPTY_HIGHLIGHT
│   │   │   │   └── uciUtil.ts          # UCI notation encode/decode (online wire format)
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
│   │   │   │   ├── handleCapture.ts          # Marks captured piece as isTaken
│   │   │   │   ├── handleCastling.ts         # Moves rook during castling
│   │   │   │   └── handlePieceState.ts       # hasMoved flags, en passant tracking
│   │   │   ├── drawChecker/
│   │   │   │   └── drawChecker.ts            # Stalemate, insufficient material, repetition
│   │   │   └── gameStates/
│   │   │       └── definePlayerState.ts
│   │   ├── local/                      # Hotseat mode — React dispatch orchestration
│   │   │   ├── reducer/
│   │   │   │   └── chessReducer.ts     # Game state reducer (useReducer)
│   │   │   └── moveHandler/
│   │   │       ├── moveHandler.ts      # Piece selection + move execution
│   │   │       └── produceMoves.ts     # Move/exchange producers (call dispatch)
│   │   └── online/                     # P2P online mode
│   │       └── applyRemoteMove.ts      # Decode UCI + apply opponent move via dispatch
│   ├── icons/                          # Generic UI icons (SVG components)
│   ├── locales/
│   │   ├── en.json
│   │   ├── ru.json
│   │   ├── fr.json
│   │   └── locale.ts                   # Translation function (dot-notation paths)
├── middleware.ts                        # Locale detection + routing
└── global.css                          # TailwindCSS theme + custom animations (hourglass-flip)
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
- **`TurnDetails`** — full per-move record: `currentPlayer`, `fromCell`, `toCell`, `pieceToMove`, `pieceToTake`, `castling`, `check`, `checkmate`, `draw`, `ambiguity`, `hash`, `boardState`
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

All move generation functions accept `boardMap: Map<string, PieceType>` (built once via `buildBoardMap` in `pieceUtils.ts`) for O(1) cell lookups.

### Check / Checkmate / Draw

- **`checkKingSafety.ts`** — evaluates threats on king, returns check/checkmate/stalemate status
- **Double check** — only king moves are legal
- **Stalemate** — no legal moves + not in check
- **`drawChecker.ts`** — three draw conditions:
  - Stalemate
  - Insufficient material (K vs K, K+N vs K, K+B vs K, K+B(s same color) vs K)
  - Threefold repetition: `buildPositionHash` unifies board state + active player + castling rights + en passant

### Special Moves

- **Castling** — `handleCastling.ts`: verifies `hasMoved` on king & rook, clear path, king not in/through check; determines kingside (short) vs queenside (long)
- **En passant** — `handlePieceState.ts` sets `canBeTakenEnPassant` flag for one turn; `getMoveSet.ts` reads it
- **Pawn promotion** — two-phase locally: `produceMove` dispatches `START_EXCHANGE { boardState }`; `produceExchange` applies type change + dispatches `END_TURN`. In online mode `applyRemoteMove` handles it atomically in one `END_TURN` (promo char already known from UCI).

### Move Execution Pipeline (`Board.tsx` → `moveHandler.ts`)

1. `produceMove` creates `workingBoard` (shallow copy of all pieces with new `cell` objects)
2. `handleMoveClick(move, workingPiece, workingBoard)` — mutations on the copy:
   - `handleCapture()` — marks target as `isTaken`
   - `handleCastling()` — repositions rook if castling
   - `updateFlagsAndPosition()` — sets `hasMoved`, manages en passant, clears moveSet
3. `calcFoeState(workingBoard)` — recalculates all foe moves, check/checkmate/draw
4. Single `dispatch(END_TURN { turnPatch, boardState: workingBoard })`

`turnPatch` always includes `fromCell` and `pieceToMove` (set directly in `produceMove`) so both local and remote log entries are complete.

**Key invariant**: `state.currentBoardState` is never mutated directly.

### `handlePieceClick` (piece selection)

Creates a copy of the piece with cleared threats before calling `checkMoveSetForThreats`. Returns the copy — `state.currentBoardState` is never touched.

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

---

## Online Mode (P2P / Quick Play)

### Architecture

```
Host browser ──WebRTC──► Guest browser
     │                        │
     └── PeerJS signaling ────┘  (handshake only, ~1 KB)
```

- **Host** = white, **Guest** = black
- Wire format: **UCI notation** — `"e2e4"`, `"e7e8q"` (promotion)
- Protocol messages (JSON): `{"type":"init","game":"chess"}`, `{"type":"disconnect","role":"host"|"guest"}`

### Key Files

| File | Role |
|---|---|
| `useP2PGame.ts` | PeerJS hook: `peerId`, `status`, `connect`, `sendMove`, `disconnect` |
| `P2PContext.tsx` | React context wrapping the hook; adds `startGame`, `leaveGame`, `opponentLeft`, `registerGameHandler` |
| `applyRemoteMove.ts` | Decode UCI → find piece → find move → dispatch END_TURN |
| `uciUtil.ts` | `encodeMove` / `decodeMove` / `uciPromoToType` / `typeToUciPromo` |
| `lobby/page.tsx` | 3-screen lobby: select role → host (show code + shareable link) → guest (enter code, auto-connect via `?join=PEER_ID`) |
| `chess/online/page.tsx` | Renders `<Chess gameType="online">`, shows disconnect modal on drop |

### Turn Enforcement

- `Piece.tsx`: `"piece"` class (clickability) gated on `isCurrentPlayer = color === currentTurn && (hotseat || currentTurn === playerState.color)`
- `Cell.tsx`: hover effect also gated on `isMyTurn`
- `HeaderBlock.tsx`: shows "You play as White/Black" + hourglass animation when waiting for opponent's move

### Disconnect Handling

- **Intentional leave**: `TopLevelMenu` shows confirm modal on home button in online mode → `leaveGame()` sends `{"type":"disconnect","role":...}` → navigates home
- **Opponent left**: receiver sees named modal ("Host/Guest has disconnected.")
- **Unexpected drop**: `conn.on("close")` → status drops → "Connection lost." modal

---

## Localization

- **Languages**: English (`en`), Russian (`ru`), French (`fr`)
- **Locale detection**: `middleware.ts` — uses `Negotiator` + `@formatjs/intl-localematcher`; falls back to `en`; routes to `/[locale]/...`
- **Translation function**: `t("chess.glossary.pieces.pawn")` — dot-notation paths; supports `{{variable}}` interpolation
- **Runtime context**: `GlobalProvider` reads locale from URL via `useParams()`. All client components use `useGlobalState().t()`. Two-argument form `t(locale, path)` only in `layout.tsx` (server component).
- **Switching**: `LocaleBlock.tsx` navigates via `router.push` with replaced locale segment.
- **Content covered**: piece names, colors, draw types, castling, UI labels, move notation, modal messages, lobby/landing text, online-mode labels, meta title/description

---

## State Management

Four layers — no Redux/Zustand:

1. **`GlobalStateContext`** — `locale`, `t()`
2. **`PlayerStateContext`** — `playerState`, `setPlayerState`
3. **`P2PContext`** — connection state, online game orchestration
4. **`useReducer` in `Chess.tsx`** — full game state; move log enables unlimited undo (hotseat) or history display (online)

---

## Rendering — Memoization Notes

- **`Cell`** is wrapped in `memo`. Effective during piece selection. During move execution all cells with pieces re-render (new piece objects in `workingBoard`).
- **`highlights`** in `Board.tsx` — `useMemo([selectedPiece])`.
- **`EMPTY_HIGHLIGHT`** — module-level constant in `styleUtils.ts`; fallback prevents new object reference each render breaking `Cell` memo.
- **`dispatch`** from `useReducer` is stable — safe to pass as prop without `useCallback`.

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
- [x] Undo (rewind to any past position) — hotseat only
- [x] Move log with Standard Algebraic Notation
- [x] Captured pieces display
- [x] Localization (EN / RU / FR)
- [x] Responsive layout (mobile, tablet, desktop)
- [x] Online multiplayer — P2P Quick Play (PeerJS, no server)
- [x] Landing page with mode/game selection
- [x] Universal P2P lobby (room code + shareable link)
- [x] Disconnect handling (intentional + unexpected)
- [x] Turn enforcement in online mode

## What Is NOT Yet Implemented

- [ ] Online multiplayer — Mode 2: WebSocket + server + room list + accounts (stubs removed; see MULTIPLAYER_PLAN.md)
- [ ] Other board games (tic-tac-toe, etc.)
- [ ] 50-move rule draw
- [ ] Time controls / chess clock
- [ ] Computer opponent (AI)
- [ ] User accounts / game history persistence
- [ ] Game save / load (PGN export/import)
- [ ] Tests (unit, integration, E2E)

---

## Roadmap / Next Steps

### Optimization (remaining)
- **Immutability in moveSets** — `getAllActiveMoveSets` and `checkMoveSetForThreats` write `piece.moveSet = [...]` directly on objects in `currentBoardState`.
- **Stable piece references** — `workingBoard.map(p => ({ ...p }))` creates new objects for all 32 pieces even if only 2-3 changed.
- **Incremental moveSet recalculation** — recalculate only pieces affected by the move.

### Tests
- **Unit tests (Vitest)** — chess engine functions are pure/deterministic; priority: castling, en passant, pawn promotion, pin detection, all draw conditions
- **Reducer integration tests** — `gameReducer` with scripted move sequences
- **E2E (Playwright)** — full game flow, locale switching, undo, online lobby

### New Functionality
- **Online Mode 2** — WebSocket + room list + accounts (see MULTIPLAYER_PLAN.md)
- **Game save/load** — PGN export/import (SAN notation already in `LogRecord`)
- **AI opponent** — Stockfish via WebAssembly
- **Chess clock** — per-turn or per-game timer
- **Other games** — `app/[locale]/` structure is ready for expansion
- **Draw offer** — "Request draw" button in online mode is rendered but not wired up

### Code Quality
- **Immutability in engine** — separate pure layer (returns new state) from effectful layer (React dispatch)
- **Remove remaining `as Pieces` casts** — `pieceToMove.slice(0, -2) as Pieces` in `LogRecord`/`LogBlock`

---

## Public Assets

- `chess-logo.svg` / `chess-logo-dark.svg` — project logos (light/dark)
- Generic Next.js default icons (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)
