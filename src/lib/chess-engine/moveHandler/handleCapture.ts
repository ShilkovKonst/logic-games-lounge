import { ActionDispatch } from "react";
import { MoveType, PieceType } from "../types";
import { GameAction } from "@/lib/chess-engine/reducer/chessReducer";

export function handleCapture(
  moveTo: MoveType,
  selectedPiece: PieceType,
  pieces: PieceType[],
  dispatch: ActionDispatch<[action: GameAction]>
): void {
  let pieceToTake = pieces.find((p) => p.cell.id === moveTo.id);
  if (pieceToTake && pieceToTake.id !== selectedPiece.id) {
    pieceToTake.isTaken = true;
    pieceToTake.cell.id = `takenFrom${moveTo.id}`;
  } else if (!pieceToTake && selectedPiece.type === "pawn") {
    if (moveTo.special?.type !== "enPassant") return;

    const { pawnId } = moveTo.special;
    pieceToTake = pieces.find((p) => p.id === pawnId);
    if (pieceToTake) {
      pieceToTake.isTaken = true;
      pieceToTake.cell.id = `takenFrom${moveTo.id}`;
    }
  }
  dispatch({
    type: "PATCH_TURN",
    payload: {
      pieceToTake: pieceToTake
        ? `${pieceToTake?.type}${pieceToTake?.id}`
        : undefined,
    },
  });
}
