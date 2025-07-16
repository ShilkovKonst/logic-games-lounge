import { notToRow, rowToNot } from "../constants/board";
import { Cell } from "../types";

export const cellToNotation: (cell: Cell) => string = (cell) => {
  return `${rowToNot[cell.col]}${cell.row + 1}`;
};

export const notationToCell: (notation: string) => Cell = (notation) => {
  return {
    col: notToRow[notation.charAt(0)],
    row: Number(notation.charAt(1)) - 1,
  };
};
