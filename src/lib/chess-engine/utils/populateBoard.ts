import { Piece } from "../types";

export const populateBoard: () => Piece[] = () => {
  const pieces: Piece[] = [];
  for (let col = 0; col < 8; col++) {
    pieces.push(type(0, col));
    pieces.push(type(1, col));
    pieces.push(type(6, col));
    pieces.push(type(7, col));
  }
  return pieces;
};

const type: (row: number, col: number) => Piece = (row, col) => {
  if (row === 0 || row === 7)
    switch (col) {
      case 0:
        return {
          id: `rook${row}${col}`,
          cell: { col: col, row: row, threats: [] },
          color: row === 0 ? "black" : "white",
          isTaken: false,
          type: "rook",
          hasMoved: false,
        };
      case 1:
        return {
          id: `knight${row}${col}`,
          cell: { col: col, row: row, threats: [] },
          color: row === 0 ? "black" : "white",
          isTaken: false,
          type: "knight",
        };
      case 2:
        return {
          id: `bishop${row}${col}`,
          cell: { col: col, row: row, threats: [] },
          color: row === 0 ? "black" : "white",
          isTaken: false,
          type: "bishop",
        };
      case 3:
        return {
          id: `queen${row}${col}`,
          cell: { col: col, row: row, threats: [] },
          color: row === 0 ? "black" : "white",
          isTaken: false,
          type: "queen",
        };
      case 4:
        return {
          id: `king${row}${col}`,
          cell: { col: col, row: row, threats: [] },
          color: row === 0 ? "black" : "white",
          isTaken: false,
          type: "king",
          hasMoved: false,
          isInDanger: false,
        };
      case 5:
        return {
          id: `bishop${row}${col}`,
          cell: { col: col, row: row, threats: [] },
          color: row === 0 ? "black" : "white",
          isTaken: false,
          type: "bishop",
        };
      case 6:
        return {
          id: `knight${row}${col}`,
          cell: { col: col, row: row, threats: [] },
          color: row === 0 ? "black" : "white",
          isTaken: false,
          type: "knight",
        };
      case 7:
        return {
          id: `rook${row}${col}`,
          cell: { col: col, row: row, threats: [] },
          color: row === 0 ? "black" : "white",
          isTaken: false,
          type: "rook",
          hasMoved: false,
        };
      default:
        throw new Error(`Invalid column index: ${col}`);
    }
  else
    return {
      id: `pawn${row}${col}`,
      cell: { col: col, row: row, threats: [] },
      color: row === 1 ? "black" : "white",
      isTaken: false,
      type: "pawn",
      hasMoved: false,
      canBeTakenEnPassant: false,
    };
};
