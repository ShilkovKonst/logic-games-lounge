"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useContext,
} from "react";
import { Color, GameType, PieceType, TurnDetails } from "@/lib/chess-engine/types";

interface GameContextType {
  gameTurnNo: number;
  setGameTurnNo: Dispatch<SetStateAction<number>>;
  currentTurn: Color;
  setCurrentTurn: Dispatch<SetStateAction<Color>>;
  isTurnOver: boolean;
  setIsTurnOver: Dispatch<SetStateAction<boolean>>;
  gameType: GameType;
  setGameType: Dispatch<SetStateAction<GameType>>;
  selectedPiece: PieceType | undefined;
  setSelectedPiece: Dispatch<SetStateAction<PieceType | undefined>>;
  isExchange: boolean;
  setIsExchange: Dispatch<SetStateAction<boolean>>;
  turnDetails: TurnDetails;
  setTurnDetails: Dispatch<SetStateAction<TurnDetails>>;
  log: TurnDetails[];
  setLog: Dispatch<SetStateAction<TurnDetails[]>>;
  changeTurn: () => void;
}

export const GameStateContext = createContext<GameContextType | undefined>(
  undefined
);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameTurnNo, setGameTurnNo] = useState<number>(0);
  const [currentTurn, setCurrentTurn] = useState<Color>("white");
  const [isTurnOver, setIsTurnOver] = useState<boolean>(false);
  const [turnDetails, setTurnDetails] = useState<TurnDetails>({
    turnNo: gameTurnNo,
    curentPlayer: currentTurn,
    pieceToMove: "",
    fromCell: "",
    toCell: "",
    castling: undefined,
    exchange: false,
    enPassant: false,
    pieceToTake: "",
    pieceToExchange: "",
    boardState: [],
  });

  const [gameType, setGameType] = useState<GameType>("hotseat");
  const [selectedPiece, setSelectedPiece] = useState<PieceType | undefined>(
    undefined
  );
  const [isExchange, setIsExchange] = useState<boolean>(false);
  const [log, setLog] = useState<TurnDetails[]>([]);

  const changeTurn = () => {
    setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
    setIsTurnOver(true);
  };

  return (
    <GameStateContext.Provider
      value={{
        gameTurnNo,
        setGameTurnNo,
        currentTurn,
        setCurrentTurn,
        turnDetails,
        setTurnDetails,
        isTurnOver,
        setIsTurnOver,
        gameType,
        setGameType,
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
