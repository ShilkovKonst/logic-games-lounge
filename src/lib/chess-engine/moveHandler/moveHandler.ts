import { Dispatch, SetStateAction } from "react";
import { CellType, Color, PieceType, TurnDetails } from "../types";
import { getPiece } from "../utils/pieceUtils";
import { checkMoveSetForThreats } from "../moveSets/checkMoveSetForThreats";
import { handleCapture } from "./handleCapture";
import { handleCastling } from "./handleCastling";
import { updateFlagsAndPosition } from "./handlePieceState";

export function handlePieceClick(
  pieceId: string,
  pieces: PieceType[],
  currentTurn: Color,
  board: CellType[][]
): PieceType {
  const piece = getPiece(pieceId, pieces);
  for (const row of board) for (const cell of row) cell.threats.clear();

  checkMoveSetForThreats(piece, pieces, currentTurn, board);
  return piece;
}

export function handleMoveClick(
  move: CellType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  board: CellType[][],
  setIsExchange: Dispatch<SetStateAction<boolean>>,
  changeTurn: () => void,
  setTurnDetails: Dispatch<SetStateAction<TurnDetails>>
): void {
  setTurnDetails((turnDetails) => ({
    ...turnDetails,
    toCell: move.id,
  }));
  handleCapture(move, selectedPiece, pieces, board, changeTurn);
  handleCastling(move, selectedPiece, pieces, board);
  updateFlagsAndPosition(move, selectedPiece, pieces, board);
  if (
    selectedPiece.type !== "pawn" ||
    (selectedPiece.color === "white" && move.row !== 0) ||
    (selectedPiece.color === "black" && move.row !== 7)
  ) {
    changeTurn();
    return;
  }
  setIsExchange(true);
}
