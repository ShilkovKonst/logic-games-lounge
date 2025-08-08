import { ChessContext } from "@/context/chessContext";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { Piece } from "@/lib/chess-engine/types";
import { defineMoveSet } from "@/lib/chess-engine/utils/filterLegalMoves";
import { useContext, useEffect, useState } from "react";

type ExchangeProps = {
  changeTurn: () => void;
};

const PiecesToExchange: React.FC<ExchangeProps> = ({ changeTurn }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Piece must be used within ChessProvider");
  const { selectedPiece, pieces, pieceToExchange, setPieceToExchange } =
    context;

  const [piecesToExchange, setPiecesToExchange] = useState<Piece[]>([]);

  const handleExchange = (pieceToChange: Piece, changeTurn: () => void) => {
    if (selectedPiece) {
      const selected = pieces.find((p) => p.id === selectedPiece.id);
      if (selected) {
        selected.type = pieceToChange.type;
        setPieceToExchange(undefined);
        changeTurn();
      }
    }
  };

  useEffect(() => {
    if (pieceToExchange) {
      setPiecesToExchange([
        {
          id: pieceToExchange.id,
          cell: pieceToExchange.cell,
          color: pieceToExchange.color,
          isTaken: true,
          type: "rook",
          hasMoved: true,
          moveSet: [],
        },
        {
          id: pieceToExchange.id,
          cell: pieceToExchange.cell,
          color: pieceToExchange.color,
          isTaken: true,
          type: "bishop",
          moveSet: [],
        },
        {
          id: pieceToExchange.id,
          cell: pieceToExchange.cell,
          color: pieceToExchange.color,
          isTaken: true,
          type: "knight",
          moveSet: [],
        },
        {
          id: pieceToExchange.id,
          cell: pieceToExchange.cell,
          color: pieceToExchange.color,
          isTaken: true,
          type: "queen",
          moveSet: [],
        },
      ]);
    }
  }, [pieceToExchange]);

  return (
    <div
      className={`z-10 absolute ${
        selectedPiece?.color === "white" ? "top-1/2" : "bottom-full"
      }  m-1 left-1/2 transform -translate-x-1/2 bg-amber-200 flex justify-evenly items-center border-2 border-amber-800 `}
    >
      {piecesToExchange.map((p, i) => (
        <button
          key={i}
          className="cursor-pointer p-1 inset-shadow-cell-ambermedium hover:bg-amber-600 hover:opacity-90"
          onClick={() => handleExchange(p, changeTurn)}
        >
          <PieceIcon color={p.color} type={p.type} />
        </button>
      ))}
    </div>
  );
};

export default PiecesToExchange;
