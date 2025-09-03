import { notToRow, rowToNot } from "../constants/board";
import { CellType } from "../types";
import { BOARD } from "./createBoard";

export function cellToNotation(cell: CellType): string {
  return `${rowToNot[cell.col]}${cell.row + 1}`;
}

export function notToRowCol(id: string): { row: number; col: number } {
  const col = notToRow[id.charAt(0)];
  const row = 8 - Number(id.charAt(1));
  if (!inBounds(row, col))
    throw new Error(`Row ${row} and col ${col} for id "${id}" not valid `);
  return {
    row,
    col,
  };
}

export function rcToNotation(row: number, col: number): string {
  return `${rowToNot[col]}${7 - row + 1}`;
}

export function getCell(cellId: string) {
  const cell = BOARD.flat().find((c) => c.id === cellId);
  if (!cell) throw new Error(`Cell with id "${cellId}" not found`);
  return cell;
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
