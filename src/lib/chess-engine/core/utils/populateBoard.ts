import { Color, PieceType } from "../types";
import { getAllActiveMoveSets } from "../moveSets/getAllActiveMoveSets";
import { rcToNot } from "./cellUtil";

export function populateBoard(player: Color): PieceType[] {
  const pieces: PieceType[] = [];
  for (let col = 0; col < 8; col++) {
    pieces.push(type(0, col));
    pieces.push(type(1, col));
    pieces.push(type(6, col));
    pieces.push(type(7, col));
  }
  getAllActiveMoveSets(player, pieces);
  return pieces;
}

function type(row: number, col: number): PieceType {
  const cell = rcToNot(row, col);
  const color = row === 0 ? "black" : "white";

  if (row === 0 || row === 7) {
    switch (col) {
      case 0:
        return {
          id: `${row}${col}`,
          cell: { id: cell, threats: new Set() },
          color: color,
          isTaken: false,
          moveSet: [],
          type: "rook",
          hasMoved: false,
        };
      case 1:
        return {
          id: `${row}${col}`,
          cell: { id: cell, threats: new Set() },
          color: color,
          isTaken: false,
          moveSet: [],
          type: "knight",
        };
      case 2:
        return {
          id: `${row}${col}`,
          cell: { id: cell, threats: new Set() },
          color: color,
          isTaken: false,
          moveSet: [],
          type: "bishop",
        };
      case 3:
        return {
          id: `${row}${col}`,
          cell: { id: cell, threats: new Set() },
          color: color,
          isTaken: false,
          moveSet: [],
          type: "queen",
        };
      case 4:
        return {
          id: `${row}${col}`,
          cell: { id: cell, threats: new Set() },
          color: color,
          isTaken: false,
          moveSet: [],
          type: "king",
          hasMoved: false,
          isInDanger: false,
        };
      case 5:
        return {
          id: `${row}${col}`,
          cell: { id: cell, threats: new Set() },
          color: color,
          isTaken: false,
          moveSet: [],
          type: "bishop",
        };
      case 6:
        return {
          id: `${row}${col}`,
          cell: { id: cell, threats: new Set() },
          color: color,
          isTaken: false,
          moveSet: [],
          type: "knight",
        };
      case 7:
        return {
          id: `${row}${col}`,
          cell: { id: cell, threats: new Set() },
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
      id: `${row}${col}`,
      cell: { id: cell, threats: new Set() },
      color: row === 1 ? "black" : "white",
      isTaken: false,
      moveSet: [],
      type: "pawn",
      hasMoved: false,
      canBeTakenEnPassant: false,
    };
}
