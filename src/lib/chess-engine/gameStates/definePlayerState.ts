import { Color, ColorState, PieceType } from "../types";
import { getKing } from "../utils/pieceUtils";

export function defineColorState(
  pieces: PieceType[],
  currentPlayer: Color
): ColorState {
  const king = getKing(pieces, currentPlayer);
  const piecesCanMove = pieces.some(
    (p) => p.color === currentPlayer && p.moveSet.length > 0
  );
  if (king.isInDanger && piecesCanMove)
    return { color: currentPlayer, status: "CHECK" };
  if (king.isInDanger && !piecesCanMove)
    return { color: currentPlayer, status: "CHECKMATE" };
  if (!king.isInDanger && !piecesCanMove)
    return { color: currentPlayer, status: "STALEMATE" };
  return { color: currentPlayer, status: "NORMAL" };
}
