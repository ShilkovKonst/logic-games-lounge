import { checkThreats } from "../moveSets/getAttackSets";
import { Cell, Color, King, Piece } from "../types";

export function isKingInDanger(
  pieces: Piece[],
  currentPlayer: Color,
  board: Cell[][]
): boolean {
  const king = getKing(pieces, currentPlayer);
  const threats = checkThreats(king, king.cell, pieces, currentPlayer, board);
  console.log(king.id, threats)
  king.isInDanger = threats.length > 0;
  return king.isInDanger;
}

export function getKing(pieces: Piece[], currentPlayer: Color): King {
  const king = pieces.find(
    (p) => p.type === "king" && p.color === currentPlayer
  );
  if (!king || king.type !== "king") throw new Error("King must be in pieces!");
  return king;
}
