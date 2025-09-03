import { CellType, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";
import { BOARD } from "../utils/createBoard";

export function getAttackTrajectory(
  kingCell: CellType,
  attacker: PieceType
): string[] {
  const trajectory: string[] = [attacker.cell.id];
  const attackerCell = getCell(attacker.cell.id);

  const dr = Math.sign(attackerCell.row - kingCell.row);
  const dc = Math.sign(attackerCell.col - kingCell.col);

  if (attacker.type === "knight" || attacker.type === "pawn") {
    return trajectory;
  }

  let r = kingCell.row + dr;
  let c = kingCell.col + dc;
  while (r !== attackerCell.row || c !== attackerCell.col) {
    trajectory.push(BOARD[r][c].id);
    r += dr;
    c += dc;
  }
  return trajectory;
}
