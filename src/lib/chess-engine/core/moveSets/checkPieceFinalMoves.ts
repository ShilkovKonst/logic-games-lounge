import { checkThreats } from "./getAttackSets";
import { Color, King, MoveType, PieceType } from "../types";
import { getMoveSet } from "./getMoveSet";
import { checkPinPiece } from "./checkPinPiece";

export function checkPieceFinalMoves(
  currentPiece: PieceType,
  playerColor: Color,
  king: King,
  boardMap: Map<string, PieceType>
): MoveType[] {
  const moveSet = getMoveSet(currentPiece, boardMap);
  if (currentPiece.type === "king" && currentPiece.color === playerColor) {
    return defineKingMoveSet(currentPiece, playerColor, moveSet, boardMap);
  }
  const pinMoves = checkPinPiece(currentPiece, king.cell.id, boardMap);
  if (pinMoves.length === 0) return moveSet;
  else return moveSet.filter((m) => pinMoves.includes(m.id));
}

function defineKingMoveSet(
  currentPiece: PieceType,
  playerColor: Color,
  moveSet: MoveType[],
  boardMap: Map<string, PieceType>
): MoveType[] {
  for (const move of moveSet) {
    const threats = checkThreats(currentPiece, move.id, playerColor, boardMap);
    for (const threat of threats) move.threats.add(threat);
  }
  return moveSet.filter((m) => m.threats.size === 0);
}
