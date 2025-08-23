import { checkKingSafety } from "./checkKingSafety";
import { filterAllValidMoves } from "./filterAllValidMoves";
import { getAttackTrajectory } from "./getAttackTrajectory";
import { CellType, Color, PieceType } from "../types";
import { checkPieceFinalMoves } from "./checkPieceFinalMoves";

export function getAllActiveMoveSets(
  player: Color,
  pieces: PieceType[],
  board: CellType[][]
): void {
  for (const row of board) {
    for (const cell of row) {
      cell.threats.clear();
    }
  }
  const { king, kingCell } = checkKingSafety(pieces, player, board);

  const activePieces = pieces.filter((p) => !p.isTaken);
  for (const p of activePieces) {
    p.moveSet.length = 0;
    if (p.color !== player) continue;
    if (king.isInDanger && kingCell.threats.size > 1 && p.id !== king.id)
      continue;
    const moveSet = checkPieceFinalMoves(p, pieces, player, board);
    p.moveSet.push(...moveSet);
    if (!king.isInDanger || p.id === king.id) continue;

    for (const attackerId of kingCell.threats) {
      const attacker = pieces.find((p) => p.id === attackerId);
      if (attacker) {
        const trajectory = getAttackTrajectory(kingCell, attacker, board);
        filterAllValidMoves(p, trajectory);
      }
    }
  }
}
