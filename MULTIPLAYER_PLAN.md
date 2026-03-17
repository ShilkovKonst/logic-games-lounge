# Plan: Online Multiplayer (P2P, no backend)

Technology: **WebRTC via PeerJS** — PeerJS's free signaling server is used only
for the handshake (~1 KB, once). After the connection is established all traffic
goes directly between browsers.

Message format: **UCI notation** — `"e2e4"`, `"e7e8q"` (promotion), 4–5 chars.
Decoded using the existing `handlePieceClick` + `produceMove` / `produceExchange`.

---

## Step 1 — Install PeerJS

```bash
npm install peerjs
```

Types are bundled with the package, no separate `@types` install needed.

---

## Step 2 — Write the `useP2PGame` hook

**File:** `src/hooks/useP2PGame.ts`

The hook encapsulates all connection logic. Interface:

```ts
type UseP2PGameReturn = {
  peerId: string | null;               // host's ID shown as the room code
  status: P2PStatus;                   // "idle" | "waiting" | "connected" | "error"
  connect: (remoteId: string) => void; // guest calls this with the host's code
  sendMove: (msg: string) => void;     // send a UCI string to the opponent
  disconnect: () => void;
};
```

Internals:
1. Create `new Peer()` on mount — receive `peer.id`
2. Host: waits for an incoming connection via `peer.on("connection")`
3. Guest: calls `peer.connect(remoteId)`
4. On incoming data: `conn.on("data", msg => applyRemoteMove(msg, ...))`

---

## Step 3 — Write `applyRemoteMove`

**File:** `src/lib/chess-engine/online/applyRemoteMove.ts`

Lives in `online/` — online-mode orchestration. Imports `produceMove`/`produceExchange`
from `local/` because both modes share the same React `dispatch` pipeline.

```ts
import { GameState }        from "@/lib/chess-engine/core/types";
import { getPieceAt }       from "@/lib/chess-engine/core/utils/pieceUtils";
import { decodeMove }       from "@/lib/chess-engine/core/utils/uciUtil";
import { handlePieceClick } from "@/lib/chess-engine/local/moveHandler/moveHandler";
import { produceMove,
         produceExchange }  from "@/lib/chess-engine/local/moveHandler/produceMoves";
import { GameAction }       from "@/lib/chess-engine/local/reducer/chessReducer";

export function applyRemoteMove(
  msg: string,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>
): void
```

Algorithm:
1. Parse via `decodeMove(msg)`: `fromCell`, `toCell`, `promo`
2. Find the piece: `getPieceAt(fromCell, state.currentBoardState)`
3. Compute its moveSet: `handlePieceClick(piece.id, state.currentBoardState, state.currentTurn)`
4. Find the move: `piece.moveSet.find(m => m.id === toCell)`
5. Apply: `produceMove(piece, state, dispatch, toCell)`, or
   `produceExchange(piece, state, dispatch, promo)` when a promotion char is present

If no matching move is found — ignore the message (invalid input).

**Castling in `applyRemoteMove`:**
Castling is encoded as a regular king move — `"e1g1"` (kingside) or `"e1c1"`
(queenside). Neither side adds a special marker. On the receiving end the king's
`moveSet` already contains both castling moves with `special.type === "castling"`.
When `applyRemoteMove` finds a move by `toCell === "g1"` or `"c1"` it passes it
to `produceMove` — which internally calls `handleMoveClick` → `handleCastling`
to reposition the rook. No extra protocol handling for castling is needed.

---

## Step 4 — Write the UCI encoder/decoder

**File:** `src/lib/chess-engine/core/utils/uciUtil.ts`

Lives in `core/` — pure encoding logic, no side effects, no React.

```ts
// Encoder — called after produceMove, before sendMove
export function encodeMove(fromCell: string, toCell: string, promo?: string): string

// Decoder — called inside applyRemoteMove
export function decodeMove(msg: string): { fromCell: string; toCell: string; promo: string | null }
```

Examples:
- `encodeMove("e2", "e4")` → `"e2e4"`
- `encodeMove("e7", "e8", "q")` → `"e7e8q"` (promotion)
- `encodeMove("e1", "g1")` → `"e1g1"` (kingside castling — king move)
- `encodeMove("e1", "c1")` → `"e1c1"` (queenside castling — king move)
- `encodeMove("e5", "d6")` → `"e5d6"` (en passant — regular notation)

Castling and en passant require no special symbol: `move.special` is read
by the engine inside `produceMove`.

---

## Step 5 — Integrate move sending into `Chess.tsx`

Wrap `dispatch` in `Chess.tsx` so that after every move a UCI string is sent
to the opponent.

Concretely: after `END_TURN` read from the updated `state.turnDetails`:
`fromCell`, `toCell`, and `pieceToExchange` (if promotion) — then call
`sendMove(encodeMove(...))`.

Implementation options: a `useEffect` on `state.currentTurnNo`, or a
proxying `dispatch` wrapper inside the `useP2PGame` hook.

---

## Step 6 — Create the lobby page

**File:** `src/app/[locale]/chess/online/page.tsx`

Two modes:

**Create a game (host):**
- Display the room code (peer ID)
- "Copy code" button
- Wait for the opponent to connect
- On connection — navigate to the game screen

**Join a game (guest):**
- Input field for the room code
- "Connect" button
- On connection — navigate to the game screen

---

## Step 7 — Pass parameters into `Chess.tsx`

After a successful connection the lobby knows:
- `gameType: "online"`
- `playerState.color` (host = white, guest = black — or by choice)

Pass them as props to `<Chess>`. Move restriction by color already works
in `Piece.tsx:29-30` when `gameType === "online"`.

---

## Step 8 — Handle disconnection and reconnect

In `useP2PGame`:
- `conn.on("close")` → show a modal "Opponent disconnected"
- "Reconnect" button → retry `peer.connect(remoteId)`
- On reconnect — sync state by replaying the full move log,
  or simply start a new game

---

## Step 9 — Adapt Undo for online mode

Currently `LogBlock` renders an undo button for every move.
In online mode either:
- Hide it (`gameType === "online"` → don't render undo buttons in `LogRecord`)
- Or implement as a request: send `"undo"` to the opponent, wait for consent

Hiding is sufficient for the first version.

---

## Files overview

| File | Location | Status |
|---|---|---|
| `produceMoves.ts` | `chess-engine/local/moveHandler/` | ✅ Done |
| `chessReducer.ts` | `chess-engine/local/reducer/` | ✅ Done |
| `useP2PGame.ts` | `src/hooks/` | ✅ Done |
| `applyRemoteMove.ts` | `chess-engine/online/` | Step 3 |
| `uciUtil.ts` | `chess-engine/core/utils/` | Step 4 |
| `page.tsx` (online lobby) | `src/app/[locale]/chess/online/` | Step 6 |
| `Chess.tsx` (edit) | `src/components/chess/` | Steps 5, 7 |
| `LogRecord.tsx` (edit) | `src/components/chess/` | Step 9 |

---

## What does NOT need to be done

- Sync the full `boardState` over the network — only the UCI string
- Change the reducer or engine logic — everything already works
- Run a server — PeerJS signaling is free and third-party
- Validate moves separately on the receiving side —
  if `move` is not found in `moveSet` the message is simply ignored
