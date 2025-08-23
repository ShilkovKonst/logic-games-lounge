"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
  useContext,
} from "react";
import { CellType, PieceType } from "@/lib/chess-engine/types";
import { createBoard } from "@/lib/chess-engine/utils/createBoard";

interface BoardContextType {
  board: CellType[][];
  pieces: PieceType[];
  setPieces: Dispatch<SetStateAction<PieceType[]>>;
}

export const BoardStateContext = createContext<BoardContextType | undefined>(
  undefined
);

interface BoardProviderProps {
  children: ReactNode;
}

export function BoardProvider({ children }: BoardProviderProps) {
  const board: CellType[][] = createBoard();
  const [pieces, setPieces] = useState<PieceType[]>([]);

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
