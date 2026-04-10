"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useP2PGame, P2PStatus } from "@/hooks/useP2PGame";
import { Color } from "@/lib/chess-engine/core/types";

type P2PContextType = {
  peerId: string | null;
  status: P2PStatus;
  gameToPlay: string | null;
  playerColor: Color | null;
  opponentLeft: "host" | "guest" | null;
  hostBusy: boolean;
  enable: () => void;
  connect: (remoteId: string) => void;
  disconnect: () => void;
  sendMove: (uci: string) => void;
  startGame: (game: string) => void;
  leaveGame: () => void;
  clearOpponentLeft: () => void;
  registerGameHandler: (fn: (uci: string) => void) => void;
  registerSyncProvider: (fn: () => string) => void;
  registerSyncHandler: (fn: (moves: string[]) => void) => void;
};

const P2PContext = createContext<P2PContextType | null>(null);

export function P2PProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [gameToPlay, setGameToPlay] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [opponentLeft, setOpponentLeft] = useState<"host" | "guest" | null>(null);
  const [hostBusy, setHostBusy] = useState(false);
  const gameHandlerRef = useRef<(msg: string) => void>(() => {});
  const syncProviderRef = useRef<(() => string) | null>(null);
  const syncHandlerRef = useRef<((moves: string[]) => void) | null>(null);
  const pendingSyncRef = useRef<string[] | null>(null);
  const prevStatusRef = useRef<P2PStatus>("idle");

  const handleMessage = useCallback((msg: string) => {
    try {
      const parsed = JSON.parse(msg);
      if (parsed.type === "init" && parsed.game) {
        setGameToPlay(parsed.game);
        return;
      }
      if (parsed.type === "busy") {
        setHostBusy(true);
        return;
      }
      if (parsed.type === "disconnect") {
        const role = parsed.role;
        if (role === "host" || role === "guest") {
          setOpponentLeft(role);
        }
        return;
      }
      if (parsed.type === "sync" && Array.isArray(parsed.moves)) {
        const moves = parsed.moves as string[];
        if (syncHandlerRef.current) {
          syncHandlerRef.current(moves);
        } else {
          pendingSyncRef.current = moves; // Chess not mounted yet — buffer for later
        }
        return;
      }
    } catch {
      // not a protocol message — treat as game move
    }
    gameHandlerRef.current(msg);
  }, []);

  const { peerId, status, connect: rawConnect, sendMove: rawSend, disconnect } =
    useP2PGame({ enabled, onRemoteMove: handleMessage });

  // Re-send init + sync when host reconnects with a game already in progress
  useEffect(() => {
    if (prevStatusRef.current !== "connected" && status === "connected" && gameToPlay && playerColor === "white") {
      rawSend(JSON.stringify({ type: "init", game: gameToPlay }));
      const syncMsg = syncProviderRef.current?.();
      if (syncMsg) rawSend(syncMsg);
    }
    prevStatusRef.current = status;
  }, [status, gameToPlay, playerColor, rawSend]);

  const enable = useCallback(() => setEnabled(true), []);

  const connect = useCallback(
    (remoteId: string) => {
      setPlayerColor("black");
      setOpponentLeft(null);
      setHostBusy(false);
      pendingSyncRef.current = null;
      syncHandlerRef.current = null;
      rawConnect(remoteId);
    },
    [rawConnect]
  );

  const sendMove = useCallback((uci: string) => rawSend(uci), [rawSend]);

  const startGame = useCallback(
    (game: string) => {
      setPlayerColor("white");
      setGameToPlay(game);
      setOpponentLeft(null);
      rawSend(JSON.stringify({ type: "init", game }));
    },
    [rawSend]
  );

  const leaveGame = useCallback(() => {
    if (playerColor) {
      const role: "host" | "guest" = playerColor === "white" ? "host" : "guest";
      rawSend(JSON.stringify({ type: "disconnect", role }));
    }
    disconnect();
    setGameToPlay(null);
  }, [playerColor, rawSend, disconnect]);

  const clearOpponentLeft = useCallback(() => setOpponentLeft(null), []);

  const registerGameHandler = useCallback((fn: (uci: string) => void) => {
    gameHandlerRef.current = fn;
  }, []);

  const registerSyncProvider = useCallback((fn: () => string) => {
    syncProviderRef.current = fn;
  }, []);

  const registerSyncHandler = useCallback((fn: (moves: string[]) => void) => {
    syncHandlerRef.current = fn;
    if (pendingSyncRef.current !== null) {
      fn(pendingSyncRef.current);
      pendingSyncRef.current = null;
    }
  }, []);

  return (
    <P2PContext.Provider
      value={{
        peerId,
        status,
        gameToPlay,
        playerColor,
        opponentLeft,
        hostBusy,
        enable,
        connect,
        disconnect,
        sendMove,
        startGame,
        leaveGame,
        clearOpponentLeft,
        registerGameHandler,
        registerSyncProvider,
        registerSyncHandler,
      }}
    >
      {children}
    </P2PContext.Provider>
  );
}

export function useP2PContext(): P2PContextType {
  const ctx = useContext(P2PContext);
  if (!ctx) throw new Error("useP2PContext must be used within P2PProvider");
  return ctx;
}
