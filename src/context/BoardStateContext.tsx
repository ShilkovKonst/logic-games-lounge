"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
  useContext,
} from "react";
import { Piece } from "@/lib/chess-engine/types";

interface BoardContextType {
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
  const [pieces, setPieces] = useState<Piece[]>([]);

  return (
    <BoardStateContext.Provider value={{ pieces, setPieces }}>
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
