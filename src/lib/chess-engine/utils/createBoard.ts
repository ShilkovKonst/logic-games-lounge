import { CellType } from "../types";
import { rcToNotation } from "./cellUtil";

export function createBoard(): CellType[][] {
  const board: CellType[][] = [];
  for (let i = 0; i < 8; i++) {
    const row: CellType[] = [];
    for (let j = 0; j < 8; j++) {
      const cell: CellType = {
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
