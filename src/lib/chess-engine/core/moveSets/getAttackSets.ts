import { bDir, kDir, qDir, rDir } from "../constants/dirs";
import { attackGenerator } from "./generator";
import {
  PieceType,
  Bishop,
  Color,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
} from "../types";
import { notToRC, rcToNot } from "../utils/cellUtil";

export function checkThreats(
  current: PieceType,
  cellId: string,
  currentPlayer: Color,
  boardMap: Map<string, PieceType>
): string[] {
  const threatenedBy: string[] = [];
  // boardMap contains only non-taken pieces — no filter allocation needed.
  for (const foe of boardMap.values()) {
    if (foe.color === currentPlayer) continue;
    const attacks = getAttackSet(current, foe, boardMap);
    if (attacks.some((id) => id === cellId)) {
      threatenedBy.push(foe.id);
    }
  }
  return threatenedBy;
}

function getAttackSet(
  current: PieceType,
  pieceToCheck: PieceType,
  boardMap: Map<string, PieceType>
): string[] {
  switch (pieceToCheck.type) {
    case "pawn":
      return pawnAttacks(pieceToCheck as Pawn);
    case "rook":
      return attackGenerator(current, pieceToCheck as Rook, boardMap, rDir, 7);
    case "bishop":
      return attackGenerator(current, pieceToCheck as Bishop, boardMap, bDir, 7);
    case "queen":
      return attackGenerator(current, pieceToCheck as Queen, boardMap, qDir, 7);
    case "knight":
      return attackGenerator(current, pieceToCheck as Knight, boardMap, kDir, 1);
    case "king":
      return attackGenerator(current, pieceToCheck as King, boardMap, qDir, 1);
    default:
      return [];
  }
}

function pawnAttacks(pawn: Pawn): string[] {
  const res: string[] = [];
  const cell = notToRC(pawn.cell.id);
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = cell.row + dir;
  const col = cell.col;

  if (nextRow < 0 || nextRow >= 8) return res;

  if (col - 1 >= 0) res.push(rcToNot(nextRow, col - 1));
  if (col + 1 < 8) res.push(rcToNot(nextRow, col + 1));

  return res;
}
