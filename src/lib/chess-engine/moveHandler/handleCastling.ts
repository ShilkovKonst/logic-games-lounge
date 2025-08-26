import { CellType, MoveType, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";
import { getPiece } from "../utils/pieceUtils";

export function handleCastling(
  moveTo: MoveType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  board: CellType[][]
): void {
  if (selectedPiece.type !== "king" || selectedPiece.hasMoved) return;
  if (moveTo.special?.type !== "castling") return;
  // if (
  //   selectedPiece.moveSet.every(
  //     (m) => !m.special || m.special.type !== "castling"
  //   )
  // )
  //   return;

  // let moveCastling = undefined;
  // for (const move of selectedPiece.moveSet) {
  //   if (move.id === moveTo.id) moveCastling = getCell(board, move.id);
  // }
  // if (!moveCastling || moveCastling.special?.type !== "castling") return;
  
  const rookId = moveTo.special.rookId;
  const rookToCastle = getPiece(rookId, pieces);
  const moveToCell = getCell(board, moveTo.id);
  const kingCell = getCell(board, selectedPiece.cell.id);
  if (rookToCastle && rookToCastle.type === "rook") {
    const dir = kingCell.col > moveToCell.col ? 1 : -1;
    const rookMove = board[kingCell.row][moveToCell.col + dir];
    rookToCastle.cell.id = rookMove.id;
    rookToCastle.hasMoved = true;
  }
}
