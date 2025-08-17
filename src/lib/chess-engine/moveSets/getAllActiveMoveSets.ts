import { Cell, Color, Piece } from "../types";
import { checkPieceFinalMoves } from "./checkPieceFinalMoves";

export function getAllActiveMoveSets(
  player: Color,
  pieces: Piece[],
  board: Cell[][]
) {
  for (const row of board) {
    for (const cell of row) {
      cell.threats.clear();
    }
  }
  const activePieces = pieces.filter((p) => !p.isTaken && p.color === player);
  for (const p of activePieces) {
    p.moveSet.clear();
    const moveSet = checkPieceFinalMoves(p, pieces, player, board);
    for (const move of moveSet) p.moveSet.add(move);
  }
}
