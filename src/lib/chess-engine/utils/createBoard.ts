import { CellType } from "../types";
import { rcToNot } from "./cellUtil";

export const BOARD = createBoard();

function createBoard(): CellType[][] {
  const board: CellType[][] = [];
  for (let i = 0; i < 8; i++) {
    const row: CellType[] = [];
    for (let j = 0; j < 8; j++) {
      const cell: CellType = {
        id: rcToNot(i, j),
        row: i,
        col: j,
      };
      row.push(cell);
    }
    board.push(row);
  }
  return board;
}
