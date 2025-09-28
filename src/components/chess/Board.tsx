/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ActionDispatch, MouseEvent, TouchEvent, useEffect } from "react";
import { usePlayerState } from "@/context/PlayerStateContext";
import Cell from "./Cell";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import {
  Castling,
  Color,
  Draw,
  GameState,
  GameType,
  PieceType,
  TurnDetails,
} from "@/lib/chess-engine/types";
import { notToRC } from "@/lib/chess-engine/utils/cellUtil";
import {
  getActivePieces,
  getPieceAt,
  isPieces,
} from "@/lib/chess-engine/utils/pieceUtils";
import {
  handleMoveClick,
  handlePieceClick,
} from "@/lib/chess-engine/moveHandler/moveHandler";
import { flip, GameAction } from "@/lib/chess-engine/reducer/chessReducer";
import { BOARD } from "@/lib/chess-engine/utils/createBoard";
import { getAllActiveMoveSets } from "@/lib/chess-engine/moveSets/getAllActiveMoveSets";
import {
  checkIsEnoughPieces,
  checkRepetition,
} from "@/lib/chess-engine/drawChecker/drawChecker";
import { computeHighlights } from "@/lib/chess-engine/utils/styleUtils";

type BoardProps = {
  gameType: GameType;
  state: GameState;
  dispatch: ActionDispatch<[action: GameAction]>;
};

const Board: React.FC<BoardProps> = ({ state, dispatch, gameType }) => {
  const { playerState } = usePlayerState();
  const { selectedPiece, currentBoardState, currentTurn, isExchange, log } =
    state;

  // const highlights = useMemo(
  //   () => computeHighlights(selectedPiece, ),
  //   [selectedPiece]
  // );

  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;
    const exchangeToEl = target.closest(".exchange-to");
    if (exchangeToEl) {
      produceExchange(selectedPiece, state, dispatch, exchangeToEl);
      return;
    }
    const moveEl = target.closest(".move");
    if (moveEl) {
      produceMove(selectedPiece, state, dispatch, moveEl);
      return;
    }
    const pieceEl = target.closest(".piece");
    if (pieceEl) {
      produceSelection(selectedPiece, state, dispatch, pieceEl);
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
  }, [currentTurn, log.length]);

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
              const highlights = computeHighlights(selectedPiece);
              return (
                <Cell
                  key={i * 10 + j}
                  cell={cell}
                  piece={piece}
                  currentTurn={currentTurn}
                  isExchange={isExchange}
                  gameType={gameType}
                  highlights={highlights[cell] ?? {}}
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

function produceExchange(
  selectedPiece: PieceType | undefined,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>,
  exchangeToEl: Element
) {
  const exchangeType = exchangeToEl.getAttribute("data-exchange-to");
  if (exchangeType && isPieces(exchangeType) && selectedPiece) {
    selectedPiece.type = exchangeType;
    dispatch({
      type: "PATCH_TURN",
      payload: { isExchange: true, pieceToExchange: exchangeType },
    });
    dispatch({ type: "END_EXCHANGE" });

    const { foeColor, check, checkmate, draw } = calcFoeState(
      state.currentTurn,
      state.currentBoardState,
      state.log,
      state.turnDetails
    );

    dispatch({
      type: "PATCH_TURN",
      payload: {
        check: check ? foeColor : undefined,
        checkmate: checkmate ? foeColor : undefined,
        draw: draw,
      },
    });

    dispatch({
      type: "END_TURN",
      payload: {
        boardState: state.currentBoardState.map((p) => ({ ...p })),
      },
    });
  }
}

function produceMove(
  selectedPiece: PieceType | undefined,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>,
  moveEl: Element
) {
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
    const ambiguity = state.currentBoardState.reduce<string[]>((acc, p) => {
      if (
        !p.isTaken &&
        p.color === state.currentTurn &&
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

    handleMoveClick(move, selectedPiece, state.currentBoardState, dispatch);

    const moveCell = notToRC(moveId);
    const needsPromotion =
      selectedPiece.type === "pawn" &&
      ((selectedPiece.color === "white" && moveCell.row === 0) ||
        (selectedPiece.color === "black" && moveCell.row === 7));
    if (needsPromotion) {
      dispatch({ type: "START_EXCHANGE" });
      return;
    }

    const { foeColor, check, checkmate, draw } = calcFoeState(
      state.currentTurn,
      state.currentBoardState,
      state.log,
      state.turnDetails
    );
    dispatch({
      type: "PATCH_TURN",
      payload: {
        check: check ? foeColor : undefined,
        checkmate: checkmate ? foeColor : undefined,
        draw: draw,
      },
    });

    dispatch({
      type: "END_TURN",
      payload: {
        boardState: state.currentBoardState.map((p) => ({ ...p })),
      },
    });
  }
}

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

function checkMovesAllowed(activePieces: PieceType[]): boolean {
  return activePieces.some((p) => p.moveSet.length > 0);
}

type CalcFoeReturn = {
  foeColor: Color;
  check: boolean;
  checkmate: boolean;
  draw: Draw;
};

// calc states and movesets for foe pieces for next turn
function calcFoeState(
  currentTurn: Color,
  currentBoardState: PieceType[],
  log: TurnDetails[][],
  turnDetails: TurnDetails
): CalcFoeReturn {
  const foeColor = flip(currentTurn);
  const foeKing = getAllActiveMoveSets(foeColor, currentBoardState);
  const activePieces = getActivePieces(currentTurn, currentBoardState);
  const activeFoePieces = getActivePieces(foeColor, currentBoardState);
  const isMovesAllowed = checkMovesAllowed(activeFoePieces);
  const { threefold } = checkRepetition(log, turnDetails);
  const pawnsCanMove = !activeFoePieces
    .filter((p) => p.type === "pawn")
    .every((p) => p.moveSet.length === 0);

  const isStalemate = !foeKing.isInDanger && !isMovesAllowed;
  const isInsufficientMaterial = checkIsEnoughPieces(activePieces);
  const isInsufficientFoeMaterial = checkIsEnoughPieces(activeFoePieces);
  const isRepetition = !pawnsCanMove && threefold;

  return {
    foeColor,
    check: foeKing.isInDanger && isMovesAllowed,
    checkmate: foeKing.isInDanger && !isMovesAllowed,
    draw: isStalemate
      ? "stalemate"
      : isInsufficientMaterial && isInsufficientFoeMaterial
      ? "insufficientMaterial"
      : isRepetition
      ? "repetition"
      : "none",
  };
}
