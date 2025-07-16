"use client";
import { Cell, Piece } from "@/lib/chess-engine/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface ChessContextType {
  selectedPiece: Piece | undefined;
  setSelectedPiece: Dispatch<SetStateAction<Piece | undefined>>;
  moveSet: Cell[];
  setMoveSet: Dispatch<SetStateAction<Cell[]>>;
  piecesState: Piece[];
  setPiecesState: Dispatch<SetStateAction<Piece[]>>;
}

interface ChessProviderProps {
  children: ReactNode;
}

export const ChessContext = createContext<ChessContextType | undefined>(
  undefined
);

export default function ChessProvider({ children }: ChessProviderProps) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>(
    undefined
  );
  const [moveSet, setMoveSet] = useState<Cell[]>([]);
  const [piecesState, setPiecesState] = useState<Piece[]>([]);

  const value: ChessContextType = {
    selectedPiece,
    setSelectedPiece,
    moveSet,
    setMoveSet,
    piecesState,
    setPiecesState,
  };
  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
}
