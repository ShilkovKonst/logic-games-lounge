"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useContext,
} from "react";
import { Color, Piece, Turn } from "@/lib/chess-engine/types";

interface GameContextType {
  currentTurn: Color;
  setCurrentTurn: Dispatch<SetStateAction<Color>>;
  selectedPiece: Piece | undefined;
  setSelectedPiece: Dispatch<SetStateAction<Piece | undefined>>;
  pieceToExchange: Piece | undefined;
  setPieceToExchange: Dispatch<SetStateAction<Piece | undefined>>;
  log: Turn[];
  setLog: Dispatch<SetStateAction<Turn[]>>;
  changeTurn: () => void;
}

export const GameStateContext = createContext<GameContextType | undefined>(
  undefined
);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentTurn, setCurrentTurn] = useState<Color>("white");
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>(
    undefined
  );
  const [pieceToExchange, setPieceToExchange] = useState<Piece | undefined>(
    undefined
  );
  const [log, setLog] = useState<Turn[]>([]);

  const changeTurn = () => {
    setSelectedPiece(undefined);
    setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
  };

  return (
    <GameStateContext.Provider
      value={{
        currentTurn,
        setCurrentTurn,
        selectedPiece,
        setSelectedPiece,
        pieceToExchange,
        setPieceToExchange,
        log,
        setLog,
        changeTurn
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
