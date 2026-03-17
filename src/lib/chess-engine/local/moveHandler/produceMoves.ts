import { ActionDispatch } from "react";
import {
  Castling,
  Color,
  Draw,
  GameState,
  PieceType,
  TurnDetails,
} from "../../core/types";
import { notToRC } from "../../core/utils/cellUtil";
import { getActivePieces, isPieces } from "../../core/utils/pieceUtils";
import { handleMoveClick } from "./moveHandler";
import { flip, GameAction } from "../reducer/chessReducer";
import { getAllActiveMoveSets } from "../../core/moveSets/getAllActiveMoveSets";
import {
  checkIsEnoughPieces,
  checkRepetition,
} from "../../core/drawChecker/drawChecker";

type CalcFoeReturn = {
  foeColor: Color;
  check: boolean;
  checkmate: boolean;
  draw: Draw;
};

function checkMovesAllowed(activePieces: PieceType[]): boolean {
  return activePieces.some((p) => p.moveSet.length > 0);
}

export function calcFoeState(
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

export function produceMove(
  selectedPiece: PieceType | undefined,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>,
  moveId: string
): void {
  if (!selectedPiece) return;

  const move = selectedPiece.moveSet.find((m) => m.id === moveId);
  if (!move) return;

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
  patch.fromCell = selectedPiece.cell.id;
  patch.pieceToMove = selectedPiece.type + selectedPiece.id;
  patch.ambiguity = ambiguity;

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

  dispatch({
    type: "END_TURN",
    payload: {
      turnPatch: patch,
      boardState: workingBoard,
    },
  });
}

export function produceExchange(
  selectedPiece: PieceType | undefined,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>,
  exchangeType: string
): void {
  if (!isPieces(exchangeType) || !selectedPiece) return;

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
