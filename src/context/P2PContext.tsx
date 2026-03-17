"use client";
import {
  createContext,
  useCallback,
  useContext,
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
  enable: () => void;
  connect: (remoteId: string) => void;
  disconnect: () => void;
  sendMove: (uci: string) => void;
  startGame: (game: string) => void;
  leaveGame: () => void;
  clearOpponentLeft: () => void;
  registerGameHandler: (fn: (uci: string) => void) => void;
};

const P2PContext = createContext<P2PContextType | null>(null);

export function P2PProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [gameToPlay, setGameToPlay] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [opponentLeft, setOpponentLeft] = useState<"host" | "guest" | null>(null);
  const gameHandlerRef = useRef<(msg: string) => void>(() => {});

  const handleMessage = useCallback((msg: string) => {
    try {
      const parsed = JSON.parse(msg);
      if (parsed.type === "init" && parsed.game) {
        setGameToPlay(parsed.game);
        return;
      }
      if (parsed.type === "disconnect" && parsed.role) {
        setOpponentLeft(parsed.role as "host" | "guest");
        return;
      }
    } catch {
      // not a protocol message — treat as game move
    }
    gameHandlerRef.current(msg);
  }, []);

  const { peerId, status, connect: rawConnect, sendMove: rawSend, disconnect } =
    useP2PGame({ enabled, onRemoteMove: handleMessage });

  const enable = useCallback(() => setEnabled(true), []);

  const connect = useCallback(
    (remoteId: string) => {
      setPlayerColor("black");
      rawConnect(remoteId);
    },
    [rawConnect]
  );

  const sendMove = useCallback((uci: string) => rawSend(uci), [rawSend]);

  const startGame = useCallback(
    (game: string) => {
      setPlayerColor("white");
      setGameToPlay(game);
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

  return (
    <P2PContext.Provider
      value={{
        peerId,
        status,
        gameToPlay,
        playerColor,
        opponentLeft,
        enable,
        connect,
        disconnect,
        sendMove,
        startGame,
        leaveGame,
        clearOpponentLeft,
        registerGameHandler,
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
