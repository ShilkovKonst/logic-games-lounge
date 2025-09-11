import { ActionDispatch } from "react";
import { Color, MoveType, PieceType } from "../types";
import { getPiece } from "../utils/pieceUtils";
import { checkMoveSetForThreats } from "../moveSets/checkMoveSetForThreats";
import { handleCapture } from "./handleCapture";
import { handleCastling } from "./handleCastling";
import { updateFlagsAndPosition } from "./handlePieceState";
import { GameAction } from "@/lib/chess-engine/reducer/chessReducer";

export function handlePieceClick(
  pieceId: string,
  pieces: PieceType[],
  currentTurn: Color
): PieceType {
  const piece = getPiece(pieceId, pieces);
  piece.cell.threats.clear();
  for (const move of piece.moveSet) move.threats.clear();
  checkMoveSetForThreats(piece, pieces, currentTurn);
  return piece;
}

export function handleMoveClick(
  move: MoveType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  dispatch: ActionDispatch<[action: GameAction]>
): void {
  handleCapture(move, selectedPiece, pieces, dispatch);
  handleCastling(move, selectedPiece, pieces);
  updateFlagsAndPosition(move, selectedPiece, pieces);
}
