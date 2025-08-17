import { rowToNot } from "../constants/board";
import { Cell } from "../types";

export function cellToNotation(cell: Cell): string {
  return `${rowToNot[cell.col]}${cell.row + 1}`;
}

export function rcToNotation(row: number, col: number): string {
  return `${rowToNot[col]}${7 - row + 1}`;
}

export function getCell(board: Cell[][], cellId: string) {
  const cell = board.flat().find((c) => c.id === cellId);
  if (!cell) throw new Error(`Cell with id "${cellId}" not found`);
  return cell;
}
