import { rcToNot } from "./cellUtil";

export const BOARD = createBoard();

function createBoard(): string[][] {
  const board: string[][] = [];
  for (let i = 0; i < 8; i++) {
    const row: string[] = [];
    for (let j = 0; j < 8; j++) {
      row[j] = rcToNot(i, j);
    }
    board[i] = row;
  }
  return board;
}
