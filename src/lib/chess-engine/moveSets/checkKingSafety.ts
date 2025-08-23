import { checkThreats } from "./getAttackSets";
import { CellType, Color, King, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";
import { getKing } from "../utils/pieceUtils";

type ReturnType = {
  king: King;
  kingCell: CellType;
};

export function checkKingSafety(
  pieces: PieceType[],
  currentPlayer: Color,
  board: CellType[][]
): ReturnType {
  const king = getKing(pieces, currentPlayer);
  const kingCell = getCell(board, king.cell);
  const threats = checkThreats(king, king.cell, pieces, currentPlayer, board);

  king.isInDanger = threats.length > 0;
  for (const t of threats) kingCell.threats.add(t);

  return { king, kingCell };
}
