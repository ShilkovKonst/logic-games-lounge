import { Dispatch, SetStateAction } from "react";
import { Cell, Piece } from "../types";
import { defineDropzone } from "./defineDropzone";
import { HandleDragEndType } from "./types";
import { getCell } from "../utils/cellUtil";

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

    const currentPiece = pieces.find((p) => p.cell === piece.cell);

    if (currentPiece) {
      handleCapture(cell, currentPiece, pieces, currentPiece.moveSet, board);
      handleCastling(cell, currentPiece, pieces, currentPiece.moveSet, board);
      updateFlagsAndPosition(cell, currentPiece, pieces, board);
      handleExchange(row, currentPiece, setPieceToExchange, changeTurn);

      console.log(currentPiece);
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
  moveSet: Set<string>,
  board: Cell[][]
): void {
  let pieceToTake = pieces.find((p) => p.cell === cell.id);
  const takenCell: Cell = {
    id: `takenFrom${cell.id}`,
    row: -1,
    col: -1,
    threats: new Set(),
  };
  if (pieceToTake) {
    pieceToTake.isTaken = true;
    pieceToTake.cell = takenCell.id;
  } else if (!pieceToTake && currentPiece.type === "pawn") {
    let moveEnPassant = undefined;
    for (const move of moveSet) {
      if (move === cell.id) moveEnPassant = getCell(board, move);
    }
    if (moveEnPassant && moveEnPassant.special) {
      if (moveEnPassant.special.type === "enPassant") {
        const { pawnId } = moveEnPassant.special;
        pieceToTake = pieces.find((p) => p.id === pawnId);
        if (pieceToTake) {
          pieceToTake.isTaken = true;
          pieceToTake.cell = takenCell.id;
        }
      }
    }
  }
}

function handleCastling(
  cell: Cell,
  currentPiece: Piece,
  pieces: Piece[],
  moveSet: Set<string>,
  board: Cell[][]
): void {
  if (currentPiece.type !== "king" || currentPiece.hasMoved) return;

  const currentPieceCell = getCell(board, currentPiece.cell);
  if (!currentPieceCell) return;

  let moveCastling = undefined;
  for (const move of moveSet) {
    if (move === cell.id) moveCastling = getCell(board, move);
  }
  if (!moveCastling || moveCastling.special?.type !== "castling") return;

  const { rookId } = moveCastling.special;
  const rookToCastle = pieces.find((p) => p.id === rookId);
  if (rookToCastle && rookToCastle.type === "rook") {
    const dir = currentPieceCell.col > cell.col ? 1 : -1;
    const rookMove = board[cell.row][cell.col + dir];
    rookToCastle["cell"] = rookMove.id;
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
  pieces: Piece[],
  board: Cell[][]
): void {
  pieces.forEach((p) => {
    if (p.type === "pawn") p.canBeTakenEnPassant = false;
  });
  const currentPieceCell = getCell(board, currentPiece.cell);
  if (!currentPieceCell) return;

  const step = Math.abs(cell.row - currentPieceCell.row);
  currentPiece.cell = cell.id;

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
