import { checkThreats } from "./getAttackSets";
import { CellType, Color, King, MoveType, PieceType } from "../types";
import { getMoveSet } from "./getMoveSet";
import { checkPinPiece } from "./checkPinPiece";
import { BOARD } from "../utils/createBoard";

export function checkPieceFinalMoves(
  currentPiece: PieceType,
  pieces: PieceType[],
  playerColor: Color,
  board: CellType[][],
  king: King
): MoveType[] {
  const moveSet = getMoveSet(currentPiece, pieces, board);
  if (currentPiece.type === "king" && currentPiece.color === playerColor) {
    return defineKingMoveSet(currentPiece, pieces, playerColor, moveSet, board);
  }
  const pinMoves = checkPinPiece(currentPiece, king.cell.id, BOARD, pieces);
  if (pinMoves.length === 0) return moveSet;
  else return moveSet.filter((m) => pinMoves.includes(m.id));
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
