import { CellType, PieceType } from "../types";
import { getCell } from "../utils/cellUtil";

export function getAttackTrajectory(
  kingCell: CellType,
  attacker: PieceType,
  board: CellType[][]
): string[] {
  const trajectory: string[] = [];
  const attackerCell = getCell(board, attacker.cell);

  const dr = Math.sign(attackerCell.row - kingCell.row);
  const dc = Math.sign(attackerCell.col - kingCell.col);

  trajectory.push(attacker.cell);

  if (attacker.type === "knight" || attacker.type === "pawn") {
    return trajectory;
  }

  let r = kingCell.row + dr,
    c = kingCell.col + dc;
  while (r !== attackerCell.row || c !== attackerCell.col) {
    trajectory.push(board[r][c].id);
    r += dr;
    c += dc;
  }
  return trajectory;
}
