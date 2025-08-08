import { Cell, Piece } from "../types";
import { getMoveSet } from "./getMoveSet";

export function checkThreats(
  cell: Cell,
  pieces: Piece[],
  currentPlayerColor: string,
  board: Cell[][]
): Piece[] {
  const foePieces = pieces.filter(
    (p) => p.color !== currentPlayerColor && !p.isTaken
  );
  const threats = [];
  for (const foe of foePieces) {
    const foeMoveSet = getMoveSet(foe, pieces, board, true);
    for (const move of foeMoveSet) {
      if (move.id === cell.id) {
        threats.push(foe);
      }
    }
  }
  return threats;
}
