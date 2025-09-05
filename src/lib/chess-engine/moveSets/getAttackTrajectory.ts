import { PieceType } from "../types";
import { notToRC, rcToNot } from "../utils/cellUtil";

export function getAttackTrajectory(
  kingRC: { row: number; col: number },
  attacker: PieceType
): string[] {
  const trajectory: string[] = [attacker.cell.id];
  const attackerCell = notToRC(attacker.cell.id);

  const dr = Math.sign(attackerCell.row - kingRC.row);
  const dc = Math.sign(attackerCell.col - kingRC.col);

  if (attacker.type === "knight" || attacker.type === "pawn") {
    return trajectory;
  }

  let r = kingRC.row + dr;
  let c = kingRC.col + dc;
  while (r !== attackerCell.row || c !== attackerCell.col) {
    trajectory.push(rcToNot(r, c));
    r += dr;
    c += dc;
  }
  return trajectory;
}
