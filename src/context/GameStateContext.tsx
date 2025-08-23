"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useContext,
} from "react";
import { Color, GameType, PieceType, Turn } from "@/lib/chess-engine/types";

interface GameContextType {
  gameType: GameType;
  setGameType: Dispatch<SetStateAction<GameType>>;
  currentTurn: Color;
  setCurrentTurn: Dispatch<SetStateAction<Color>>;
  selectedPiece: PieceType | undefined;
  setSelectedPiece: Dispatch<SetStateAction<PieceType | undefined>>;
  isExchange: boolean;
  setIsExchange: Dispatch<SetStateAction<boolean>>;
  log: Turn[];
  setLog: Dispatch<SetStateAction<Turn[]>>;
  changeTurn: () => void;
}

export const GameStateContext = createContext<GameContextType | undefined>(
  undefined
);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameType, setGameType] = useState<GameType>("hotseat");
  const [currentTurn, setCurrentTurn] = useState<Color>("white");
  const [selectedPiece, setSelectedPiece] = useState<PieceType | undefined>(
    undefined
  );
  const [isExchange, setIsExchange] = useState<boolean>(false);
  const [log, setLog] = useState<Turn[]>([]);

  const changeTurn = () => {
    setSelectedPiece(undefined);
    setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
  };

  return (
    <GameStateContext.Provider
      value={{
        gameType,
        setGameType,
        currentTurn,
        setCurrentTurn,
        selectedPiece,
        setSelectedPiece,
        isExchange,
        setIsExchange,
        log,
        setLog,
        changeTurn,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
}
