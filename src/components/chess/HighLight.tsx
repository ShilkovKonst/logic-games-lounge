/* eslint-disable react-hooks/exhaustive-deps */
import { useBoardState } from "@/context/BoardStateContext";
import { useGameState } from "@/context/GameStateContext";
import { usePlayerState } from "@/context/PlayerStateContext";
import { Cell, Piece } from "@/lib/chess-engine/types";
import { getCell } from "@/lib/chess-engine/utils/cellUtil";
import { useEffect, useState } from "react";

type HighLightProps = {
  cell: Cell;
  piece?: Piece | undefined;
};

const HighLight: React.FC<HighLightProps> = ({ cell, piece }) => {
  const { board } = useBoardState();
  const { playerState } = usePlayerState();
  const { currentTurn, selectedPiece } = useGameState();

  const [isCastlingRook, setIsCastlingRook] = useState<boolean | undefined>(
    false
  );

  const canMove =
    selectedPiece?.color === currentTurn && currentTurn === playerState.color;
  const isSelected = selectedPiece && selectedPiece?.id === piece?.id;
  const hasPieces = !!selectedPiece && !!piece;
  const inMoveSet = selectedPiece?.moveSet.has(cell.id);
  const canBeTakenEnPassant: boolean | undefined =
    piece?.type === "pawn" &&
    piece.canBeTakenEnPassant &&
    piece.color !== currentTurn;
  const isInDanger = inMoveSet && cell.threats.size > 0;

  useEffect(() => {
    setIsCastlingRook(
      hasPieces &&
        isKingInitial(selectedPiece) &&
        isRookInitial(piece, selectedPiece) &&
        hasInMoves(selectedPiece, piece, board)
    );
    if (piece && piece.type === "rook" && hasPieces) {
      console.log("isKingInitial", isKingInitial(selectedPiece));
      console.log("isRookInitial", isRookInitial(piece, selectedPiece));
      console.log("hasInMoves", hasInMoves(selectedPiece, piece, board));
    }
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

function hasInMoves(selected: Piece, piece: Piece, board: Cell[][]): boolean {
  const selectedPieceCell = getCell(board, selected.cell);
  if (!selectedPieceCell) return false;

  const d = dir(piece, selected, board);
  const col = long(piece, selected, board) ? selectedPieceCell.col + d * 2 : selectedPieceCell.col + d;
  const cell = board[selectedPieceCell.row][col];
  return selected.moveSet.has(cell?.id);
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

function dir(piece: Piece, selected: Piece, board: Cell[][]): number {
  const selectedPieceCell = getCell(board, selected.cell);
  const pieceCell = getCell(board, piece.cell);
  if (!selectedPieceCell || !pieceCell) return 0;

  return selectedPieceCell.col > pieceCell.col ? -1 : 1;
}

function long(piece: Piece, selected: Piece, board: Cell[][]): boolean {
  const selectedPieceCell = getCell(board, selected.cell);
  const pieceCell = getCell(board, piece.cell);
  if (!selectedPieceCell || !pieceCell) return false;

  return Math.abs(selectedPieceCell.col - pieceCell.col) === 4;
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
