import { notToRow, rowToNot } from "../constants/board";
import { Cell } from "../types";

export function cellToNotation(cell: Cell): string {
  return `${rowToNot[cell.col]}${cell.row + 1}`;
}

export function rcToNotation(row: number, col: number): string {
  return `${rowToNot[col]}${7 - row + 1}`;
}

export const notationToCell: (notation: string) => Cell = (notation) => {
  return {
    id: notation,
    col: notToRow[notation.charAt(0)],
    row: Number(notation.charAt(1)) - 1,
    threats: [],
  };
};
