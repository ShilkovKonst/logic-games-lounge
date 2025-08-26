"use client";
import { ActionDispatch, MouseEvent, TouchEvent } from "react";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useBoardState } from "@/context/BoardStateContext";
import { useGameState } from "@/context/GameStateContext";
import Cell from "./Cell";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import { Castling, GameState } from "@/lib/chess-engine/types";
import { getCell } from "@/lib/chess-engine/utils/cellUtil";
import { isPieces } from "@/lib/chess-engine/utils/pieceUtils";
import {
  handleMoveClick,
  handlePieceClick,
} from "@/lib/chess-engine/moveHandler/moveHandler";
import { GameAction } from "@/reducer/chessReducer";

type BoardProps = {
  state: GameState;
  dispatch: ActionDispatch<[action: GameAction]>;
};

const Board: React.FC<BoardProps> = ({ state, dispatch }) => {
  const { playerState } = usePlayerState();
  const { board } = useBoardState();

  const { selectedPiece, currentBoardState, currentTurn, isExchange } = state;

  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;
    const exchangeToEl = getClosest(target, ".exchange-to");
    const moveEl = getClosest(target, ".move");
    const pieceEl = getClosest(target, ".piece");

    if (exchangeToEl) {
      const exchangeType = exchangeToEl.getAttribute("data-exchange-to");
      if (exchangeType && isPieces(exchangeType) && selectedPiece) {
        selectedPiece.type = exchangeType;
        dispatch({
          type: "PATCH_TURN",
          payload: { exchange: true, pieceToExchange: exchangeType },
        });
        dispatch({ type: "END_EXCHANGE" });
        dispatch({
          type: "END_TURN",
          payload: {
            boardState: currentBoardState.map((p) => ({ ...p })), // копия массива фигур после мутаций
          },
        });
      }
      return;
    }

    if (moveEl) {
      const moveId = moveEl.getAttribute("data-cell-id");
      if (moveId && selectedPiece) {
        // const move = getCell(board, moveId);
        const move = selectedPiece.moveSet.find((m) => m.id === moveId);
        if (!move) return;
        if (move?.special?.type === "castling") {
          const castling = move.special as Castling;
          dispatch({
            type: "PATCH_TURN",
            payload: { castling: castling.long ? "long" : "short" },
          });
        }
        if (move?.special?.type === "enPassant") {
          dispatch({ type: "PATCH_TURN", payload: { enPassant: true } });
        }
        dispatch({ type: "PATCH_TURN", payload: { toCell: move.id } });

        handleMoveClick(
          move,
          selectedPiece,
          currentBoardState,
          board,
          dispatch
        );

        const moveCell = getCell(board, moveId);
        const needsPromotion =
          selectedPiece.type === "pawn" &&
          ((selectedPiece.color === "white" && moveCell.row === 0) ||
            (selectedPiece.color === "black" && moveCell.row === 7));
        if (needsPromotion) {
          dispatch({ type: "START_EXCHANGE" });
          return;
        }
        dispatch({
          type: "END_TURN",
          payload: {
            boardState: currentBoardState.map((p) => ({ ...p })), // копия массива фигур после мутаций
          },
        });
      }
      return;
    }

    if (pieceEl) {
      const pieceId = pieceEl.getAttribute("data-piece-id");
      if (pieceId) {
        if (isExchange) return;
        const piece = handlePieceClick(
          pieceId,
          currentBoardState,
          currentTurn,
          board
        );
        console.log(piece);
        dispatch({ type: "SELECT_PIECE", payload: { selectedPiece: piece } });
        dispatch({
          type: "PATCH_TURN",
          payload: { pieceToMove: piece.id, fromCell: piece.cell.id },
        });
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
                <Cell key={i * 10 + j} cell={cell} state={state} />
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
