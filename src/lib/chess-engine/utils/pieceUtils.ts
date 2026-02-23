import { piecesSet } from "../constants/pieceTypes";
import { Color, King, MoveType, Pieces, PieceType } from "../types";

export function buildBoardMap(pieces: PieceType[]): Map<string, PieceType> {
  const map = new Map<string, PieceType>();
  for (const p of pieces) {
    if (!p.isTaken) map.set(p.cell.id, p);
  }
  return map;
}

export function getKing(pieces: PieceType[], currentPlayer: Color): King {
  const king = pieces.find(
    (p) => p.type === "king" && p.color === currentPlayer
  );
  if (!king || king.type !== "king") throw new Error("King must be in pieces!");
  return king;
}

export function getPiece(pieceId: string, pieces: PieceType[]): PieceType {
  const piece = pieces.find((p) => p.id === pieceId);
  if (!piece) throw new Error(`${pieceId} must be in pieces!`);
  return piece;
}

export const getPieceAt: (
  cellId: string,
  pieces: PieceType[]
) => PieceType | undefined = (cellId, pieces) =>
  pieces.find((p) => !p.isTaken && p.cell.id === cellId);

export function isPieces(value: string): value is Pieces {
  return piecesSet.has(value as Pieces);
}

export function getActivePieces(
  player: Color,
  pieces: PieceType[]
): PieceType[] {
  return pieces.filter((p) => !p.isTaken && p.color === player);
}

export function checkMoveSet(
  piece: PieceType | undefined,
  cell: string
): MoveType | undefined {
  if (piece) return piece.moveSet.find((m) => m.id === cell);
}
