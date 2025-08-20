import { Cell, Piece } from "../types";
import { getCell } from "../utils/cellUtil";

export function getAttackTrajectory(
  kingCell: Cell,
  attacker: Piece,
  board: Cell[][]
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
