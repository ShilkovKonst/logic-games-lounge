import { CellType, PieceType } from "../types";
import { inBounds, notToRowCol } from "../utils/cellUtil";
import { getPieceAt } from "../utils/pieceUtils";

export function checkPinPiece(
  currentPiece: PieceType,
  kingCellId: string,
  board: CellType[][],
  pieces: PieceType[]
): string[] {
  if (currentPiece.type === "king") return [];
  const selectedPieceCell = notToRowCol(currentPiece.cell.id);
  const kingCell = notToRowCol(kingCellId);
  if (!isAligned(selectedPieceCell, kingCell)) return [];
  console.log("currentPiece", currentPiece.id);

  const dr = dir(selectedPieceCell.row - kingCell.row);
  const dc = dir(selectedPieceCell.col - kingCell.col);
  console.log("dir r", selectedPieceCell.row, kingCell.row);
  console.log("dir c", selectedPieceCell.col, kingCell.col);

  let r = kingCell.row + dr;
  let c = kingCell.col + dc;
  const toKing: string[] = [];
  while (r !== selectedPieceCell.row || c !== selectedPieceCell.col) {
    if (!inBounds(r, c)) return [];
    const id = board[r][c].id;
    console.log("piece cell id", id, r, c);
    const piece = getPieceAt(id, pieces);
    if (piece && id !== currentPiece.cell.id) {
      return [];
    }
    if (id !== currentPiece.cell.id) toKing.push(id);
    r += dr;
    c += dc;
  }

  r = selectedPieceCell.row + dr;
  c = selectedPieceCell.col + dc;
  const toAttacker: string[] = [];
  while (inBounds(r, c)) {
    const id = board[r][c].id;
    console.log("attacker cell id", id);
    const attacker = getPieceAt(id, pieces);
    toAttacker.push(id);
    if (attacker) {
      if (attacker.color === currentPiece.color) return [];
      if (
        attacker.color !== currentPiece.color &&
        isSliderForDir(attacker, dr, dc)
      ) {
        console.log("pin moves", [...toKing, ...toAttacker]);
        return [...toKing, ...toAttacker];
      } else {
        return [];
      }
    }
    r += dr;
    c += dc;
  }

  return [];
}

function isAligned(
  a: {
    row: number;
    col: number;
  },
  b: {
    row: number;
    col: number;
  }
): boolean {
  const sameRow = a.row === b.row;
  const sameCol = a.col === b.col;
  const sameDiag = Math.abs(a.row - b.row) === Math.abs(a.col - b.col);
  return sameRow || sameCol || sameDiag;
}

function isSliderForDir(piece: PieceType, dr: number, dc: number): boolean {
  const ortho = dr === 0 || dc === 0;
  const diag = dr !== 0 && dc !== 0;
  if (piece.type === "queen") return true;
  if (piece.type === "rook") return ortho;
  if (piece.type === "bishop") return diag;
  return false;
}

function dir(a: number): number {
  return a === 0 ? 0 : a > 0 ? 1 : -1;
}
