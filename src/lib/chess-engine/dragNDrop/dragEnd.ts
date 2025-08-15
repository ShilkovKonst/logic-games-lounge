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
  board,
  setPieceToExchange,
  changeTurn,
  handleDragging,
  handleDragEnd
) => {
  clone.hidden = true;
  const dropzone = defineDropzone(e, clone);
  clone.hidden = false;

  if (dropzone) {
    const [row, col] = dropzone.id.split("-").map((i) => parseInt(i, 10));
    const cell = board[row][col];

    const currentPiece = pieces.find(
      (p) => p.cell.row === piece.cell.row && p.cell.col === piece.cell.col
    );
    if (currentPiece) {
      handleCapture(cell, currentPiece, pieces, currentPiece.moveSet);
      handleCastling(cell, currentPiece, pieces, currentPiece.moveSet, board);
      updateFlagsAndPosition(cell, currentPiece, pieces);
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
  cell: Cell,
  currentPiece: Piece,
  pieces: Piece[],
  moveSet: Cell[]
): void {
  let pieceToTake = pieces.find((p) => p.cell.id === cell.id);
  const takenCell: Cell = {
    id: `takenFrom${cell.id}`,
    row: -1,
    col: -1,
    threats: [],
  };
  if (pieceToTake) {
    pieceToTake.isTaken = true;
    pieceToTake["cell"] = takenCell;
  } else if (!pieceToTake && currentPiece.type === "pawn") {
    const moveEnPassant = moveSet.find((m) => m.id === cell.id);
    if (moveEnPassant && moveEnPassant.special) {
      if (moveEnPassant.special.type === "enPassant") {
        const { pawnId } = moveEnPassant.special;
        pieceToTake = pieces.find((p) => p.id === pawnId);
        if (pieceToTake) {
          pieceToTake.isTaken = true;
          pieceToTake["cell"] = takenCell;
        }
      }
    }
  }
}

function handleCastling(
  cell: Cell,
  currentPiece: Piece,
  pieces: Piece[],
  moveSet: Cell[],
  board: Cell[][]
): void {
  if (currentPiece.type !== "king" || currentPiece.hasMoved) return;

  const moveCastling = moveSet.find((m) => m.id === cell.id);
  if (!moveCastling || moveCastling.special?.type !== "castling") return;

  const { rookId } = moveCastling.special;
  const rookToCastle = pieces.find((p) => p.id === rookId);
  if (rookToCastle && rookToCastle.type === "rook") {
    const dir = currentPiece.cell.col > cell.col ? 1 : -1;
    const rookMove = board[cell.row][cell.col + dir];
    rookToCastle["cell"] = rookMove;
    rookToCastle["hasMoved"] = true;
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
  cell: Cell,
  currentPiece: Piece,
  pieces: Piece[]
): void {
  pieces.forEach((p) => {
    if (p.type === "pawn") p.canBeTakenEnPassant = false;
  });
  const step = Math.abs(cell.row - currentPiece.cell.row);
  currentPiece["cell"] = cell;

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
