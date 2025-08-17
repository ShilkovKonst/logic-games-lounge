import { Cell, Piece } from "../types";
import { getCell } from "../utils/cellUtil";

export function moveGenerator(
  piece: Piece,
  pieces: Piece[],
  board: Cell[][],
  dirs: number[][],
  maxStep: number
): string[] {
  const moves: string[] = [];
  const pieceCell = getCell(board, piece.cell);
  const r = pieceCell.row;
  const c = pieceCell.col;

  for (const [dr, dc] of dirs) {
    let tR = r + dr;
    let tC = c + dc;
    let step = 0;
    while (tR < 8 && tR >= 0 && tC < 8 && tC >= 0 && step < maxStep) {
      const cell = board[tR][tC];
      const target = getPieceAt(cell.id, pieces);

      if (target) {
        if (target.color !== piece.color) moves.push(cell.id);
        break;
      }
      moves.push(cell.id);
      tR += dr;
      tC += dc;
      step++;
    }
  }
  return moves;
}

export function attackGenerator(
  current: Piece,
  pieceToCheck: Piece,
  pieces: Piece[],
  board: Cell[][],
  dirs: number[][],
  maxStep: number
): string[] {
  const attacks: string[] = [];
  const pieceToCheckCell = getCell(board, pieceToCheck.cell);
  const r = pieceToCheckCell.row;
  const c = pieceToCheckCell.col;

  for (const [dr, dc] of dirs) {
    let tR = r + dr;
    let tC = c + dc;
    let step = 0;
    while (tR < 8 && tR >= 0 && tC < 8 && tC >= 0 && step < maxStep) {
      const cell = board[tR][tC];
      const target = getPieceAt(cell.id, pieces);

      if (target && target.id !== current.id) {
        attacks.push(cell.id);
        break;
      }

      attacks.push(cell.id);
      tR += dr;
      tC += dc;
      step++;
    }
  }
  return attacks;
}

export const getPieceAt: (
  cellId: string,
  pieces: Piece[]
) => Piece | undefined = (cellId, pieces) =>
  pieces.find((p) => !p.isTaken && p.cell === cellId);
