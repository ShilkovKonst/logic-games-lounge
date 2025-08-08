import { Cell, Color, Piece } from "../types";
import { checkThreats } from "./checkThreats";
import { getMoveSet } from "./getMoveSet";

export function filterLegalMoves(
  p: Piece,
  pieces: Piece[],
  player: Color,
  board: Cell[][]
): Cell[] {
  const moveSet = getMoveSet(p, pieces, board, false);
  for (const move of moveSet) {
    move.threats = checkThreats(move, pieces, player, board);
  }
  if (p.type === "king" && p.color === player) {
    p["moveSet"] = moveSet.filter((m) => m.threats?.length === 0);
  }
  if (p.type === "pawn" && !p.hasMoved && moveSet[1]?.threats?.length === 0) {
    moveSet[1]["threats"] = moveSet[0].threats;
  }

  return moveSet;
}
