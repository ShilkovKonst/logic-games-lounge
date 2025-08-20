/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useBoardState } from "@/context/BoardStateContext";
import { useGameState } from "@/context/GameStateContext";
import Cell from "./Cell";
import TakenPieces from "./TakenPieces";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import { Piece, Color, PlayerState } from "@/lib/chess-engine/types";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import { getAllActiveMoveSets } from "@/lib/chess-engine/moveSets/getAllActiveMoveSets";
import { getCell } from "@/lib/chess-engine/utils/cellUtil";
import {
  checkKingSafety,
  getKing,
} from "@/lib/chess-engine/gameStates/checkKingSafety";

type BoardProps = {
  curTurn: Color | null;
  plState: PlayerState | null;
  pcs: Piece[] | null;
};

const Board: React.FC<BoardProps> = ({ pcs, curTurn, plState }) => {
  const { playerState, setPlayerState } = usePlayerState();
  const {
    currentTurn,
    setCurrentTurn,
    selectedPiece,
    setSelectedPiece,
    setPieceToExchange,
  } = useGameState();
  const { board, pieces, setPieces } = useBoardState();

  const pS: PlayerState = plState ?? {
    color: "white",
    status: "NORMAL",
    type: "host",
  };

  useEffect(() => {
    setPlayerState(pS);
    setCurrentTurn(curTurn ?? "white");
    setPieces(pcs ?? populateBoard(pS.color, board));
  }, []);

  useEffect(() => {
    setSelectedPiece(undefined);

    if (pieces.length > 0) getAllActiveMoveSets(currentTurn, pieces, board);
  }, [currentTurn]);

  useEffect(() => {
    if (pieces.length > 0) {
      checkKingSafety(pieces, playerState.color, board);
    }
  }, [playerState]);

  useEffect(() => {
    if (selectedPiece) {
      console.log(selectedPiece);
      console.log(getCell(board, selectedPiece?.cell));
    }
  }, [selectedPiece]);

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
              setSelectedPiece(undefined);
              setPieceToExchange(undefined);
              setCurrentTurn(curTurn ?? "white");
              setPlayerState(pS);
              setPieces(pcs ?? populateBoard(pS.color, board));
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
      <div>
        Current turn: {playerState.color}; status: {playerState.status}
      </div>
      <div className={`grid grid-cols-12 `}>
        <div className="col-span-2 flex flex-col justify-between">
          <TakenPieces player="black" />
          <TakenPieces player="white" />
        </div>
        <div
          className={`col-start-3 col-span-10 border-4 border-amber-950 ${
            playerState.color === "white" ? "rotate-0" : "rotate-180"
          }`}
        >
          <ColCount increment={0} />
          <div className="grid grid-cols-10">
            <RowCount increment={0} />
            <div className="col-start-2 col-span-8 border-amber-950">
              {board.map((r, i) => (
                <div key={i} className="flex">
                  {r.map((cell, j) => (
                    <Cell key={i * 10 + j} cell={cell} board={board} />
                  ))}
                </div>
              ))}
            </div>
            <RowCount increment={1} />
          </div>
          <ColCount increment={1} />
        </div>
      </div>
    </>
  );
};

export default Board;
