import { bDir, kDir, qDir, rDir } from "../constants/dirs";
import { attackGenerator } from "./generator";
import {
  PieceType,
  CellType,
  Bishop,
  Color,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
} from "../types";
import { getCell } from "../utils/cellUtil";
import { BOARD } from "../utils/createBoard";

export function checkThreats(
  current: PieceType,
  cellId: string,
  pieces: PieceType[],
  currentPlayer: Color,
): string[] {
  const foes = pieces.filter((p) => !p.isTaken && p.color !== currentPlayer);
  const threatenedBy: string[] = [];
  for (const foe of foes) {
    const attacks = getAttackSet(current, foe, pieces);
    if (attacks.some((id) => id === cellId)) {
      threatenedBy.push(foe.id);
    }
  }
  return threatenedBy;
}

function getAttackSet(
  current: PieceType,
  pieceToCheck: PieceType,
  pieces: PieceType[]
): string[] {
  switch (pieceToCheck.type) {
    case "pawn":
      return pawnAttacks(pieceToCheck as Pawn);
    case "rook":
      return attackGenerator(current, pieceToCheck as Rook, pieces, rDir, 7);
    case "bishop":
      return attackGenerator(current, pieceToCheck as Bishop, pieces, bDir, 7);
    case "queen":
      return attackGenerator(current, pieceToCheck as Queen, pieces, qDir, 7);
    case "knight":
      return attackGenerator(current, pieceToCheck as Knight, pieces, kDir, 1);
    case "king":
      return attackGenerator(current, pieceToCheck as King, pieces, qDir, 1);
    default:
      return [];
  }
}

function pawnAttacks(pawn: Pawn): string[] {
  const res: string[] = [];
  const cell = getCell(pawn.cell.id);
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = cell.row + dir;
  const col = cell.col;

  if (nextRow < 0 || nextRow >= 8) return res;

  if (col - 1 >= 0) res.push(BOARD[nextRow][col - 1].id);
  if (col + 1 < 8) res.push(BOARD[nextRow][col + 1].id);

  return res;
}
