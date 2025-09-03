import { MoveType, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";

export function updateFlagsAndPosition(
  moveTo: MoveType,
  selectedPiece: PieceType,
  pieces: PieceType[]
): void {
  pieces.forEach((p) => {
    if (p.type === "pawn") p.canBeTakenEnPassant = false;
  });
  const currentPieceCell = getCell(selectedPiece.cell.id);
  const moveToCell = getCell(moveTo.id);
  const step = Math.abs(moveToCell.row - currentPieceCell.row);
  if (selectedPiece.type === "pawn" && step === 2) {
    selectedPiece.canBeTakenEnPassant = true;
  }
  if (
    (selectedPiece.type === "pawn" ||
      selectedPiece.type === "rook" ||
      selectedPiece.type === "king") &&
    !selectedPiece.hasMoved
  ) {
    selectedPiece.hasMoved = true;
  }
  selectedPiece.cell.id = moveTo.id;
  selectedPiece.moveSet.length = 0;
}
