import { CellType, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";

export function updateFlagsAndPosition(
  cell: CellType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  board: CellType[][]
): void {
  pieces.forEach((p) => {
    if (p.type === "pawn") p.canBeTakenEnPassant = false;
  });
  const currentPieceCell = getCell(board, selectedPiece.cell);
  const step = Math.abs(cell.row - currentPieceCell.row);
  selectedPiece.cell = cell.id;
  selectedPiece.moveSet.length = 0;

  if (
    (selectedPiece.type === "pawn" ||
      selectedPiece.type === "rook" ||
      selectedPiece.type === "king") &&
    !selectedPiece.hasMoved
  ) {
    selectedPiece.hasMoved = true;
  }

  if (selectedPiece.type === "pawn") {
    if (step === 2) {
      selectedPiece.canBeTakenEnPassant = true;
    }
  }
}
