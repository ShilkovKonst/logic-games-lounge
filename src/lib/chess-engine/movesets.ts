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

const moveGenerator: (
  piece: Piece,
  pieces: Piece[],
  board: Cell[][],
  dirs: number[][],
  maxStep: number,
  evaluateThreats: boolean
) => Cell[] = (piece, pieces, board, dirs, maxStep, evaluateThreats) => {
  const r = piece.cell.row;
  const c = piece.cell.col;
  const moves: Cell[] = [];

  for (const [dr, dc] of dirs) {
    let tR = r + dr;
    let tC = c + dc;
    let step = 0;
    while (tR < 8 && tR >= 0 && tC < 8 && tC >= 0 && step < maxStep) {
      const cell = board[tR][tC];
      const target = getPieceAt(cell.id, pieces);

      if (target) {
        if (evaluateThreats && target.color === piece.color) moves.push(cell);
        if (target.color !== piece.color) moves.push(cell);
        break;
      }
      moves.push(cell);
      tR += dr;
      tC += dc;
      step++;
    }
  }
  return moves;
};

export const pawnMoves: (
  pawn: Pawn,
  pieces: Piece[],
  board: Cell[][]
) => Cell[] = (pawn, pieces, board) => {
  const moves: Cell[] = [];
  const col = pawn.cell.col;
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = pawn.cell.row + dir;

  if (nextRow < 0 || nextRow >= 8) return moves;

  const nextCell = board[nextRow][col];
  if (!pieces.some((p) => p.cell.id === nextCell.id)) moves.push(nextCell);

  const doubleRow = pawn.cell.row + dir * 2;
  if (!pawn.hasMoved && doubleRow >= 0 && doubleRow < 8) {
    const doubleCell = board[doubleRow][col];
    if (!pieces.some((p) => p.cell.id === doubleCell.id))
      moves.push(doubleCell);
  }

  const threats: Cell[] = pawnThreats(pawn, pieces, board, false);
  return moves.concat(threats);
};

export const pawnThreats: (
  pawn: Pawn,
  pieces: Piece[],
  board: Cell[][],
  evaluateThreats: boolean
) => Cell[] = (pawn, pieces, board, evaluateThreats) => {
  const threats: Cell[] = [];

  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = pawn.cell.row + dir;
  const col = pawn.cell.col;
  for (const tCol of [col - 1, col + 1]) {
    if (tCol < 0 || tCol >= 8 || nextRow < 0 || nextRow >= 8) continue;

    const threatCell = board[nextRow][tCol];
    if (evaluateThreats) threats.push(threatCell);
    else {
      const target = getPieceAt(threatCell.id, pieces);
      if (target && target.color !== pawn.color) {
        threats.push(threatCell);
      } else if (!target) {
        checkEnPassantMoves(pawn, pieces, nextRow, tCol, threats, board);
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
  threats: Cell[],
  board: Cell[][]
) => {
  const targetCell = board[pawn.cell.row][tCol];
  const target = getPieceAt(targetCell.id, pieces);
  if (!target) return;
  if (target.type !== "pawn") return;

  if (target.color !== pawn.color && target.canBeTakenEnPassant) {
    const nextCell = board[nextRow][tCol];
    nextCell["special"] = { type: "enPassant", pawnId: target.id };
    threats.push(nextCell);
  }
};

export const rookMoves: (
  rook: Rook,
  pieces: Piece[],
  board: Cell[][],
  evaluateThreats: boolean
) => Cell[] = (rook, pieces, board, evaluateThreats) => {
  return moveGenerator(rook, pieces, board, rDir, 7, evaluateThreats);
};

export const knightMoves: (
  knight: Knight,
  pieces: Piece[],
  board: Cell[][],
  evaluateThreats: boolean
) => Cell[] = (knight, pieces, board, evaluateThreats) => {
  return moveGenerator(knight, pieces, board, kDir, 1, evaluateThreats);
};

export const bishopMoves: (
  bishop: Bishop,
  pieces: Piece[],
  board: Cell[][],
  evaluateThreats: boolean
) => Cell[] = (bishop, pieces, board, evaluateThreats) => {
  return moveGenerator(bishop, pieces, board, bDir, 7, evaluateThreats);
};

export const queenMoves: (
  queen: Queen,
  pieces: Piece[],
  board: Cell[][],
  evaluateThreats: boolean
) => Cell[] = (queen, pieces, board, evaluateThreats) => {
  return moveGenerator(queen, pieces, board, qDir, 7, evaluateThreats);
};

export const kingMoves: (
  king: King,
  pieces: Piece[],
  board: Cell[][],
  evaluateThreats: boolean
) => Cell[] = (king, pieces, board, evaluateThreats) => {
  const kingMoves = moveGenerator(
    king,
    pieces,
    board,
    qDir,
    1,
    evaluateThreats
  );
  if (!king.hasMoved && !evaluateThreats)
    kingMoves.push(...castlingMoves(king, pieces, board));
  return kingMoves;
};

const castlingMoves = (king: King, pieces: Piece[], board: Cell[][]) => {
  let threats = checkThreats(king.cell, pieces, king.color, board);
  if (threats.length > 0) return [];

  const cMoves: Cell[] = [];
  const rooks = pieces.filter(
    (p) => p.type === "rook" && p.color === king.color && !p.hasMoved
  );
  for (const r of rooks) {
    if (r.type !== "rook") continue;

    const row = king.cell.row;
    const dir = r.cell.col > king.cell.col ? 1 : -1;
    let col = king.cell.col + dir;
    let blocked = false;
    while (col !== r.cell.col) {
      const cell = board[row][col];

      threats = checkThreats(cell, pieces, king.color, board);
      if (isOcupied(pieces, row, col) || threats.length > 0) {
        blocked = true;
        break;
      }
      col += dir;
    }

    if (blocked) continue;

    const cell = board[row][king.cell.col + dir * 2];
    cell["special"] = { type: "castling", rookId: r.id };
    cMoves.push(cell);
  }
  return cMoves;
};

const isOcupied = (pieces: Piece[], row: number, col: number) =>
  pieces.some((p) => col === p.cell.col && p.cell.row === row);

const getPieceAt: (id: string, pieces: Piece[]) => Piece | undefined = (
  id,
  pieces
) => pieces.find((p) => !p.isTaken && p.cell.id === id);
