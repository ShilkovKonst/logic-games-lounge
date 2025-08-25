"use client";
import { MouseEvent, TouchEvent } from "react";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useBoardState } from "@/context/BoardStateContext";
import { useGameState } from "@/context/GameStateContext";
import Cell from "./Cell";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import { Castling } from "@/lib/chess-engine/types";
import { getCell } from "@/lib/chess-engine/utils/cellUtil";
import { isPieces } from "@/lib/chess-engine/utils/pieceUtils";
import {
  handleMoveClick,
  handlePieceClick,
} from "@/lib/chess-engine/moveHandler/moveHandler";

const Board: React.FC = () => {
  const { playerState } = usePlayerState();
  const {
    currentTurn,
    setTurnDetails,
    selectedPiece,
    setSelectedPiece,
    isExchange,
    setIsExchange,
    changeTurn,
  } = useGameState();
  const { board, pieces } = useBoardState();

  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;
    const exchangeToEl = getClosest(target, ".exchange-to");
    const moveEl = getClosest(target, ".move");
    const pieceEl = getClosest(target, ".piece");

    if (exchangeToEl) {
      const exchangeType = exchangeToEl.getAttribute("data-exchange-to");
      if (exchangeType && isPieces(exchangeType) && selectedPiece) {
        selectedPiece.type = exchangeType;
        setTurnDetails((turnDetails) => ({
          ...turnDetails,
          exchange: true,
          pieceToExchange: exchangeType,
        }));
        setIsExchange(false);
        changeTurn();
      }
      return;
    }

    if (moveEl) {
      const moveId = moveEl.getAttribute("data-cell-id");
      if (moveId && selectedPiece) {
        const move = getCell(board, moveId);
        if (move.special?.type === "castling") {
          const castling = move.special as Castling;
          setTurnDetails((turnDetails) => ({
            ...turnDetails,
            castling: castling.long ? "long" : "short",
          }));
        }
        if (move.special?.type === "enPassant")
          setTurnDetails((turnDetails) => ({
            ...turnDetails,
            enPassant: true,
          }));
        handleMoveClick(
          move,
          selectedPiece,
          pieces,
          board,
          setIsExchange,
          changeTurn,
          setTurnDetails
        );
      }
      return;
    }

    if (pieceEl) {
      const pieceId = pieceEl.getAttribute("data-piece-id");
      if (pieceId) {
        if (isExchange) return;
        const piece = handlePieceClick(pieceId, pieces, currentTurn, board);
        setTurnDetails((turnDetails) => ({
          ...turnDetails,
          pieceToMove: piece.id,
          fromCell: piece.cell,
        }));
        setSelectedPiece(piece);
      }
      return;
    }
  };

  return (
    <div
      className={`col-start-3 col-span-10 ${
        playerState.color === "white" ? "rotate-0" : "rotate-180"
      } border-4 border-amber-950`}
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
  );
};

export default Board;

function getClosest(target: HTMLElement, selector: string): Element | null {
  return target.closest(selector);
}
