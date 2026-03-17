"use client";
import {
  ActionDispatch,
  MouseEvent,
  TouchEvent,
  useMemo,
} from "react";
import { usePlayerState } from "@/context/PlayerStateContext";
import Cell from "./Cell";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import {
  GameState,
  GameType,
  PieceType,
} from "@/lib/chess-engine/core/types";
import {
  getPieceAt,
} from "@/lib/chess-engine/core/utils/pieceUtils";
import {
  handlePieceClick,
} from "@/lib/chess-engine/local/moveHandler/moveHandler";
import { GameAction } from "@/lib/chess-engine/local/reducer/chessReducer";
import { BOARD } from "@/lib/chess-engine/core/utils/createBoard";
import { computeHighlights, EMPTY_HIGHLIGHT } from "@/lib/chess-engine/core/utils/styleUtils";
import {
  produceMove,
  produceExchange,
} from "@/lib/chess-engine/local/moveHandler/produceMoves";

type BoardProps = {
  gameType: GameType;
  state: GameState;
  dispatch: ActionDispatch<[action: GameAction]>;
};

const Board: React.FC<BoardProps> = ({ state, dispatch, gameType }) => {
  const { playerState } = usePlayerState();
  const { selectedPiece, currentBoardState, currentTurn, isExchange } = state;

  const highlights = useMemo(
    () => computeHighlights(selectedPiece),
    [selectedPiece]
  );

  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;
    const exchangeToEl = target.closest(".exchange-to");
    if (exchangeToEl) {
      const exchangeType = exchangeToEl.getAttribute("data-exchange-to");
      if (exchangeType) produceExchange(selectedPiece, state, dispatch, exchangeType);
      return;
    }
    const moveEl = target.closest(".move");
    if (moveEl) {
      const moveId = moveEl.getAttribute("data-cell-id");
      if (moveId) produceMove(selectedPiece, state, dispatch, moveId);
      return;
    }
    const pieceEl = target.closest(".piece");
    if (pieceEl) {
      produceSelection(selectedPiece, state, dispatch, pieceEl);
      return;
    }
  };

  return (
    <div
      className={`order-1 md:order-2 col-span-9 border-4 border-amber-950 h-[404px] w-[404px] md:h-[458px] md:w-[458px] `}
    >
      <div className="grid grid-cols-9">
        <RowCount increment={0} />
        <div
          onClick={(e) => handleClick(e)}
          className={`col-start-2 col-span-8 grid grid-flow-row grid-cols-8 grid-rows-8 ${
            playerState.color === "white" ? "rotate-0" : "rotate-180"
          } border-amber-950`}
        >
          {BOARD.map((r, i) =>
            r.map((cell, j) => {
              const piece = getPieceAt(cell, currentBoardState);
              return (
                <Cell
                  key={i * 10 + j}
                  cell={cell}
                  piece={piece}
                  currentTurn={currentTurn}
                  isExchange={isExchange}
                  gameType={gameType}
                  highlight={highlights[cell] ?? EMPTY_HIGHLIGHT}
                />
              );
            })
          )}
        </div>
      </div>
      <ColCount increment={1} />
    </div>
  );
};

export default Board;

function produceSelection(
  selectedPiece: PieceType | undefined,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>,
  pieceEl: Element
) {
  const pieceId = pieceEl.getAttribute("data-piece-id");
  if (pieceId && pieceId !== selectedPiece?.id) {
    if (state.isExchange) return;
    const piece = handlePieceClick(
      pieceId,
      state.currentBoardState,
      state.currentTurn
    );
    dispatch({ type: "SELECT_PIECE", payload: { selectedPiece: piece } });
    dispatch({
      type: "PATCH_TURN",
      payload: {
        pieceToMove: piece.type + piece.id,
        fromCell: piece.cell.id,
      },
    });
  }
}

