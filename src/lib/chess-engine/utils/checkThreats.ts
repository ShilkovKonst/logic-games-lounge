import { Cell, Piece } from "../types";
import { defineMoveSet } from "./defineMoveSet";

export function checkThreats(
  cell: Cell,
  piecesState: Piece[],
  currentPlayer: string
): Piece[] {
  const foePieces = piecesState.filter(
    (p) => p.color !== currentPlayer && !p.isTaken
  );
  const threats = [];
  for (const foe of foePieces) {
    const foeMoveSet = defineMoveSet(foe, piecesState, true);
    for (const move of foeMoveSet) {
      if (move.col === cell.col && move.row === cell.row) {
        threats.push(foe);
      }
    }
  }
  return threats;
}
