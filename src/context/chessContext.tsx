"use client";
import { Cell, Piece, Color, PlayerState } from "@/lib/chess-engine/types";
import { createBoard } from "@/lib/chess-engine/utils/createBoard";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type LogType = {
  description: string;
  boardState: Piece[];
};

interface ChessContextType {
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  currentTurn: Color;
  setCurrentTurn: Dispatch<SetStateAction<Color>>;
  selectedPiece: Piece | undefined;
  setSelectedPiece: Dispatch<SetStateAction<Piece | undefined>>;
  pieceToExchange: Piece | undefined;
  setPieceToExchange: Dispatch<SetStateAction<Piece | undefined>>;
  board: Cell[][];
  pieces: Piece[];
  setPieces: Dispatch<SetStateAction<Piece[]>>;
  log: LogType[];
  setLog: Dispatch<SetStateAction<LogType[]>>;
}

interface ChessProviderProps {
  children: ReactNode;
}

export const ChessContext = createContext<ChessContextType | undefined>(
  undefined
);

export default function ChessProvider({ children }: ChessProviderProps) {
  const board: Cell[][] = createBoard();

  const [playerState, setPlayerState] = useState<PlayerState>({
    type: "host",
    color: "white",
    status: "NORMAL",
  });
  const [currentTurn, setCurrentTurn] = useState<Color>("white");
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>(
    undefined
  );
  const [pieceToExchange, setPieceToExchange] = useState<Piece | undefined>(
    undefined
  );
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [log, setLog] = useState<LogType[]>([]);

  const value: ChessContextType = {
    playerState,
    setPlayerState,
    currentTurn,
    setCurrentTurn,
    selectedPiece,
    setSelectedPiece,
    pieceToExchange,
    setPieceToExchange,
    board,
    pieces,
    setPieces,
    log,
    setLog,
  };
  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
}
