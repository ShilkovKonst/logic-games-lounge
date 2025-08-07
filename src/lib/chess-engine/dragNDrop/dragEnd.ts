import { Dispatch, SetStateAction } from "react";
import { Cell, Piece } from "../types";
import { defineDropzone } from "./defineDropzone";
import { HandleDragEndType } from "./types";

export const dragEnd: HandleDragEndType = (
  e,
  target,
  clone,
  pieces,
  piece,
  moveSet,
  setPieceToExchange,
  changeTurn,
  handleDragging,
  handleDragEnd
) => {
  clone.hidden = true;
  const dropzone = defineDropzone(e, clone);

  if (dropzone) {
    const [row, col] = dropzone.id.split("-").map((i) => parseInt(i, 10));
    const currentPiece = pieces.find(
      (p) => p.cell.row === piece.cell.row && p.cell.col === piece.cell.col
    );
    if (currentPiece) {
      handleCapture(row, col, currentPiece, pieces, moveSet);
      handleCastling(row, col, currentPiece, pieces, moveSet);
      updateFlagsAndPosition(row, col, currentPiece, pieces);
      handleExchange(row, currentPiece, setPieceToExchange, changeTurn);
    }
  }

  if (e.type === "mouseup") {
    target.style.opacity = "100%";
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", handleDragEnd);
  }
  if (e.type === "touchend") {
    target.style.opacity = "100%";
    document.removeEventListener("touchmove", handleDragging);
    document.removeEventListener("touchend", handleDragEnd);
  }
  clone.remove();
};

function handleCapture(
  targetRow: number,
  targetCol: number,
  currentPiece: Piece,
  pieces: Piece[],
  moveSet: Cell[]
): void {
  let pieceToTake = pieces.find(
    (p) => p.cell.row === targetRow && p.cell.col === targetCol
  );
  if (pieceToTake) {
    pieceToTake.isTaken = true;
    pieceToTake.cell.row = -1;
    pieceToTake.cell.col = -1;
  } else if (!pieceToTake && currentPiece.type === "pawn") {
    const moveEnPassant = moveSet.find(
      (m) => m.col === targetCol && m.row === targetRow
    );
    if (moveEnPassant && moveEnPassant.special) {
      if (moveEnPassant.special.type === "enPassant") {
        const { pawnId } = moveEnPassant.special;
        pieceToTake = pieces.find((p) => p.id === pawnId);
        if (pieceToTake) {
          pieceToTake.isTaken = true;
          pieceToTake.cell.row = -1;
          pieceToTake.cell.col = -1;
        }
      }
    }
  }
}

function handleCastling(
  targetRow: number,
  targetCol: number,
  currentPiece: Piece,
  pieces: Piece[],
  moveSet: Cell[]
): void {
  if (currentPiece.type !== "king" || currentPiece.hasMoved) return;

  const dir = currentPiece.cell.col > targetCol ? 1 : -1;
  const moveCastling = moveSet.find(
    (m) => m.col === targetCol && m.row === targetRow
  );
  if (moveCastling && moveCastling.special)
    if (moveCastling.special.type === "castling") {
      const { rookId } = moveCastling.special;
      const rookToCastle = pieces.find((p) => p.id === rookId);
      if (rookToCastle && rookToCastle.type === "rook") {
        rookToCastle.cell.col = targetCol + dir;
        rookToCastle.cell.row = targetRow;
        rookToCastle.hasMoved = true;
      }
    }
}

function handleExchange(
  targetRow: number,
  currentPiece: Piece,
  setPieceToExchange: Dispatch<SetStateAction<Piece | undefined>>,
  changeTurn: () => void
): void {
  if (
    currentPiece.type !== "pawn" ||
    (currentPiece.color === "white" && targetRow !== 0) ||
    (currentPiece.color === "black" && targetRow !== 7)
  ) {
    changeTurn();
    return;
  }

  setPieceToExchange(currentPiece);
}

function updateFlagsAndPosition(
  targetRow: number,
  targetCol: number,
  currentPiece: Piece,
  pieces: Piece[]
): void {
  pieces.forEach((p) => {
    if (p.type === "pawn") p.canBeTakenEnPassant = false;
  });
  const step = Math.abs(targetRow - currentPiece.cell.row);

  currentPiece.cell.row = targetRow;
  currentPiece.cell.col = targetCol;

  if (
    (currentPiece.type === "pawn" ||
      currentPiece.type === "rook" ||
      currentPiece.type === "king") &&
    !currentPiece.hasMoved
  ) {
    currentPiece.hasMoved = true;
  }

  if (currentPiece.type === "pawn") {
    if (step === 2) {
      currentPiece.canBeTakenEnPassant = true;
    }
  }
}
