import { MoveType, PieceType } from "../types";
import { notToRC, rcToNot } from "../utils/cellUtil";

export function moveGenerator(
  piece: PieceType,
  boardMap: Map<string, PieceType>,
  dirs: number[][],
  maxStep: number
): MoveType[] {
  const moves: MoveType[] = [];
  const pieceCell = notToRC(piece.cell.id);
  const r = pieceCell.row;
  const c = pieceCell.col;

  for (const [dr, dc] of dirs) {
    let tR = r + dr;
    let tC = c + dc;
    let step = 0;
    while (tR < 8 && tR >= 0 && tC < 8 && tC >= 0 && step < maxStep) {
      const cell = rcToNot(tR, tC);
      const target = boardMap.get(cell);

      if (target) {
        if (target.color !== piece.color)
          moves.push({ id: cell, threats: new Set() });
        break;
      }
      moves.push({ id: cell, threats: new Set() });
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
  boardMap: Map<string, PieceType>,
  dirs: number[][],
  maxStep: number
): string[] {
  const attacks: string[] = [];
  const pieceToCheckCell = notToRC(pieceToCheck.cell.id);
  const r = pieceToCheckCell.row;
  const c = pieceToCheckCell.col;

  for (const [dr, dc] of dirs) {
    let tR = r + dr;
    let tC = c + dc;
    let step = 0;
    while (tR < 8 && tR >= 0 && tC < 8 && tC >= 0 && step < maxStep) {
      const cell = rcToNot(tR, tC);
      const target = boardMap.get(cell);

      if (target && target.id !== current.id) {
        attacks.push(cell);
        break;
      }

      attacks.push(cell);
      tR += dr;
      tC += dc;
      step++;
    }
  }
  return attacks;
}
