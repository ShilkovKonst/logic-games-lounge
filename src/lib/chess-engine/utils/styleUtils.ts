import { PieceType } from "../types";

export type CellHighlightType = {
  isSelected?: boolean;
  isMove?: boolean;
  isDanger?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
};
export function computeHighlights(
  selectedPiece: PieceType | undefined
): Record<string, CellHighlightType> {
  if (!selectedPiece) return {};

  const result: Record<string, CellHighlightType> = {};

  for (const move of selectedPiece.moveSet) {
    result[move.id] = {
      isMove: true,
      isDanger: move.threats.size > 0,
      isCastling: move.special?.type === "castling",
      isEnPassant: move.special?.type === "enPassant",
    };
  }
  result[selectedPiece.cell.id] = {
    isSelected: true,
    isDanger: selectedPiece.cell.threats.size > 0,
  };

  return result;
}
