import { Dispatch, SetStateAction } from "react";
import { Cell, Color, Piece } from "../types";
import { defineMoveSet } from "./defineMoveSet";
import { checkThreats } from "./checkThreats";

export const getMoveSet: (
  piece: Piece,
  pieces: Piece[],
  setMoveSet: Dispatch<SetStateAction<Cell[]>>,
  setSelectedPiece: Dispatch<SetStateAction<Piece | undefined>>,
  currentTurn: Color
) => Cell[] = (piece, pieces, setMoveSet, setSelectedPiece, currentTurn) => {
  setSelectedPiece(undefined);
  setMoveSet([]);
  let moveSet = defineMoveSet(piece, pieces, false);
  for (const move of moveSet) {
    move.threats = checkThreats(move, pieces, currentTurn);
  }
  if (piece.type === "king" && piece.color === currentTurn) {
    moveSet = moveSet.filter((m) => m.threats?.length === 0);
  }
  if (
    piece.type === "pawn" &&
    !piece.hasMoved &&
    moveSet[1]?.threats?.length === 0
  ) {
    moveSet[1]["threats"] = moveSet[0].threats;
  }
  setMoveSet(moveSet);
  setSelectedPiece(piece);

  console.log("selected piece", piece, "move set", moveSet);
  return moveSet;
};
