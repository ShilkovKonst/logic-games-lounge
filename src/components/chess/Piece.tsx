"use state";
import { ChessContext } from "@/context/chessContext";
import { piecesIcons } from "@/lib/chess-engine/constants/piecesIcons";
import {
  bishopMoves,
  kingMoves,
  knightMoves,
  pawnMoves,
  queenMoves,
  rookMoves,
} from "@/lib/chess-engine/movesets";
import { Piece as PieceT } from "@/lib/chess-engine/types";
import { useContext } from "react";

type PieceProps = {
  piece: PieceT;
};

const Piece: React.FC<PieceProps> = ({ piece }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Piece must be used within ChessProvider");
  const {
    selectedPiece,
    setSelectedPiece,
    moveSet,
    setMoveSet,
    piecesState,
    setPiecesState,
  } = context;

  const { type, color, cell, hasMoved } = piece;
  const PieceIcon = piecesIcons[type];

  const handleClick = () => {
    if (selectedPiece != piece) setMoveSet([]);
    setSelectedPiece(piece);
    switch (piece.type) {
      case "pawn":
        setMoveSet(pawnMoves(piece, piecesState));
        break;
      case "rook":
        setMoveSet(rookMoves(piece, piecesState));
        break;
      case "knight":
        setMoveSet(knightMoves(piece, piecesState));
        break;
      case "bishop":
        setMoveSet(bishopMoves(piece, piecesState));
        break;
      case "queen":
        setMoveSet(queenMoves(piece, piecesState));
        break;
      case "king":
        setMoveSet(kingMoves(piece, piecesState));
        break;
      default:
        setMoveSet([]);
    }
    console.log(color, cell, moveSet);
  };

  return (
    <button
      onClick={() => handleClick()}
      className={`text-amber-950 cursor-pointer scale-100 hover:scale-110 transform ease-in-out duration-300`}
    >
      <PieceIcon color={color} />
    </button>
  );
};

export default Piece;
