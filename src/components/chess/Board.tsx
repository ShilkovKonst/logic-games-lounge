/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { MouseEvent, TouchEvent, useEffect } from "react";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useBoardState } from "@/context/BoardStateContext";
import { useGameState } from "@/context/GameStateContext";
import Cell from "./Cell";
import TakenPieces from "./TakenPieces";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import {
  Color,
  PlayerState,
  GameType,
  PieceType,
} from "@/lib/chess-engine/types";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import { getAllActiveMoveSets } from "@/lib/chess-engine/moveSets/getAllActiveMoveSets";
import { getCell } from "@/lib/chess-engine/utils/cellUtil";
import { checkKingSafety } from "@/lib/chess-engine/moveSets/checkKingSafety";
import { defineColorState } from "@/lib/chess-engine/gameStates/definePlayerState";
import { isPieces } from "@/lib/chess-engine/utils/pieceUtils";
import {
  handleMoveClick,
  handlePieceClick,
} from "@/lib/chess-engine/moveHandler/moveHandler";

type BoardProps = {
  gType: GameType | null;
  curTurn: Color | null;
  plState: PlayerState | null;
  pcs: PieceType[] | null;
};

const Board: React.FC<BoardProps> = ({ gType, pcs, curTurn, plState }) => {
  const { playerState, setPlayerState } = usePlayerState();
  const {
    gameType,
    setGameType,
    currentTurn,
    setCurrentTurn,
    selectedPiece,
    setSelectedPiece,
    isExchange,
    setIsExchange,
    changeTurn,
  } = useGameState();
  const { board, pieces, setPieces } = useBoardState();

  const pS: PlayerState = plState ?? {
    color: "white",
    status: "NORMAL",
    type: "host",
  };

  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest(".exchange-to")) {
      const exchangeType = target
        .closest(".exchange-to")
        ?.getAttribute("data-exchange-to");
      if (exchangeType && isPieces(exchangeType) && selectedPiece) {
        selectedPiece.type = exchangeType;
        setIsExchange(false);
        changeTurn();
      }
      return;
    }

    if (target.closest(".move")) {
      const moveId = target.closest(".move")?.getAttribute("data-cell-id");
      if (moveId && selectedPiece) {
        const move = getCell(board, moveId);
        handleMoveClick(
          move,
          selectedPiece,
          pieces,
          board,
          setIsExchange,
          changeTurn
        );
        console.log(isExchange, selectedPiece?.cell, move.id);
      }
      return;
    }

    if (target.closest(".piece")) {
      const pieceId = target.closest(".piece")?.getAttribute("data-piece-id");
      if (pieceId) {
        if (isExchange) return;
        const piece = handlePieceClick(pieceId, pieces, currentTurn, board);
        setSelectedPiece(piece);
      }
      return;
    }
  };

  useEffect(() => {
    setGameType(gType ?? "hotseat");
    setPlayerState(pS);
    setCurrentTurn(curTurn ?? "white");
    setPieces(pcs ?? populateBoard(pS.color, board));
  }, []);

  useEffect(() => {
    setSelectedPiece(undefined);
    if (pieces.length > 0) {
      getAllActiveMoveSets(currentTurn, pieces, board);
      console.log(defineColorState(pieces, currentTurn));
    }
  }, [currentTurn]);

  useEffect(() => {
    if (pieces.length > 0) {
      checkKingSafety(pieces, playerState.color, board);
    }
  }, [playerState]);

  // useEffect(() => {
  //   if (selectedPiece) {
  //     // console.log(selectedPiece);
  //     // console.log(getCell(board, selectedPiece?.cell));
  //     // selectedPiece.moveSet.forEach((m) => console.log(getCell(board, m)));
  //   }
  // }, [selectedPiece]);

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
              setIsExchange(false);
              setCurrentTurn(curTurn ?? "white");
              setPlayerState(pS);
              setPieces(pcs ?? populateBoard(pS.color, board));
            }}
          >
            restart
          </button>
        </div>
        {/* {gameType === "online" && ( */}
        {gameType === "hotseat" && (
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
        )}
      </div>
      <div className="w-full flex justify-center items-center">
        Current turn: {currentTurn}; status: {playerState.status}
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
            <div
              onClick={(e) => handleClick(e)}
              className="col-start-2 col-span-8 border-amber-950"
            >
              {board.map((r, i) => (
                <div key={i} className="flex">
                  {r.map((cell, j) => (
                    <Cell key={i * 10 + j} cell={cell} />
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
