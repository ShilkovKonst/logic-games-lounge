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
import { computeHighlights, EMPTY_HIGHLIGHT } from "@/lib/chess-engine/utils/styleUtils";

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

function produceExchange(
  selectedPiece: PieceType | undefined,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>,
  exchangeToEl: Element
) {
  const exchangeType = exchangeToEl.getAttribute("data-exchange-to");
  if (!exchangeType || !isPieces(exchangeType) || !selectedPiece) return;

  // state.currentBoardState is already a working copy (set by START_EXCHANGE).
  // Create another copy to apply the type mutation without touching live state.
  const workingBoard: PieceType[] = state.currentBoardState.map((p) => ({
    ...p,
    cell: { ...p.cell },
    moveSet: [],
  }));
  const workingPiece = workingBoard.find((p) => p.id === selectedPiece.id)!;
  workingPiece.type = exchangeType;

  const { foeColor, check, checkmate, draw } = calcFoeState(
    state.currentTurn,
    workingBoard,
    state.log,
    state.turnDetails
  );

  // Single END_TURN carries the full turn patch.
  // The reducer resets isExchange: false as part of END_TURN, so no
  // separate END_EXCHANGE dispatch is needed.
  dispatch({
    type: "END_TURN",
    payload: {
      turnPatch: {
        isExchange: true,
        pieceToExchange: exchangeType,
        check: check ? foeColor : undefined,
        checkmate: checkmate ? foeColor : undefined,
        draw,
      },
      boardState: workingBoard,
    },
  });
}

function produceMove(
  selectedPiece: PieceType | undefined,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>,
  moveEl: Element
) {
  const moveId = moveEl.getAttribute("data-cell-id");
  if (!moveId || !selectedPiece) return;

  const move = selectedPiece.moveSet.find((m) => m.id === moveId);
  if (!move) return;

  // Collect all turn metadata into one patch object — no dispatch yet.
  const patch: Partial<TurnDetails> = {};

  if (move.special?.type === "castling") {
    const castling = move.special as Castling;
    patch.castling = castling.long ? "long" : "short";
  }
  if (move.special?.type === "enPassant") {
    patch.isEnPassant = true;
  }

  const ambiguity = state.currentBoardState.reduce<string[]>((acc, p) => {
    if (
      !p.isTaken &&
      p.color === state.currentTurn &&
      p.type === selectedPiece.type &&
      p.id !== selectedPiece.id
    ) {
      const sameTarget = p.moveSet.find((m) => m.id === moveId);
      if (sameTarget) acc.push(p.cell.id);
    }
    return acc;
  }, []);

  patch.toCell = move.id;
  patch.ambiguity = ambiguity;

  // Create working copies — mutations happen on copies, not on live state.
  const workingBoard: PieceType[] = state.currentBoardState.map((p) => ({
    ...p,
    cell: { ...p.cell },
    moveSet: [],
  }));
  const workingPiece = workingBoard.find((p) => p.id === selectedPiece.id)!;

  const { pieceToTake } = handleMoveClick(move, workingPiece, workingBoard);
  patch.pieceToTake = pieceToTake;

  const moveCell = notToRC(moveId);
  const needsPromotion =
    selectedPiece.type === "pawn" &&
    ((selectedPiece.color === "white" && moveCell.row === 0) ||
      (selectedPiece.color === "black" && moveCell.row === 7));

  if (needsPromotion) {
    // Save collected patch and pass the working board to START_EXCHANGE so
    // produceExchange sees the already-moved pawn in currentBoardState.
    dispatch({ type: "PATCH_TURN", payload: patch });
    dispatch({ type: "START_EXCHANGE", payload: { boardState: workingBoard } });
    return;
  }

  const { foeColor, check, checkmate, draw } = calcFoeState(
    state.currentTurn,
    workingBoard,
    state.log,
    state.turnDetails
  );

  patch.check = check ? foeColor : undefined;
  patch.checkmate = checkmate ? foeColor : undefined;
  patch.draw = draw;

  // Single dispatch for the entire turn.
  dispatch({
    type: "END_TURN",
    payload: {
      turnPatch: patch,
      boardState: workingBoard,
    },
  });
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
