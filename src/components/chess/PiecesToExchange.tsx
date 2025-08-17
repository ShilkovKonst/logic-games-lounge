import { useBoardState } from "@/context/BoardStateContext";
import { useGameState } from "@/context/GameStateContext";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { Piece } from "@/lib/chess-engine/types";
import { useEffect, useState } from "react";

const PiecesToExchange: React.FC = () => {
  const { selectedPiece, pieceToExchange, setPieceToExchange, changeTurn } =
    useGameState();
  const { pieces } = useBoardState();

  const [piecesToExchange, setPiecesToExchange] = useState<Piece[]>([]);

  const handleExchange = (pieceToChange: Piece) => {
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
          moveSet: new Set<string>(),
        },
        {
          id: pieceToExchange.id,
          cell: pieceToExchange.cell,
          color: pieceToExchange.color,
          isTaken: true,
          type: "bishop",
          moveSet: new Set<string>(),
        },
        {
          id: pieceToExchange.id,
          cell: pieceToExchange.cell,
          color: pieceToExchange.color,
          isTaken: true,
          type: "knight",
          moveSet: new Set<string>(),
        },
        {
          id: pieceToExchange.id,
          cell: pieceToExchange.cell,
          color: pieceToExchange.color,
          isTaken: true,
          type: "queen",
          moveSet: new Set<string>(),
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
          onClick={() => handleExchange(p)}
        >
          <PieceIcon color={p.color} type={p.type} />
        </button>
      ))}
    </div>
  );
};

export default PiecesToExchange;
