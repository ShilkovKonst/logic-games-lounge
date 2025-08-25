import { Dispatch, SetStateAction } from "react";
import { CellType, PieceType, TurnDetails } from "../types";
import { getCell } from "../utils/cellUtil";

export function handleCapture(
  cell: CellType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  board: CellType[][],
  setTurnDetails: Dispatch<SetStateAction<TurnDetails>>
): void {
  let pieceToTake = pieces.find((p) => p.cell === cell.id);
  if (pieceToTake && pieceToTake.id !== selectedPiece.id) {
    pieceToTake.isTaken = true;
    pieceToTake.cell = `takenFrom${cell.id}`;
  } else if (!pieceToTake && selectedPiece.type === "pawn") {
    const enPassantMove = getCell(board, cell.id);
    if (enPassantMove.special?.type !== "enPassant") return;

    const { pawnId } = enPassantMove.special;
    pieceToTake = pieces.find((p) => p.id === pawnId);
    if (pieceToTake) {
      setTurnDetails((turnDetails) => ({
        ...turnDetails,
        pieceToTake: pieceToTake?.id,
        enPassant: enPassantMove.special?.type === "enPassant",
      }));
      pieceToTake.isTaken = true;
      pieceToTake.cell = `takenFrom${cell.id}`;
    }
  }
  setTurnDetails((turnDetails) => ({
    ...turnDetails,
    pieceToTake: pieceToTake?.id,
  }));
}
