import { checkKingSafety } from "./checkKingSafety";
import { filterAllValidMoves } from "./filterAllValidMoves";
import { getAttackTrajectory } from "./getAttackTrajectory";
import { Color, King, PieceType } from "../types";
import { checkPieceFinalMoves } from "./checkPieceFinalMoves";
import { notToRC } from "../utils/cellUtil";
import { buildBoardMap, getActivePieces, getPiece } from "../utils/pieceUtils";

export function getAllActiveMoveSets(player: Color, pieces: PieceType[]): King {
  // Build once — O(n). All downstream lookups are O(1) via the map.
  const boardMap = buildBoardMap(pieces);

  const king = checkKingSafety(pieces, player, boardMap);
  const doubleCheck = king.cell.threats.size > 1;
  const activePieces = getActivePieces(player, pieces);
  for (const p of activePieces) {
    p.moveSet.length = 0;
    if (p.color !== player) continue;
    if (doubleCheck && p.id !== king.id) continue;
    const moveSet = checkPieceFinalMoves(p, player, king, boardMap);
    p.moveSet = moveSet;
    if (!king.isInDanger || p.id === king.id) continue;

    for (const attackerId of king.cell.threats) {
      const attacker = getPiece(attackerId, pieces);
      const kingCell = notToRC(king.cell.id);
      const trajectory = getAttackTrajectory(kingCell, attacker);
      filterAllValidMoves(p, trajectory);
    }
  }
  return king;
}
