import { CellType, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";

export function handleCapture(
  cell: CellType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  board: CellType[][]
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
    console.log(pieceToTake);
    if (pieceToTake) {
      pieceToTake.isTaken = true;
      pieceToTake.cell = `takenFrom${cell.id}`;
    }
  }
}
