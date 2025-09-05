import {
  PieceType,
  Bishop,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
  MoveType,
} from "../types";
import { moveGenerator } from "./generator";
import { bDir, kDir, qDir, rDir } from "../constants/dirs";
import { getPieceAt } from "../utils/pieceUtils";
import { notToRC, rcToNot } from "../utils/cellUtil";

export function getMoveSet(piece: PieceType, pieces: PieceType[]): MoveType[] {
  switch (piece.type) {
    case "pawn":
      return pawnMoves(piece as Pawn, pieces);
    case "rook":
      return moveGenerator(piece as Rook, pieces, rDir, 7);
    case "knight":
      return moveGenerator(piece as Knight, pieces, kDir, 1);
    case "bishop":
      return moveGenerator(piece as Bishop, pieces, bDir, 7);
    case "queen":
      return moveGenerator(piece as Queen, pieces, qDir, 7);
    case "king":
      return moveGenerator(piece as King, pieces, qDir, 1);
  }
}

export function pawnMoves(pawn: Pawn, pieces: PieceType[]): MoveType[] {
  const moves: MoveType[] = [];
  const cell = notToRC(pawn.cell.id);
  const col = cell.col;
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = cell.row + dir;

  if (nextRow < 0 || nextRow >= 8) return moves;

  const nextCell = rcToNot(nextRow, col);
  if (!pieces.some((p) => p.cell.id === nextCell))
    moves.push({ id: nextCell, threats: new Set() });

  const target = getPieceAt(nextCell, pieces);
  const doubleRow = !target ? cell.row + dir * 2 : -1;
  if (!pawn.hasMoved && doubleRow >= 0 && doubleRow < 8) {
    const doubleCell = rcToNot(doubleRow, col);
    if (!pieces.some((p) => p.cell.id === doubleCell))
      moves.push({ id: doubleCell, threats: new Set() });
  }

  const attackMoves = pawnAttackMoves(pawn, pieces);
  return moves.concat(attackMoves);
}

export function pawnAttackMoves(pawn: Pawn, pieces: PieceType[]): MoveType[] {
  const attackMoves: MoveType[] = [];
  const cell = notToRC(pawn.cell.id);
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = cell.row + dir;
  const col = cell.col;

  if (nextRow < 0 || nextRow >= 8) return attackMoves;

  for (const tCol of [col - 1, col + 1]) {
    if (tCol < 0 || tCol >= 8) continue;

    const threatCell = rcToNot(nextRow, tCol);
    const target = getPieceAt(threatCell, pieces);
    if (target && target.color !== pawn.color) {
      attackMoves.push({ id: threatCell, threats: new Set() });
    } else if (!target) {
      checkEnPassantMoves(pawn, pieces, nextRow, tCol, attackMoves);
    }
  }
  return attackMoves;
}

function checkEnPassantMoves(
  pawn: Pawn,
  pieces: PieceType[],
  nextRow: number,
  tCol: number,
  attackMoves: MoveType[]
): void {
  const cell = notToRC(pawn.cell.id);
  const targetCell = rcToNot(cell.row, tCol);
  const target = getPieceAt(targetCell, pieces);
  if (!target) return;
  if (target.type !== "pawn") return;

  if (target.color !== pawn.color && target.canBeTakenEnPassant) {
    const nextCell = rcToNot(nextRow, tCol);
    attackMoves.push({
      id: nextCell,
      threats: new Set(),
      special: { type: "enPassant", pawnId: target.id },
    });
  }
}
