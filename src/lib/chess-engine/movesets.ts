import { Bishop, Cell, King, Knight, Pawn, Piece, Queen, Rook } from "./types";
import { checkThreats } from "./utils/checkThreats";

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

const getPieceAt: (
  row: number,
  col: number,
  pieces: Piece[]
) => Piece | undefined = (row, col, pieces) =>
  pieces.find((p) => p.cell.row === row && p.cell.col === col);

const moveGenerator: (
  piece: Piece,
  pieces: Piece[],
  dirs: number[][],
  maxStep: number,
  evaluateThreats: boolean
) => Cell[] = (piece, pieces, dirs, maxStep, evaluateThreats) => {
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
        if (evaluateThreats && target.color === piece.color)
          moves.push({ row: tR, col: tC, threats: [] });
        if (target.color !== piece.color)
          moves.push({ row: tR, col: tC, threats: [] });
        break;
      }
      moves.push({ row: tR, col: tC, threats: [] });
      tR += dr;
      tC += dc;
      step++;
    }
  }
  return moves;
};

export const pawnMoves: (pawn: Pawn, pieces: Piece[]) => Cell[] = (
  pawn,
  pieces
) => {
  const moves: Cell[] = [];

  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = pawn.cell.row + dir;
  const doubleRow = pawn.cell.row + dir * 2;
  const col = pawn.cell.col;

  if (
    nextRow >= 0 &&
    nextRow < 8 &&
    !pieces.some((p) => p.cell.row === nextRow && p.cell.col === col)
  ) {
    moves.push({ row: nextRow, col: col, threats: [] });
    if (
      !pawn.hasMoved &&
      !pieces.some((p) => p.cell.row === doubleRow && p.cell.col === col)
    )
      moves.push({ row: doubleRow, col: col, threats: [] });
  }
  const threats: Cell[] = pawnThreats(pawn, pieces, false);
  return moves.concat(threats);
};

export const pawnThreats: (
  pawn: Pawn,
  pieces: Piece[],
  evaluateThreats: boolean
) => Cell[] = (pawn, pieces, evaluateThreats) => {
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = pawn.cell.row + dir;
  const col = pawn.cell.col;
  const threats: Cell[] = [];
  for (const tCol of [col - 1, col + 1]) {
    if (tCol >= 0 && tCol < 8 && nextRow >= 0 && nextRow < 8) {
      if (evaluateThreats) {
        threats.push({ row: nextRow, col: tCol, threats: [] });
      } else {
        const target = getPieceAt(nextRow, tCol, pieces);
        if (target && target.color !== pawn.color) {
          threats.push({ row: nextRow, col: tCol, threats: [] });
        } else if (!target) {
          checkEnPassantMoves(pawn, pieces, nextRow, tCol, threats);
        }
      }
    }
  }
  return threats;
};

const checkEnPassantMoves = (
  pawn: Pawn,
  pieces: Piece[],
  nextRow: number,
  tCol: number,
  threats: Cell[]
) => {
  const target = getPieceAt(pawn.cell.row, tCol, pieces);
  switch (target?.type) {
    case "pawn":
      if (target && target.color !== pawn.color && target.canBeTakenEnPassant)
        threats.push({
          row: nextRow,
          col: tCol,
          threats: [],
          special: { type: "enPassant", pawnId: target.id },
        });
      break;
    default:
      break;
  }
};

export const rookMoves: (
  rook: Rook,
  pieces: Piece[],
  evaluateThreats: boolean
) => Cell[] = (rook, pieces, evaluateThreats) => {
  return moveGenerator(rook, pieces, rDir, 7, evaluateThreats);
};

export const knightMoves: (
  knight: Knight,
  pieces: Piece[],
  evaluateThreats: boolean
) => Cell[] = (knight, pieces, evaluateThreats) => {
  return moveGenerator(knight, pieces, kDir, 1, evaluateThreats);
};

export const bishopMoves: (
  bishop: Bishop,
  pieces: Piece[],
  evaluateThreats: boolean
) => Cell[] = (bishop, pieces, evaluateThreats) => {
  return moveGenerator(bishop, pieces, bDir, 7, evaluateThreats);
};

export const queenMoves: (
  queen: Queen,
  pieces: Piece[],
  evaluateThreats: boolean
) => Cell[] = (queen, pieces, evaluateThreats) => {
  return moveGenerator(queen, pieces, qDir, 7, evaluateThreats);
};

export const kingMoves: (
  king: King,
  pieces: Piece[],
  evaluateThreats: boolean
) => Cell[] = (king, pieces, evaluateThreats) => {
  const kingMoves = moveGenerator(king, pieces, qDir, 1, evaluateThreats);
  if (!king.hasMoved && !evaluateThreats)
    kingMoves.push(...castlingMoves(king, pieces));
  return kingMoves;
};

const castlingMoves = (king: King, pieces: Piece[]) => {
  let threats = checkThreats(king.cell, pieces, king.color);
  if (threats.length > 0) return [];

  const cMoves: Cell[] = [];
  const rooks = pieces.filter(
    (p) => p.type === "rook" && p.color === king.color && !p.hasMoved
  );
  for (const r of rooks) {
    if (r.type !== "rook") continue;
    const dir = r.cell.col > king.cell.col ? 1 : -1;
    let blocked = false;
    let col = king.cell.col + dir;
    const row = king.cell.row;
    while (col !== r.cell.col) {
      const cell = { row: row, col: col, threats: [] };
      threats = checkThreats(cell, pieces, king.color);
      if (isOcupied(pieces, king.cell.row, col) || threats.length > 0) {
        blocked = true;
        break;
      }
      col += dir;
    }
    if (!blocked)
      cMoves.push({
        row: king.cell.row,
        col: king.cell.col + dir * 2,
        threats: [],
        special: { type: "castling", rookId: r.id },
      });
  }
  return cMoves;
};

const isOcupied = (pieces: Piece[], row: number, col: number) =>
  pieces.some((p) => col === p.cell.col && p.cell.row === row);
