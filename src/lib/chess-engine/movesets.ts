import { Cell, Piece } from "./types";

const rDir: number[][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const kDir: number[][] = [
  [1, 2],
  [-1, 2],
  [2, 1],
  [-2, 1],
  [1, -2],
  [-1, -2],
  [2, -1],
  [-2, -1],
];
const bDir: number[][] = [
  [1, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
];
const qDir: number[][] = [...rDir, ...bDir];

const moveGenerator: (
  piece: Piece,
  pieces: Piece[],
  dirs: number[][],
  maxStep: number
) => Cell[] = (piece, pieces, dirs, maxStep) => {
  const r = piece.cell.row;
  const c = piece.cell.col;
  const moves: Cell[] = [];

  for (const [dr, dc] of dirs) {
    let tR = r + dr;
    let tC = c + dc;
    let step = 0;
    while (tR < 8 && tR >= 0 && tC < 8 && tC >= 0 && step < maxStep) {
      const target = getPieceAt(tR, tC, pieces);
      if (target) {
        console.log("target from move sets", target);
        if (target.color !== piece.color) moves.push({ row: tR, col: tC });
        break;
      }
      moves.push({ row: tR, col: tC });
      tR += dr;
      tC += dc;
      step++;
    }
  }

  return moves;
};

const getPieceAt: (
  row: number,
  col: number,
  pieces: Piece[]
) => Piece | undefined = (row, col, pieces) =>
  pieces.find((p) => p.cell.row === row && p.cell.col === col);

export const pawnMoves: (piece: Piece, pieces: Piece[]) => Cell[] = (
  piece,
  pieces
) => {
  const inc = piece.color === "white" ? -1 : 1;
  const moves: Cell[] = [];

  const nextRow = piece.cell.row + inc;
  const doubleRow = piece.cell.row + inc * 2;
  const col = piece.cell.col;

  if (
    nextRow >= 0 &&
    nextRow < 8 &&
    !pieces.some((p) => p.cell.row === nextRow && p.cell.col === col)
  ) {
    moves.push({ row: nextRow, col: col });
    if (
      !piece.hasMoved &&
      !pieces.some((p) => p.cell.row === doubleRow && p.cell.col === col)
    )
      moves.push({ row: doubleRow, col: col });
  }

  [col - 1, col + 1].forEach((tCol) => {
    if (tCol >= 0 && tCol < 8 && nextRow >= 0 && nextRow < 8) {
      const target = getPieceAt(nextRow, tCol, pieces);
      if (target && target.color !== piece.color) {
        moves.push({ row: nextRow, col: tCol });
      }
    }
  });

  return moves;
};

export const rookMoves: (piece: Piece, pieces: Piece[]) => Cell[] = (
  piece,
  pieces
) => {
  return moveGenerator(piece, pieces, rDir, 7);
};

export const knightMoves: (piece: Piece, pieces: Piece[]) => Cell[] = (
  piece,
  pieces
) => {
  return moveGenerator(piece, pieces, kDir, 1);
};

export const bishopMoves: (piece: Piece, pieces: Piece[]) => Cell[] = (
  piece,
  pieces
) => {
  return moveGenerator(piece, pieces, bDir, 7);
};

export const queenMoves: (piece: Piece, pieces: Piece[]) => Cell[] = (
  piece,
  pieces
) => {
  return moveGenerator(piece, pieces, qDir, 7);
};

export const kingMoves: (piece: Piece, pieces: Piece[]) => Cell[] = (
  piece,
  pieces
) => {
  return moveGenerator(piece, pieces, qDir, 1);
};
