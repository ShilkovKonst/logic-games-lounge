import { MoveType, PieceType } from "../types";

export function filterAllValidMoves(
  currentPiece: PieceType,
  attackTrajectory: string[]
): void {
  const validMoves: MoveType[] = [];
  for (const cell of attackTrajectory) {
    if (currentPiece.moveSet.some((m) => m.id === cell)) {
      validMoves.push({ id: cell, threats: new Set() });
    }
  }
  currentPiece.moveSet.length = 0;
  currentPiece.moveSet.push(...validMoves);
}
