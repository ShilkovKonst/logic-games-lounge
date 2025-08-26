import { checkThreats } from "./getAttackSets";
import { CellType, Color, King, PieceType } from "../types";
import { getKing } from "../utils/pieceUtils";

export function checkKingSafety(
  pieces: PieceType[],
  currentPlayer: Color,
  board: CellType[][]
): King {
  const king = getKing(pieces, currentPlayer);
  const threats = checkThreats(
    king,
    king.cell.id,
    pieces,
    currentPlayer,
    board
  );

  king.isInDanger = threats.length > 0;
  for (const t of threats) king.cell.threats.add(t);

  return king;
}
