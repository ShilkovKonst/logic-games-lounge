import { checkThreats } from "../moveSets/getAttackSets";
import { Cell, Color, King, Piece } from "../types";
import { getCell } from "../utils/cellUtil";

type ReturnType = {
  king: King;
  kingCell: Cell;
};

export function checkKingSafety(
  pieces: Piece[],
  currentPlayer: Color,
  board: Cell[][]
): ReturnType {
  const king = getKing(pieces, currentPlayer);
  const kingCell = getCell(board, king.cell);
  const threats = checkThreats(king, king.cell, pieces, currentPlayer, board);

  king.isInDanger = threats.length > 0;
  for (const t of threats) kingCell.threats.add(t);
  
  return { king, kingCell };
}

export function getKing(pieces: Piece[], currentPlayer: Color): King {
  const king = pieces.find(
    (p) => p.type === "king" && p.color === currentPlayer
  );
  if (!king || king.type !== "king") throw new Error("King must be in pieces!");
  return king;
}
