import { checkThreats } from "./getAttackSets";
import { Color, King, PieceType } from "../types";
import { getKing } from "../utils/pieceUtils";

export function checkKingSafety(
  pieces: PieceType[],
  currentPlayer: Color,
  boardMap: Map<string, PieceType>
): King {
  const king = getKing(pieces, currentPlayer);
  king.cell.threats.clear();
  const threats = checkThreats(king, king.cell.id, currentPlayer, boardMap);

  king.isInDanger = threats.length > 0;
  for (const t of threats) king.cell.threats.add(t);

  return king;
}
