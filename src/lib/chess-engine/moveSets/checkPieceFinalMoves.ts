import { checkThreats } from "./getAttackSets";
import { Cell, Color, King, Piece } from "../types";
import { getMoveSet } from "./getMoveSet";
import { getCell } from "../utils/cellUtil";

export function checkPieceFinalMoves(
  p: Piece,
  pieces: Piece[],
  playerColor: Color,
  board: Cell[][]
): string[] {
  const moveSet = getMoveSet(p, pieces, board);
  for (const move of moveSet) {
    const cell = getCell(board, move);
    const threats = checkThreats(p, move, pieces, playerColor, board);
    for (const threat of threats) {
      cell.threats.add(threat);
    }
  }
  if (p.type === "king" && p.color === playerColor) {
    const threats = checkThreats(p, p.cell, pieces, playerColor, board);
    p.isInDanger = threats.length > 0;
    const kingMoveSet = moveSet.filter((m) => !hasThreats(board, m));
    const castlingMoves = getCastlingMoves(p, pieces, board);
    return kingMoveSet.concat(castlingMoves);
  }
  if (p.type === "pawn" && moveSet[1]) {
    const cell = getCell(board, moveSet[1]);
    if (cell && !p.hasMoved && cell.threats.size === 0) {
      const threats = getCell(board, moveSet[0])?.threats;
      for (const t of threats) {
        const foe = pieces.find((f) => f.id === t);
        if (foe && foe.type === "pawn") cell.threats.add(t);
      }
    }
  }
  return moveSet;
}

function getCastlingMoves(
  king: King,
  pieces: Piece[],
  board: Cell[][]
): string[] {
  const cMoves: string[] = [];
  if (king.isInDanger) return cMoves;

  const kingCell = getCell(board, king.cell);
  const rooks = pieces.filter(
    (p) =>
      p.type === "rook" && p.color === king.color && !p.hasMoved && !p.isTaken
  );
  for (const r of rooks) {
    if (r.type !== "rook") continue;

    const rookCell = getCell(board, r.cell);
    const row = kingCell.row;
    const dir = rookCell.col > kingCell.col ? 1 : -1;
    let col = kingCell.col + dir;
    let blocked = false;
    while (col !== rookCell.col) {
      const cell = board[row][col];

      const threats = checkThreats(king, cell.id, pieces, king.color, board);
      if (isOcupied(pieces, cell) || threats.length > 0) {
        blocked = true;
        break;
      }
      col += dir;
    }

    if (blocked) continue;

    const cell = board[row][kingCell.col + dir * 2];
    cell["special"] = { type: "castling", rookId: r.id };
    cMoves.push(cell.id);
  }
  return cMoves;
}

function isOcupied(pieces: Piece[], cell: Cell): boolean {
  return pieces.some((p) => cell.id === p.cell);
}

function hasThreats(board: Cell[][], cellId: string): boolean {
  const cell = getCell(board, cellId);
  return cell.threats.size > 0;
}
