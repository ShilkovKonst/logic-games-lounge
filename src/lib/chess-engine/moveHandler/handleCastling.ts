import { MoveType, PieceType } from "../types";
import { notToRC, rcToNot } from "../utils/cellUtil";
import { getPiece } from "../utils/pieceUtils";

export function handleCastling(
  moveTo: MoveType,
  selectedPiece: PieceType,
  pieces: PieceType[]
): void {
  if (selectedPiece.type !== "king" || selectedPiece.hasMoved) return;
  if (moveTo.special?.type !== "castling") return;

  const rookId = moveTo.special.rookId;
  const rookToCastle = getPiece(rookId, pieces);
  const moveToCell = notToRC(moveTo.id);
  const kingCell = notToRC(selectedPiece.cell.id);
  if (rookToCastle && rookToCastle.type === "rook") {
    const dir = kingCell.col > moveToCell.col ? 1 : -1;
    const rookMove = rcToNot(kingCell.row, moveToCell.col + dir);
    rookToCastle.cell.id = rookMove;
    rookToCastle.hasMoved = true;
  }
}
