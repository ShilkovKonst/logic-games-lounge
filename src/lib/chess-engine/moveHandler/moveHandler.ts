import { Color, MoveType, PieceType } from "../types";
import { getPiece } from "../utils/pieceUtils";
import { checkMoveSetForThreats } from "../moveSets/checkMoveSetForThreats";
import { handleCapture } from "./handleCapture";
import { handleCastling } from "./handleCastling";
import { updateFlagsAndPosition } from "./handlePieceState";

export type MoveResult = {
  pieceToTake: string | undefined;
};

export function handlePieceClick(
  pieceId: string,
  pieces: PieceType[],
  currentTurn: Color
): PieceType {
  const original = getPiece(pieceId, pieces);
  const piece: PieceType = {
    ...original,
    cell: { ...original.cell, threats: new Set<string>() },
    moveSet: original.moveSet.map((m) => ({ ...m, threats: new Set<string>() })),
  };
  checkMoveSetForThreats(piece, pieces, currentTurn);
  return piece;
}

export function handleMoveClick(
  move: MoveType,
  selectedPiece: PieceType,
  pieces: PieceType[]
): MoveResult {
  const pieceToTake = handleCapture(move, selectedPiece, pieces);
  handleCastling(move, selectedPiece, pieces);
  updateFlagsAndPosition(move, selectedPiece, pieces);
  return { pieceToTake };
}
