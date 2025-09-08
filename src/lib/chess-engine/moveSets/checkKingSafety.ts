import { checkThreats } from "./getAttackSets";
import { Color, King, PieceType } from "../types";
import { getKing } from "../utils/pieceUtils";

export function checkKingSafety(
  pieces: PieceType[],
  currentPlayer: Color
): King {
  const king = getKing(pieces, currentPlayer);
  king.cell.threats.clear();
  const threats = checkThreats(king, king.cell.id, pieces, currentPlayer);

  king.isInDanger = threats.length > 0;
  for (const t of threats) king.cell.threats.add(t);

  return king;
}
