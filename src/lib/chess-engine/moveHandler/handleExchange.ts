import { Dispatch, SetStateAction } from "react";
import { PieceType } from "../types";

export function handleExchange(
  targetRow: number,
  selectedPiece: PieceType,
  setIsExchange: Dispatch<SetStateAction<boolean>>,
  changeTurn: () => void
): void {
  if (
    selectedPiece.type !== "pawn" ||
    (selectedPiece.color === "white" && targetRow !== 0) ||
    (selectedPiece.color === "black" && targetRow !== 7)
  ) {
    changeTurn();
    return;
  }
  setIsExchange(true);
}
