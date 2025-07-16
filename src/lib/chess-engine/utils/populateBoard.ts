import { Piece } from "../types";

export const populateBoard: () => Piece[] = () => {
  const pieces: Piece[] = [];
  const type: Piece["type"][] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  for (let col = 0; col < 8; col++) {
    pieces.push({
      cell: { col: col, row: 0 },
      type: type[col],
      color: "black",
    });
    pieces.push({
      cell: { col: col, row: 1 },
      type: "pawn",
      color: "black",
    });
    pieces.push({
      cell: { col: col, row: 6 },
      type: "pawn",
      color: "white",
    });

    pieces.push({
      cell: { col: col, row: 7 },
      type: type[col],
      color: "white",
    });
  }
  return pieces;
};
