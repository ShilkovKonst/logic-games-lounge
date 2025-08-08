import {
  bishopMoves,
  kingMoves,
  knightMoves,
  pawnMoves,
  pawnThreats,
  queenMoves,
  rookMoves,
} from "../movesets";
import { Cell, Piece } from "../types";

export function getMoveSet(
  piece: Piece,
  piecesState: Piece[],
  board: Cell[][],
  checkThreats: boolean,
): Cell[] {
  switch (piece.type) {
    case "pawn":
      return checkThreats
        ? pawnThreats(piece, piecesState, board, true)
        : pawnMoves(piece, piecesState, board);
    case "rook":
      return rookMoves(piece, piecesState, board, checkThreats);
    case "knight":
      return knightMoves(piece, piecesState, board, checkThreats);
    case "bishop":
      return bishopMoves(piece, piecesState, board, checkThreats);
    case "queen":
      return queenMoves(piece, piecesState, board, checkThreats);
    case "king":
      return kingMoves(piece, piecesState, board, checkThreats);
  }
}
