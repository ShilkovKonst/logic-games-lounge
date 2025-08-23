import { rowToNot } from "../constants/board";
import { CellType } from "../types";

export function cellToNotation(cell: CellType): string {
  return `${rowToNot[cell.col]}${cell.row + 1}`;
}

export function rcToNotation(row: number, col: number): string {
  return `${rowToNot[col]}${7 - row + 1}`;
}

export function getCell(board: CellType[][], cellId: string) {
  const cell = board.flat().find((c) => c.id === cellId);
  if (!cell) throw new Error(`Cell with id "${cellId}" not found`);
  return cell;
}
