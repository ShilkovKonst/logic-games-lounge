import { Cell } from "../types";
import { rcToNotation } from "./cellUtil";

export function createBoard(): Cell[][] {
  const board: Cell[][] = [];
  for (let i = 0; i < 8; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < 8; j++) {
      const cell: Cell = {
        id: rcToNotation(i, j),
        row: i,
        col: j,
        threats: new Set<string>(),
      };
      row.push(cell);
    }
    board.push(row);
  }
  return board;
}
