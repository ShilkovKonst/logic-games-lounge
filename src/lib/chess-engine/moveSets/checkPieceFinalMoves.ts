import { checkThreats } from "./getAttackSets";
import { CellType, Color, PieceType } from "../types";
import { getMoveSet } from "./getMoveSet";
import { getCell } from "../utils/cellUtil";

export function checkPieceFinalMoves(
  currentPiece: PieceType,
  pieces: PieceType[],
  playerColor: Color,
  board: CellType[][]
): string[] {
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
  moveSet: string[],
  board: CellType[][]
) {
  for (const move of moveSet) {
    const cell = getCell(board, move);
    const threats = checkThreats(
      currentPiece,
      move,
      pieces,
      playerColor,
      board
    );
    for (const threat of threats) cell.threats.add(threat);
  }
  return moveSet.filter((m) => !hasThreats(board, m));
}

function hasThreats(board: CellType[][], cellId: string): boolean {
  const cell = getCell(board, cellId);
  return cell.threats.size > 0;
}
