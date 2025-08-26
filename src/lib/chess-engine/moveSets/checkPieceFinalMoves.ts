import { checkThreats } from "./getAttackSets";
import { CellType, Color, MoveType, PieceType } from "../types";
import { getMoveSet } from "./getMoveSet";
import { getCell } from "../utils/cellUtil";

export function checkPieceFinalMoves(
  currentPiece: PieceType,
  pieces: PieceType[],
  playerColor: Color,
  board: CellType[][]
): MoveType[] {
  const moveSet = getMoveSet(currentPiece, pieces, board);
  if (currentPiece.type === "king" && currentPiece.color === playerColor) {
    return defineKingMoveSet(currentPiece, pieces, playerColor, moveSet, board);
  }
  return moveSet;
}

function defineKingMoveSet(
  currentPiece: PieceType,
  pieces: PieceType[],
  playerColor: Color,
  moveSet: MoveType[],
  board: CellType[][]
): MoveType[] {
  for (const move of moveSet) {
    const threats = checkThreats(
      currentPiece,
      move.id,
      pieces,
      playerColor,
      board
    );
    for (const threat of threats) move.threats.add(threat);
  }
  return moveSet.filter((m) => m.threats.size === 0);
}
