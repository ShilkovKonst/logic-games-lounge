import { Cell, Color, Piece } from "../types";
import { getAllActiveMoveSets } from "../moveSets/getAllActiveMoveSets";

export const populateBoard: (player: Color, board: Cell[][]) => Piece[] = (
  player,
  board
) => {
  const pieces: Piece[] = [];
  for (let col = 0; col < 8; col++) {
    pieces.push(type(0, col, board));
    pieces.push(type(1, col, board));
    pieces.push(type(6, col, board));
    pieces.push(type(7, col, board));
  }
  getAllActiveMoveSets(player, pieces, board);
  return pieces;
};

const type: (row: number, col: number, board: Cell[][]) => Piece = (
  row,
  col,
  board
) => {
  const cell = board[row][col];
  const color = row === 0 ? "black" : "white";

  if (row === 0 || row === 7) {
    switch (col) {
      case 0:
        return {
          id: `rook${row}${col}`,
          cell: cell.id,
          color: color,
          isTaken: false,
          moveSet: [],
          type: "rook",
          hasMoved: false,
        };
      case 1:
        return {
          id: `knight${row}${col}`,
          cell: cell.id,
          color: color,
          isTaken: false,
          moveSet: [],
          type: "knight",
        };
      case 2:
        return {
          id: `bishop${row}${col}`,
          cell: cell.id,
          color: color,
          isTaken: false,
          moveSet: [],
          type: "bishop",
        };
      case 3:
        return {
          id: `queen${row}${col}`,
          cell: cell.id,
          color: color,
          isTaken: false,
          moveSet: [],
          type: "queen",
        };
      case 4:
        return {
          id: `king${row}${col}`,
          cell: cell.id,
          color: color,
          isTaken: false,
          moveSet: [],
          type: "king",
          hasMoved: false,
          isInDanger: false,
        };
      case 5:
        return {
          id: `bishop${row}${col}`,
          cell: cell.id,
          color: color,
          isTaken: false,
          moveSet: [],
          type: "bishop",
        };
      case 6:
        return {
          id: `knight${row}${col}`,
          cell: cell.id,
          color: color,
          isTaken: false,
          moveSet: [],
          type: "knight",
        };
      case 7:
        return {
          id: `rook${row}${col}`,
          cell: cell.id,
          color: color,
          isTaken: false,
          moveSet: [],
          type: "rook",
          hasMoved: false,
        };
      default:
        throw new Error(`Invalid column index: ${col}`);
    }
  } else
    return {
      id: `pawn${row}${col}`,
      cell: cell.id,
      color: row === 1 ? "black" : "white",
      isTaken: false,
      moveSet: [],
      type: "pawn",
      hasMoved: false,
      canBeTakenEnPassant: false,
    };
};
