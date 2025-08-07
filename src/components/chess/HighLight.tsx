/* eslint-disable react-hooks/exhaustive-deps */
import { ChessContext } from "@/context/chessContext";
import { Cell, Piece } from "@/lib/chess-engine/types";
import { useContext, useEffect, useState } from "react";

type HighLightProps = {
  row: number;
  col: number;
  move: Cell | undefined;
  piece?: Piece | undefined;
};

const HighLight: React.FC<HighLightProps> = ({ row, col, move, piece }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Piece must be used within ChessProvider");
  const { selectedPiece, moveSet, currentTurn } = context;

  const [isCastlingRook, setIsCastlingRook] = useState<boolean | undefined>(
    false
  );

  const isSelected =
    selectedPiece?.cell.row === row && selectedPiece.cell.col === col;
  const hasPieces = selectedPiece && piece;
  const canMove: boolean = selectedPiece?.color === currentTurn;
  const inMoveSet: boolean = !!move;
  const enPassantCell: Cell | undefined = moveSet.find(
    (m) =>
      m.row ===
        row +
          (piece?.type === "pawn" ? (piece?.color === "white" ? +1 : -1) : 0) &&
      m.col === col
  );
  const canBeTakenEnPassant: boolean | undefined =
    piece?.type === "pawn" && piece.canBeTakenEnPassant && !!enPassantCell;
  const isInDanger = !!move && move?.threats && move?.threats.length > 0;

  useEffect(() => {
    setIsCastlingRook(
      hasPieces &&
        isKingInitial(selectedPiece) &&
        isRookInitial(piece, selectedPiece) &&
        hasInMoves(moveSet, piece, selectedPiece)
    );
  }, [selectedPiece]);

  return (
    <>
      {(inMoveSet && canMove && !isInDanger && (
        <span className={`${styleGeneral} ${styleSafeMove}`} />
      )) ||
        (inMoveSet && canMove && isInDanger && (
          <span className={`${styleGeneral} ${styleDangerMove}`} />
        )) ||
        (inMoveSet && !canMove && (
          <span className={`${styleGeneral} ${styleNotMyMove}`} />
        ))}
      {(piece && canMove && (inMoveSet || canBeTakenEnPassant) && (
        <span className={`absolute ${styleCanTakeSquare}`} />
      )) ||
        (isCastlingRook && (
          <span className={`absolute ${styleCastlingSquare}`} />
        ))}
      {isSelected &&
        (canMove ? (
          <span className={`absolute ${styleActiveSelectedSquare}`} />
        ) : (
          <span className={`absolute ${stylePassiveSelectedSquare}`} />
        ))}
    </>
  );
};

export default HighLight;

function hasInMoves(moveSet: Cell[], piece: Piece, selected: Piece): boolean {
  return moveSet.some(
    (m) =>
      m.col ===
        piece.cell.col -
          (long(piece, selected)
            ? dir(piece, selected) * 2
            : dir(piece, selected)) && m.row === selected.cell.row
  );
}

function isKingInitial(selected: Piece): boolean {
  if (selected.type === "king") return !selected.hasMoved;
  return false;
}
function isRookInitial(piece: Piece, selected: Piece): boolean {
  if (piece.type === "rook")
    return !piece.hasMoved && piece.color === selected.color;
  return false;
}
function dir(piece: Piece, selected: Piece): number {
  return selected.cell.col > piece.cell.col ? -1 : 1;
}
function long(piece: Piece, selected: Piece): boolean {
  return Math.abs(selected.cell.col - piece.cell.col) === 4;
}

const styleGeneral = "absolute top-1 right-1 left-1 bottom-1 bg-radial";

const styleSafeMove = "from-teal-600 from-25% to-transparent to-35%";
const styleDangerMove = "from-red-600 from-25% to-transparent to-35%";
const styleNotMyMove = "from-gray-400 from-25% to-transparent to-35%";

const styleCastlingSquare =
  " top-0 right-0 left-0 bottom-0 inset-shadow-move-lightgreen";
const styleCanTakeSquare =
  " top-0 right-0 left-0 bottom-0 inset-shadow-move-orange";
const styleActiveSelectedSquare =
  " top-0 right-0 left-0 bottom-0 inset-shadow-move-lime";
const stylePassiveSelectedSquare =
  " top-0 right-0 left-0 bottom-0 inset-shadow-move-gray";
