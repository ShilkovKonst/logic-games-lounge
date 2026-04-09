# Plan: Online Multiplayer

Two online modes are planned:

| Mode | Transport | Auth | Room discovery | Status |
|---|---|---|---|---|
| **Quick Play** | WebRTC / PeerJS | anonymous | share code manually | ✅ Implemented |
| **Play Online** | WebSocket | account required | room list / matchmaking | 🔜 Future |

---

## Mode 1 — Quick Play (P2P, implemented)

Technology: **WebRTC via PeerJS** — PeerJS's free signaling server is used only
for the handshake (~1 KB, once). After the connection is established all traffic
goes directly between browsers.

Message format: **UCI notation** — `"e2e4"`, `"e7e8q"` (promotion), 4–5 chars.
Decoded using the existing `handlePieceClick` + `produceMove` / `produceExchange`.

### Step 1 — Install PeerJS ✅

```bash
npm install peerjs
```

Types are bundled with the package, no separate `@types` install needed.

---

### Step 2 — Write the `useP2PGame` hook ✅

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

### Step 3 — Write `applyRemoteMove` ✅

**File:** `src/lib/chess-engine/online/applyRemoteMove.ts`

Lives in `online/` — online-mode orchestration. Imports `produceMove`/`produceExchange`
from `local/` because both modes share the same React `dispatch` pipeline.

```ts
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
(queenside). On the receiving end the king's `moveSet` already contains both
castling moves with `special.type === "castling"`. No extra protocol handling needed.

---

### Step 4 — Write the UCI encoder/decoder ✅

**File:** `src/lib/chess-engine/core/utils/uciUtil.ts`

```ts
export function encodeMove(fromCell: string, toCell: string, promo?: string): string
export function decodeMove(msg: string): { fromCell: string; toCell: string; promo: string | null }
```

---

### Step 5 — Integrate move sending into `Chess.tsx` ✅

`useEffect` on `state.log` — after every `END_TURN` sends UCI to opponent
if `last.currentPlayer === playerState.color`.

---

### Step 6 — Lobby ✅

**Files:**
- `src/context/P2PContext.tsx` — P2P state, `enable` / `connect` / `startGame` / `registerGameHandler`
- `src/app/[locale]/page.tsx` — landing page (Hotseat / Quick Play)
- `src/app/[locale]/lobby/page.tsx` — universal P2P lobby (3 screens: select / host / guest)
- `src/app/[locale]/chess/online/page.tsx` — chess online game page

Protocol: host sends `{"type":"init","game":"chess"}` on connect →
guest receives game type and navigates automatically.

---

### Step 7 — Pass parameters into `Chess.tsx` ✅

`src/app/[locale]/chess/online/page.tsx` passes to `<Chess>`:
- `gameType="online"`
- `plState` — derived from `playerColor` (host = white, guest = black)
- `sendMove` and `registerRemoteHandler` from `P2PContext`

Move restriction by color works in `Piece.tsx` when `gameType === "online"`.

---

### Step 8 — Handle disconnection ✅

**Protocol message:** before closing, the leaving side sends
`{"type":"disconnect","role":"host"|"guest"}`.

**Intentional leave (home button):**
- `TopLevelMenu` detects `/online` route via `usePathname`
- Shows confirm modal: "Leave game?" with Leave / Stay buttons
- On confirm: `leaveGame()` in `P2PContext` sends disconnect message,
  calls `disconnect()`, clears `gameToPlay`, then navigates to home

**Opponent disconnected:**
- `P2PContext.handleMessage` catches `{"type":"disconnect","role":...}`
  → sets `opponentLeft: "host" | "guest"`
- `chess/online/page.tsx` shows modal: "Host/Guest has disconnected."
  with "Back to menu" button

**Unexpected drop (no protocol message):**
- `conn.on("close")` sets `status → "waiting"`
- `chess/online/page.tsx` detects `status !== "connected" && hasConnected && !opponentLeft`
  → shows "Connection lost." modal

Reconnect after disconnect is not implemented — both sides return to the main menu.

---

### Step 9 — Adapt Undo for online mode ✅

`LogRecord` hides the undo button when `gameType === "online"`.

---

### Summary

All planned P2P steps are complete. The Quick Play mode is fully functional:
share a room code → connect → play → disconnect handled gracefully.

---

### Post-launch fixes & features (added after initial implementation)

#### Lobby: second guest protection
- `useP2PGame.ts` — `peer.on("connection")` rejects incoming connections when `connRef.current !== null`: waits for `conn.on("open")`, sends `{"type":"busy"}`, closes the connection
- `P2PContext.tsx` — `hostBusy: boolean` state; set on `{"type":"busy"}` message, cleared on next `connect()` call
- `lobby/page.tsx` — shows `lobby.hostBusy` error string instead of generic error
- Locales — `lobby.hostBusy` added to en/ru/fr

#### Resign flow (`ResignFlow.tsx`)
Full resign state machine for online mode. Wire messages:
`resign:restart` | `resign:leave` | `resign:cancel` | `resign:accept` | `resign:decline`

Initiator phases: `confirming` → `waiting` → `declined`
Receiver phases: `opponent_resigned` | `opponent_left_win`

- `resign:accept` → both `dispatch(INIT)` — board resets for both players
- `resign:leave` / `resign:decline` → initiator calls `leaveGame()` + navigates home
- `onResignActiveChange` prop on `Chess.tsx` → `online/page.tsx` suppresses disconnect overlay while resign is active

#### Draw offer flow (`DrawOfferFlow.tsx`)
Sequential decision flow — receiver decides first, then initiator. Wire messages:
`draw_offer` | `draw_offer:cancel` | `draw_offer:decline` | `draw_offer:accept` | `draw_offer:restart` | `draw_offer:leave` | `draw_offer:confirm`

Initiator phases: `waiting` → `initiator_waiting` → `initiator_choose`
Receiver phases: `opponent_offered` → `receiver_choose` → `receiver_waiting`
Shared phase: `opponent_left` — shown to whichever side receives `draw_offer:leave`

- `draw_offer:decline` → both back to game (no modal)
- `draw_offer:leave` (sender) → `leave(msg)` in DrawOfferFlow: sends wire msg + calls `onLeave()`
- `draw_offer:leave` (receiver) → phase `"opponent_left"`: info modal "Opponent left after agreeing to a draw" + single "Back to menu" button → `onLeave()`
- `draw_offer:confirm` (initiator chose restart) → both `dispatch(INIT)`
- `onDrawActiveChange` prop on `Chess.tsx` → suppresses disconnect overlay (same pattern as resign)
- Both resign and draw buttons in `HeaderBlock` are disabled while either flow is active

#### Shared component & navigation unification
- `FlowOverlay.tsx` — extracted shared overlay used by both `ResignFlow` and `DrawOfferFlow`
- Navigation unified via `onLeave` prop on both flows (previously `ResignFlow` had its own `navigateHome` with internal `useRouter`/`useParams`/`leaveGame`); now both receive `onLeave = handleLeave` from `online/page.tsx`

#### Game-over modal improvements (online mode)
- `Modal` type gains optional `cancelClick?: () => void`
- `ModalBlock.tsx` — calls `cancelClick?.()` alongside `setIsReset(false)` on cancel
- `Chess.tsx` — `onLeave?` prop; checkmate/draw game-over modal in online mode uses "Leave" as cancel text and `cancelClick = onLeave`
- `online/page.tsx` — `handleLeave = leaveGame() + router.push(home)` passed as `onLeave`

#### Supporting changes
- `HeaderButton.tsx` — `disabled` prop: `opacity-40 cursor-not-allowed`
- `types.ts` — `Draw` union includes `"agreement"`; `Modal` has `cancelClick?`
- `chessReducer.ts` — `AGREE_DRAW` action (sets `currentStatus.draw = "agreement"`)

---

### Files overview

| File | Location | Status |
|---|---|---|
| `produceMoves.ts` | `chess-engine/local/moveHandler/` | ✅ Done |
| `chessReducer.ts` | `chess-engine/local/reducer/` | ✅ Done |
| `useP2PGame.ts` | `src/hooks/` | ✅ Done |
| `applyRemoteMove.ts` | `chess-engine/online/` | ✅ Done |
| `uciUtil.ts` | `chess-engine/core/utils/` | ✅ Done |
| `P2PContext.tsx` | `src/context/` | ✅ Done |
| `page.tsx` (landing) | `src/app/[locale]/` | ✅ Done |
| `page.tsx` (lobby) | `src/app/[locale]/lobby/` | ✅ Done |
| `page.tsx` (chess online) | `src/app/[locale]/chess/online/` | ✅ Done |
| `Chess.tsx` (edit) | `src/components/chess/` | ✅ Done |
| `LogRecord.tsx` (edit) | `src/components/chess/` | ✅ Done |

---

## Mode 2 — Play Online (WebSocket, future)

Requires a server. Mongoose + JWT stubs already exist in the project (`lib/db.ts`,
`lib/models/GameSession.ts`) as groundwork.

### Planned features

- **User accounts** — register / login (JWT)
- **Room list** — server holds all waiting rooms; clients subscribe via WebSocket
- **Matchmaking** — join a random open room or create a new one
- **Game history** — sessions stored in MongoDB (`GameSession` model)
- **Reconnect** — resume an interrupted game from server state

### Architecture outline

```
Client ──WebSocket──► Node.js server ──► MongoDB
                          │
                    Room registry
                    (in-memory or DB)
```

### Landing page change

When implemented, the landing page online submenu would become:

```
Online
  ├── Quick Play  (P2P — current)
  └── Play Online (WebSocket — accounts + room list)
```

### Not planned for now

Implementation is deferred until account system and persistent game history
are prioritized. P2P Quick Play covers the immediate need for online play
without infrastructure costs.
