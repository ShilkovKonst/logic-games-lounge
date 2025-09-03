/* eslint-disable react-hooks/exhaustive-deps */
import { usePlayerState } from "@/context/PlayerStateContext";
import {
  CellType,
  GameState,
  GameType,
  PieceType,
} from "@/lib/chess-engine/types";
import { getCell } from "@/lib/chess-engine/utils/cellUtil";
import { BOARD } from "@/lib/chess-engine/utils/createBoard";
import { useEffect, useState } from "react";

type HighLightProps = {
  cell: CellType;
  piece?: PieceType | undefined;
  state: GameState;
  gameType: GameType;
};

const HighLight: React.FC<HighLightProps> = ({
  cell,
  piece,
  state,
  gameType,
}) => {
  const { playerState } = usePlayerState();

  const { selectedPiece, currentTurn } = state;

  const [isCastlingRook, setIsCastlingRook] = useState<boolean | undefined>(
    false
  );

  const canMove =
    selectedPiece?.color === currentTurn &&
    (gameType === "hotseat" || currentTurn === playerState.color);
  const isSelected = selectedPiece && selectedPiece?.id === piece?.id;
  const hasPieces = !!selectedPiece && !!piece;
  const inMoveSet = selectedPiece?.moveSet.some((m) => m.id === cell.id);
  const isInDanger =
    inMoveSet &&
    selectedPiece?.moveSet.find((m) => m.id === cell.id && m.threats.size > 0);

  const enPassantCell = () => {
    if (!selectedPiece || !piece) return undefined;
    for (const move of selectedPiece.moveSet) {
      const moveCell = getCell(move.id);
      const rowEnPassant =
        moveCell.row === cell.row + (piece?.color === "white" ? +1 : -1);
      const sameCol = moveCell.col === cell.col;
      if (rowEnPassant && sameCol) return moveCell;
    }
  };
  const canBeTakenEnPassant: boolean | undefined =
    state.selectedPiece?.type === "pawn" &&
    piece?.type === "pawn" &&
    piece.canBeTakenEnPassant &&
    piece.color !== currentTurn &&
    !!enPassantCell();

  useEffect(() => {
    setIsCastlingRook(
      hasPieces &&
        isKingInitial(selectedPiece) &&
        isRookInitial(piece, selectedPiece) &&
        hasInMoves(selectedPiece, piece)
    );
    // inMoveSet && console.log(cell.id, cell.threats);
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

function hasInMoves(selected: PieceType, piece: PieceType): boolean {
  const selectedPieceCell = getCell(selected.cell.id);
  const d = dir(piece, selected);
  const col = selectedPieceCell.col + d * 2;
  const cell = BOARD[selectedPieceCell.row][col];
  return selected.moveSet.some((m) => m.id === cell?.id);
}

function isKingInitial(selected: PieceType): boolean {
  if (selected.type === "king") return !selected.hasMoved;
  return false;
}
function isRookInitial(piece: PieceType, selected: PieceType): boolean {
  if (piece.type === "rook")
    return !piece.hasMoved && piece.color === selected.color;
  return false;
}

function dir(piece: PieceType, selected: PieceType): number {
  const selectedPieceCell = getCell(selected.cell.id);
  const pieceCell = getCell(piece.cell.id);
  return selectedPieceCell.col > pieceCell.col ? -1 : 1;
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
