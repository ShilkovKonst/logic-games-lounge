import {
  CellType,
  PieceType,
  Bishop,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
} from "../types";
import { moveGenerator } from "./generator";
import { bDir, kDir, qDir, rDir } from "../constants/dirs";
import { getCell } from "../utils/cellUtil";
import { getPieceAt } from "../utils/pieceUtils";

export function getMoveSet(
  piece: PieceType,
  pieces: PieceType[],
  board: CellType[][]
): string[] {
  switch (piece.type) {
    case "pawn":
      return pawnMoves(piece as Pawn, pieces, board);
    case "rook":
      return moveGenerator(piece as Rook, pieces, board, rDir, 7);
    case "knight":
      return moveGenerator(piece as Knight, pieces, board, kDir, 1);
    case "bishop":
      return moveGenerator(piece as Bishop, pieces, board, bDir, 7);
    case "queen":
      return moveGenerator(piece as Queen, pieces, board, qDir, 7);
    case "king":
      return moveGenerator(piece as King, pieces, board, qDir, 1);
  }
}

export function pawnMoves(
  pawn: Pawn,
  pieces: PieceType[],
  board: CellType[][]
): string[] {
  const moves: string[] = [];
  const cell = getCell(board, pawn.cell);
  const col = cell.col;
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = cell.row + dir;

  if (nextRow < 0 || nextRow >= 8) return moves;

  const nextCell = board[nextRow][col];
  if (!pieces.some((p) => p.cell === nextCell.id)) moves.push(nextCell.id);
  const target = getPieceAt(nextCell.id, pieces);
  const doubleRow = !target ? cell.row + dir * 2 : -1;
  if (!pawn.hasMoved && doubleRow >= 0 && doubleRow < 8) {
    const doubleCell = board[doubleRow][col];
    if (!pieces.some((p) => p.cell === doubleCell.id))
      moves.push(doubleCell.id);
  }

  const attackMoves = pawnAttackMoves(pawn, pieces, board);
  return moves.concat(attackMoves);
}

export function pawnAttackMoves(
  pawn: Pawn,
  pieces: PieceType[],
  board: CellType[][]
): string[] {
  const attackMoves: string[] = [];
  const cell = getCell(board, pawn.cell);
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = cell.row + dir;
  const col = cell.col;

  if (nextRow < 0 || nextRow >= 8) return attackMoves;

  for (const tCol of [col - 1, col + 1]) {
    if (tCol < 0 || tCol >= 8) continue;

    const threatCell = board[nextRow][tCol];
    const target = getPieceAt(threatCell.id, pieces);
    if (target && target.color !== pawn.color) {
      attackMoves.push(threatCell.id);
    } else if (!target) {
      checkEnPassantMoves(pawn, pieces, nextRow, tCol, attackMoves, board);
    }
  }
  return attackMoves;
}

function checkEnPassantMoves(
  pawn: Pawn,
  pieces: PieceType[],
  nextRow: number,
  tCol: number,
  threats: string[],
  board: CellType[][]
): void {
  const cell = getCell(board, pawn.cell);
  const targetCell = board[cell.row][tCol];
  const target = getPieceAt(targetCell.id, pieces);
  if (!target) return;
  if (target.type !== "pawn") return;

  if (target.color !== pawn.color && target.canBeTakenEnPassant) {
    const nextCell = board[nextRow][tCol];
    nextCell["special"] = { type: "enPassant", pawnId: target.id };
    threats.push(nextCell.id);
  }
}
