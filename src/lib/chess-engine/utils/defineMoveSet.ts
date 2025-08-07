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

export function defineMoveSet(foe: Piece, piecesState: Piece[], checkThreats: boolean): Cell[] {
  switch (foe.type) {
    case "pawn":
      return checkThreats ? pawnThreats(foe, piecesState, true) : pawnMoves(foe, piecesState);
    case "rook":
      return rookMoves(foe, piecesState, checkThreats);
    case "knight":
      return knightMoves(foe, piecesState, checkThreats);
    case "bishop":
      return bishopMoves(foe, piecesState, checkThreats);
    case "queen":
      return queenMoves(foe, piecesState, checkThreats);
    case "king":
      return kingMoves(foe, piecesState, checkThreats);
  }
}
