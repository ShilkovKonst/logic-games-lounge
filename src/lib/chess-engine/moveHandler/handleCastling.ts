import { CellType, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";

export function handleCastling(
  cell: CellType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  board: CellType[][]
): void {
  if (selectedPiece.type !== "king" || selectedPiece.hasMoved) return;

  const selectedPieceCell = getCell(board, selectedPiece.cell);
  let moveCastling = undefined;
  for (const move of selectedPiece.moveSet) {
    if (move === cell.id) moveCastling = getCell(board, move);
  }
  if (!moveCastling || moveCastling.special?.type !== "castling") return;

  const { rookId } = moveCastling.special;
  const rookToCastle = pieces.find((p) => p.id === rookId);
  if (rookToCastle && rookToCastle.type === "rook") {
    const dir = selectedPieceCell.col > cell.col ? 1 : -1;
    const rookMove = board[cell.row][cell.col + dir];
    rookToCastle["cell"] = rookMove.id;
    rookToCastle["hasMoved"] = true;
  }
}
