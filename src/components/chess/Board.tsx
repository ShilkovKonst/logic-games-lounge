/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ActionDispatch, MouseEvent, TouchEvent, useEffect } from "react";
import { usePlayerState } from "@/context/PlayerStateContext";
import Cell from "./Cell";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import { Castling, GameState, GameType } from "@/lib/chess-engine/types";
import { getCell } from "@/lib/chess-engine/utils/cellUtil";
import { isPieces } from "@/lib/chess-engine/utils/pieceUtils";
import {
  handleMoveClick,
  handlePieceClick,
} from "@/lib/chess-engine/moveHandler/moveHandler";
import { GameAction } from "@/reducer/chessReducer";
import { BOARD } from "@/lib/chess-engine/utils/createBoard";

type BoardProps = {
  gameType: GameType;
  state: GameState;
  dispatch: ActionDispatch<[action: GameAction]>;
};

const Board: React.FC<BoardProps> = ({ state, dispatch, gameType }) => {
  const { playerState } = usePlayerState();

  const { selectedPiece, currentBoardState, currentTurn, isExchange, log } =
    state;

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
          payload: { isExchange: true, pieceToExchange: exchangeType },
        });
        dispatch({ type: "END_EXCHANGE" });
        dispatch({
          type: "END_TURN",
          payload: {
            boardState: currentBoardState.map((p) => ({ ...p })),
          },
        });
      }
      return;
    }

    if (moveEl) {
      const moveId = moveEl.getAttribute("data-cell-id");
      if (moveId && selectedPiece) {
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
          dispatch({ type: "PATCH_TURN", payload: { isEnPassant: true } });
        }
        const ambiguity = currentBoardState.reduce<string[]>((acc, p) => {
          if (
            !p.isTaken &&
            p.color === currentTurn &&
            p.type === selectedPiece.type &&
            p.id !== selectedPiece.id
          ) {
            const move = p.moveSet.find((m) => m.id === moveId);
            if (move) acc.push(p.cell.id);
          }
          return acc;
        }, []);
        
        dispatch({
          type: "PATCH_TURN",
          payload: { toCell: move.id, ambiguity: ambiguity },
        });

        handleMoveClick(
          move,
          selectedPiece,
          currentBoardState,
          BOARD,
          dispatch
        );

        const moveCell = getCell(BOARD, moveId);
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
            boardState: currentBoardState.map((p) => ({ ...p })),
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
          BOARD
        );
        dispatch({ type: "SELECT_PIECE", payload: { selectedPiece: piece } });
        dispatch({
          type: "PATCH_TURN",
          payload: {
            pieceToMove: piece.id,
            fromCell: piece.cell.id,
          },
        });
      }
      return;
    }
  };

  useEffect(() => {
    dispatch({
      type: "PATCH_TURN",
      payload: {
        boardState: currentBoardState.map((p) => ({
          ...p,
          id: p.id,
          cell: { ...p.cell },
          moveSet: [],
        })),
      },
    });
    console.log("turn");
  }, [currentTurn, log.length]);

  return (
    <div
      className={`order-1 md:order-2 col-span-10 ${
        playerState.color === "white" ? "rotate-0" : "rotate-180"
      } border-4 border-amber-950 h-[448px] w-[448px] md:h-[508px] md:w-[508px] `}
    >
      <ColCount increment={0} />
      <div className="grid grid-cols-10">
        <RowCount increment={0} />
        <div
          onClick={(e) => handleClick(e)}
          className="col-start-2 col-span-8 border-amber-950"
        >
          {BOARD.map((r, i) => (
            <div key={i} className="flex">
              {r.map((cell, j) => (
                <Cell
                  key={i * 10 + j}
                  cell={cell}
                  state={state}
                  gameType={gameType}
                />
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
