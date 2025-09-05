import { colToNot, notToCol, notToRow, rowToNot } from "../constants/board";
import { CellType } from "../types";
import { BOARD } from "./createBoard";

export function cellToNotation(cell: CellType): string {
  return `${colToNot[cell.col]}${rowToNot[cell.row]}`;
}

export function notToRC(id: string): { row: number; col: number } {
  const col = notToCol[id[0]];
  const row = notToRow[id[1]];
  if (!inBounds(row, col))
    throw new Error(`Row ${row} and col ${col} for id "${id}" not valid `);
  return {
    row,
    col,
  };
}

export function rcToNot(row: number, col: number): string {
  return `${colToNot[col]}${rowToNot[row]}`;
}

export function getCell(cellId: string) {
  const cell = BOARD.flat().find((c) => c.id === cellId);
  if (!cell) throw new Error(`Cell with id "${cellId}" not found`);
  return cell;
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
