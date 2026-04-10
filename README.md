# Logic Games Lounge

A collection of browser-based board games. Currently features a fully playable chess implementation with **local hotseat** and **online P2P multiplayer** — no server required.

---

## Features

### Chess
- Full chess rules: all piece movements, castling, en passant, pawn promotion
- Check, checkmate, and stalemate detection
- Pin detection and legal move filtering
- Draw conditions: stalemate, insufficient material, threefold repetition
- Move log with Standard Algebraic Notation
- Captured pieces display
- Unlimited undo (hotseat mode)

### Online Multiplayer (P2P / Quick Play)
- No account or server needed — connect directly via WebRTC (PeerJS)
- Share a room code or a link to invite your opponent
- Turn enforcement by color
- Resign flow with restart or leave options
- Draw offer flow with sequential accept/decline
- Disconnect detection (intentional leave + unexpected drop)
- Reconnect support: re-enter the room code to resume the game in progress

### General
- Localized in **English**, **Russian**, and **French**
- Responsive layout — works on mobile, tablet, and desktop
- No external state management — pure React (`useReducer` + Context)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 (strict) |
| Styling | TailwindCSS 4 |
| P2P networking | PeerJS (WebRTC) |
| Localization | Custom (JSON + middleware) |
| Bundler | Turbopack (dev) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How Online Play Works

Online multiplayer uses **WebRTC via PeerJS**. The PeerJS signaling server is only used for the initial handshake (~1 KB). All game data travels directly between the two browsers.

1. One player creates a game and shares their **room code** (or a direct link)
2. The other player enters the code and joins
3. Host plays as **White**, guest plays as **Black**
4. Moves are transmitted as **UCI notation** (`"e2e4"`, `"e7e8q"`)

No account, no backend, no cost.

---

## Project Structure

```
src/
├── app/[locale]/          # Pages: landing, lobby, chess (hotseat + online)
├── components/chess/      # All chess UI components
├── context/               # GlobalState, PlayerState, P2PContext
├── hooks/                 # useP2PGame (PeerJS)
├── lib/
│   ├── chess-engine/      # Pure game logic (core/) + local/ + online/
│   ├── locales/           # en.json, ru.json, fr.json
│   └── icons/             # SVG icon components
└── styles/                # scrollbars.css, shadows.css
```

---

## Roadmap

- [ ] Other board games (tic-tac-toe, etc.)
- [ ] Chess clock / time controls
- [ ] Computer opponent (Stockfish via WASM)
- [ ] Game save / load (PGN export)
- [ ] 50-move rule draw
- [ ] WebSocket mode with accounts and room list
