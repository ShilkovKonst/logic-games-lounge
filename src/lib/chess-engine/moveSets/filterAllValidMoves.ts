import { PieceType } from "../types";

export function filterAllValidMoves(
  currentPiece: PieceType,
  attackTrajectory: string[]
): void {
  const validMoves = [];
  for (const cell of attackTrajectory) {
    if (currentPiece.moveSet.includes(cell)) {
      validMoves.push(cell);
    }
  }
  currentPiece.moveSet.length = 0;
  currentPiece.moveSet.push(...validMoves);
}
