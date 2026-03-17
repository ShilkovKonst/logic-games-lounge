import { MoveType, PieceType } from "../types";

export function handleCapture(
  moveTo: MoveType,
  selectedPiece: PieceType,
  pieces: PieceType[]
): string | undefined {
  let pieceToTake = pieces.find((p) => p.cell.id === moveTo.id);
  if (pieceToTake && pieceToTake.id !== selectedPiece.id) {
    pieceToTake.isTaken = true;
    pieceToTake.cell.id = `takenFrom${moveTo.id}`;
  } else if (!pieceToTake && selectedPiece.type === "pawn") {
    if (moveTo.special?.type !== "enPassant") return undefined;

    const { pawnId } = moveTo.special;
    pieceToTake = pieces.find((p) => p.id === pawnId);
    if (pieceToTake) {
      pieceToTake.isTaken = true;
      pieceToTake.cell.id = `takenFrom${moveTo.id}`;
    }
  }
  return pieceToTake ? `${pieceToTake.type}${pieceToTake.id}` : undefined;
}
