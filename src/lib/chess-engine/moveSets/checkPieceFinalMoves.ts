import { checkThreats } from "./getAttackSets";
import { Color, King, MoveType, PieceType } from "../types";
import { getMoveSet } from "./getMoveSet";
import { checkPinPiece } from "./checkPinPiece";

export function checkPieceFinalMoves(
  currentPiece: PieceType,
  pieces: PieceType[],
  playerColor: Color,
  king: King
): MoveType[] {
  const moveSet = getMoveSet(currentPiece, pieces);
  if (currentPiece.type === "king" && currentPiece.color === playerColor) {
    return defineKingMoveSet(currentPiece, pieces, playerColor, moveSet);
  }
  const pinMoves = checkPinPiece(currentPiece, king.cell.id, pieces);
  if (pinMoves.length === 0) return moveSet;
  else return moveSet.filter((m) => pinMoves.includes(m.id));
}

function defineKingMoveSet(
  currentPiece: PieceType,
  pieces: PieceType[],
  playerColor: Color,
  moveSet: MoveType[]
): MoveType[] {
  for (const move of moveSet) {
    const threats = checkThreats(currentPiece, move.id, pieces, playerColor);
    for (const threat of threats) move.threats.add(threat);
  }
  return moveSet.filter((m) => m.threats.size === 0);
}
