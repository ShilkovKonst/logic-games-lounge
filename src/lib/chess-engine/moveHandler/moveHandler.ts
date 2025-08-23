import { Dispatch, SetStateAction } from "react";
import { CellType, Color, PieceType } from "../types";
import { getPiece } from "../utils/pieceUtils";
import { checkMoveSetForThreats } from "../moveSets/checkMoveSetForThreats";
import { handleCapture } from "./handleCapture";
import { handleCastling } from "./handleCastling";
import { updateFlagsAndPosition } from "./handlePieceState";
import { handleExchange } from "./handleExchange";

export function handlePieceClick(
  pieceId: string,
  pieces: PieceType[],
  currentTurn: Color,
  board: CellType[][]
): PieceType {
  const piece = getPiece(pieceId, pieces);
  for (const row of board) for (const cell of row) cell.threats.clear();

  checkMoveSetForThreats(piece, pieces, currentTurn, board);
  console.log(piece);
  return piece;
}

export function handleMoveClick(
  move: CellType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  board: CellType[][],
  setIsExchange: Dispatch<SetStateAction<boolean>>,
  changeTurn: () => void
) {
  handleCapture(move, selectedPiece, pieces, board);
  handleCastling(move, selectedPiece, pieces, board);
  updateFlagsAndPosition(move, selectedPiece, pieces, board);
  handleExchange(move.row, selectedPiece, setIsExchange, changeTurn);
}
