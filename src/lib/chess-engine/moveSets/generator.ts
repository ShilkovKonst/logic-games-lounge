import { MoveType, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";
import { BOARD } from "../utils/createBoard";
import { getPieceAt } from "../utils/pieceUtils";

export function moveGenerator(
  piece: PieceType,
  pieces: PieceType[],
  dirs: number[][],
  maxStep: number
): MoveType[] {
  const moves: MoveType[] = [];
  const pieceCell = getCell(piece.cell.id);
  const r = pieceCell.row;
  const c = pieceCell.col;

  for (const [dr, dc] of dirs) {
    let tR = r + dr;
    let tC = c + dc;
    let step = 0;
    while (tR < 8 && tR >= 0 && tC < 8 && tC >= 0 && step < maxStep) {
      const cell = BOARD[tR][tC];
      const target = getPieceAt(cell.id, pieces);

      if (target) {
        if (target.color !== piece.color)
          moves.push({ id: cell.id, threats: new Set() });
        break;
      }
      moves.push({ id: cell.id, threats: new Set() });
      tR += dr;
      tC += dc;
      step++;
    }
  }
  return moves;
}

export function attackGenerator(
  current: PieceType,
  pieceToCheck: PieceType,
  pieces: PieceType[],
  dirs: number[][],
  maxStep: number
): string[] {
  const attacks: string[] = [];
  const pieceToCheckCell = getCell(pieceToCheck.cell.id);
  const r = pieceToCheckCell.row;
  const c = pieceToCheckCell.col;

  for (const [dr, dc] of dirs) {
    let tR = r + dr;
    let tC = c + dc;
    let step = 0;
    while (tR < 8 && tR >= 0 && tC < 8 && tC >= 0 && step < maxStep) {
      const cell = BOARD[tR][tC];
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
