import { Cell, Piece as PieceType } from "@/lib/chess-engine/types";
import { dragStart as handleDragStart } from "@/lib/chess-engine/dragNDrop/dragStart";
import { MouseEvent, TouchEvent } from "react";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import PiecesToExchange from "./PiecesToExchange";
import { useGameState } from "@/context/GameStateContext";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useBoardState } from "@/context/BoardStateContext";

type PieceProps = {
  board: Cell[][];
  piece: PieceType;
};

const Piece: React.FC<PieceProps> = ({ board, piece }) => {
  const { type, color } = piece;

  const { playerState } = usePlayerState();
  const { pieces } = useBoardState();
  const {
    currentTurn,
    changeTurn,
    selectedPiece,
    setSelectedPiece,
    pieceToExchange,
    setPieceToExchange,
  } = useGameState();

  const activePieces = pieces.filter((p) => !p.isTaken);

  const isSelected =
    selectedPiece?.cell.col === piece.cell.col &&
    selectedPiece?.cell.row === piece.cell.row;

  const isCurrentPlayer =
    currentTurn === playerState.color && color === currentTurn;

  return (
    <div
      className={`piece relative flex items-center justify-center text-amber-950 transform ease-in-out duration-300`}
    >
      {pieceToExchange && pieceToExchange.id === piece.id && (
        <PiecesToExchange />
      )}
      <button
        {...(isCurrentPlayer && !pieceToExchange
          ? {
              onMouseDown: (e: MouseEvent<HTMLButtonElement>) =>
                handleDragStart(
                  e,
                  piece,
                  activePieces,
                  board,
                  setSelectedPiece,
                  setPieceToExchange,
                  changeTurn
                ),
              onTouchStart: (e: TouchEvent<HTMLButtonElement>) =>
                handleDragStart(
                  e,
                  piece,
                  activePieces,
                  board,
                  setSelectedPiece,
                  setPieceToExchange,
                  changeTurn
                ),
            }
          : {
              onClick: () => {
                if (!pieceToExchange) setSelectedPiece(piece);
              },
            })}
        className={`relative scale-100 ${
          isCurrentPlayer && (isSelected ? "cursor-grabbing" : "cursor-grab")
        } ${
          isCurrentPlayer && "hover:scale-110"
        } bg-transparent transform ease-in-out duration-150 ${
          playerState.color === "white" ? "rotate-0" : "rotate-180"
        }`}
      >
        <PieceIcon color={color} type={type} />
      </button>
    </div>
  );
};

export default Piece;
