import { PieceColor, PieceType } from "../types";

export type Pieces = {
  [K in PieceType]: {
    [C in PieceColor]: string;
  };
};

export const pieces: Pieces = {
  king: {
    white: "♔",
    black: "♚",
  },
  queen: {
    white: "♕",
    black: "♛",
  },
  rook: {
    white: "♖",
    black: "♜",
  },
  bishop: {
    white: "♗",
    black: "♝",
  },
  knight: {
    white: "♘",
    black: "♞",
  },
  pawn: {
    white: "♙",
    black: "♟",
  },
  none: {
    white: "",
    black: "",
  },
};
