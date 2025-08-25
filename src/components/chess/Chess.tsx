/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Color,
  GameType,
  PieceType,
  PlayerState,
} from "@/lib/chess-engine/types";
import Board from "./Board";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useGameState } from "@/context/GameStateContext";
import { useBoardState } from "@/context/BoardStateContext";
import { useEffect } from "react";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import { getAllActiveMoveSets } from "@/lib/chess-engine/moveSets/getAllActiveMoveSets";
import { checkKingSafety } from "@/lib/chess-engine/moveSets/checkKingSafety";
import TakenPiecesBlock from "./TakenPiecesBlock";
import LogBlock from "./LogBlock";

type ChessProps = {
  gType: GameType | null;
  curTurn: Color | null;
  plState: PlayerState | null;
  pcs: PieceType[] | null;
};
const Chess: React.FC<ChessProps> = ({ gType, pcs, curTurn, plState }) => {
  const { playerState, setPlayerState } = usePlayerState();
  const {
    setLog,
    isTurnOver,
    setIsTurnOver,
    gameTurnNo,
    setGameTurnNo,
    turnDetails,
    setTurnDetails,
    currentTurn,
    setCurrentTurn,
    setSelectedPiece,
    setIsExchange,
  } = useGameState();
  const { board, pieces, setPieces } = useBoardState();

  const setInitialGameState = () => {
    setGameTurnNo(1);
    setIsTurnOver(false);
    setTurnDetails({
      turnNo: 1,
      curentPlayer: "white",
      pieceToMove: "",
      fromCell: "",
      toCell: "",
      castling: undefined,
      exchange: false,
      enPassant: false,
      pieceToTake: "",
      pieceToExchange: "",
      boardState: pieces,
    });
    setSelectedPiece(undefined);
    setLog([]);
    setIsExchange(false);
    setCurrentTurn(curTurn ?? "white");
    setPlayerState(
      plState ?? {
        color: "white",
        status: "NORMAL",
        type: "host",
      }
    );
    setPieces(pcs ?? populateBoard("white", board));
  };

  useEffect(() => {
    setInitialGameState();
  }, []);

  useEffect(() => {
    if (isTurnOver) {
      const newTurnDetails = {
        ...turnDetails,
        boardState: pieces,
        turnNo: gameTurnNo,
        curentPlayer: currentTurn,
      };
      setTurnDetails(newTurnDetails);
      setLog((log) => [...log, turnDetails]);
      getAllActiveMoveSets(currentTurn, pieces, board);
      setGameTurnNo((turnNo) => ++turnNo);
      setSelectedPiece(undefined);
      setIsTurnOver(false);
    }
  }, [isTurnOver]);

  useEffect(() => {
    if (pieces.length > 0) {
      checkKingSafety(pieces, playerState.color, board);
    }
  }, [playerState]);

  return (
    <>
      <div className="w-full flex justify-between">
        <div>
          <div>{currentTurn}</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
            }}
          >
            change turn
          </button>
        </div>
        <div>
          <div>RESTART GAME</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              setInitialGameState();
            }}
          >
            restart
          </button>
        </div>
        <div>
          <div>{playerState.type}</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              setPlayerState((prev) =>
                prev.color === "white"
                  ? { color: "black", status: prev.status, type: "guest" }
                  : { color: "white", status: prev.status, type: "host" }
              );
            }}
          >
            change player
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        Current player: {currentTurn}; status: {playerState.status}; current
        turn: {gameTurnNo}
      </div>

      <div className={`grid grid-cols-16 `}>
        <TakenPiecesBlock />
        <Board />
        <LogBlock />
      </div>
    </>
  );
};

export default Chess;
