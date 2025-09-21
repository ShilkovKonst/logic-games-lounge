import { Color, ColorState, PieceType } from "../types";
import { getKing } from "../utils/pieceUtils";

export function definePlayerState(
  pieces: PieceType[],
  currentPlayer: Color
): ColorState {
  const king = getKing(pieces, currentPlayer);
  const piecesCanMove = pieces.some(
    (p) => p.color === currentPlayer && p.moveSet.length > 0
  );
  if (king.isInDanger && piecesCanMove)
    return { color: currentPlayer, status: { check: "CHECK", draw: "none" } };
  if (king.isInDanger && !piecesCanMove)
    return {
      color: currentPlayer,
      status: { check: "CHECKMATE", draw: "none" },
    };
  if (!king.isInDanger && !piecesCanMove)
    return {
      color: currentPlayer,
      status: { check: "NORMAL", draw: "stalemate" },
    };
  return { color: currentPlayer, status: { check: "NORMAL", draw: "none" } };
}
