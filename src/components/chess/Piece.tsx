import { ChessContext } from "@/context/chessContext";
import { Piece as PieceType } from "@/lib/chess-engine/types";
import { dragStart as handleDragStart } from "@/lib/chess-engine/dragNDrop/dragStart";
import { MouseEvent, TouchEvent, useContext } from "react";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import PiecesToExchange from "./PiecesToExchange";

type PieceProps = {
  piece: PieceType;
};

const Piece: React.FC<PieceProps> = ({ piece }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Piece must be used within ChessProvider");
  const {
    board,
    playerState,
    currentTurn,
    setCurrentTurn,
    selectedPiece,
    setSelectedPiece,
    pieceToExchange,
    setPieceToExchange,
    // setMoveSet,
    pieces,
  } = context;

  const { type, color } = piece;

  const isSelected =
    selectedPiece?.cell.col === piece.cell.col &&
    selectedPiece?.cell.row === piece.cell.row;

  const isCurrentPlayer = color === currentTurn;

  const changeTurn = () => {
    setSelectedPiece(undefined);
    setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
  };

  return (
    <div
      className={`piece relative flex items-center justify-center text-amber-950 transform ease-in-out duration-300`}
    >
      {pieceToExchange && pieceToExchange.id === piece.id && (
        <PiecesToExchange changeTurn={changeTurn} />
      )}
      <button
        {...(isCurrentPlayer && !pieceToExchange
          ? {
              onMouseDown: (e: MouseEvent<HTMLButtonElement>) =>
                handleDragStart(
                  e,
                  piece,
                  pieces.filter(p => !p.isTaken),
                  playerState.color,
                  currentTurn,
                  board,
                  setSelectedPiece,
                  setPieceToExchange,
                  // setMoveSet,
                  changeTurn
                ),
              onTouchStart: (e: TouchEvent<HTMLButtonElement>) =>
                handleDragStart(
                  e,
                  piece,
                  pieces.filter(p => !p.isTaken),
                  playerState.color,
                  currentTurn,
                  board,
                  setSelectedPiece,
                  setPieceToExchange,
                  // setMoveSet,
                  changeTurn
                ),
            }
          : {
              onClick: () => {
                if (!pieceToExchange)
                  setSelectedPiece(piece);
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
