"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useContext,
} from "react";
import { PlayerState } from "@/lib/chess-engine/types";

interface PlayerContextType {
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
}

export const PlayerStateContext = createContext<PlayerContextType | undefined>(
  undefined
);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    type: "host",
    color: "white",
    status: "NORMAL",
  });

  return (
    <PlayerStateContext.Provider value={{ playerState, setPlayerState }}>
      {children}
    </PlayerStateContext.Provider>
  );
}

export function usePlayerState() {
  const ctx = useContext(PlayerStateContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
}
