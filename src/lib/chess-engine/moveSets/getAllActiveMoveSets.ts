import { checkKingSafety } from "./checkKingSafety";
import { filterAllValidMoves } from "./filterAllValidMoves";
import { getAttackTrajectory } from "./getAttackTrajectory";
import { Color, King, PieceType } from "../types";
import { checkPieceFinalMoves } from "./checkPieceFinalMoves";
import { getCell } from "../utils/cellUtil";
import { getActivePieces, getPiece } from "../utils/pieceUtils";

export function getAllActiveMoveSets(player: Color, pieces: PieceType[]): King {
  const king = checkKingSafety(pieces, player);
  const activePieces = getActivePieces(player, pieces);
  for (const p of activePieces) {
    p.moveSet.length = 0;
    if (p.color !== player) continue;
    // double check case, only king can move
    if (king.cell.threats.size > 1 && p.id !== king.id) continue;
    const moveSet = checkPieceFinalMoves(p, pieces, player, king);
    p.moveSet.push(...moveSet);
    if (!king.isInDanger || p.id === king.id) continue;

    for (const attackerId of king.cell.threats) {
      const attacker = getPiece(attackerId, pieces);
      const kingCell = getCell(king.cell.id);
      const trajectory = getAttackTrajectory(kingCell, attacker);
      filterAllValidMoves(p, trajectory);
    }
  }
  return king;
}
