"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
  useContext,
} from "react";
import { Cell, Piece } from "@/lib/chess-engine/types";
import { createBoard } from "@/lib/chess-engine/utils/createBoard";

interface BoardContextType {
  board: Cell[][];
  pieces: Piece[];
  setPieces: Dispatch<SetStateAction<Piece[]>>;
}

export const BoardStateContext = createContext<BoardContextType | undefined>(
  undefined
);

interface BoardProviderProps {
  children: ReactNode;
}

export function BoardProvider({ children }: BoardProviderProps) {
  const board: Cell[][] = createBoard();
  const [pieces, setPieces] = useState<Piece[]>([]);

  return (
    <BoardStateContext.Provider value={{ board, pieces, setPieces }}>
      {children}
    </BoardStateContext.Provider>
  );
}

export function useBoardState() {
  const ctx = useContext(BoardStateContext);
  if (!ctx) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return ctx;
}
