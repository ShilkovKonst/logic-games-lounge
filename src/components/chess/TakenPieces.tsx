import { ChessContext } from "@/context/chessContext";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { Color } from "@/lib/chess-engine/types";
import { useContext } from "react";

type TakenPiecesProps = {
  player: Color;
};

const TakenPieces: React.FC<TakenPiecesProps> = ({ player }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Piece must be used within ChessProvider");

  const { pieces } = context;

  return (
    <div className="flex max-h-60 md:max-h-70">
      <div className="flex flex-col">
        {pieces
          .filter((p) => p.color !== player && p.isTaken && p.type === "pawn")
          .map((p, i) => (
            <button key={i} className="w-9 h-9">
              <PieceIcon
                color={player === "white" ? "black" : "white"}
                isTaken={true}
                type={p.type}
              />
            </button>
          ))}
      </div>
      <div className="flex flex-col flex-wrap">
        {pieces
          .filter((p) => p.color !== player && p.isTaken && p.type !== "pawn")
          .map((p, i) => (
            <button key={i} className="w-9 h-9 flex">
              <PieceIcon
                color={player === "white" ? "black" : "white"}
                isTaken={true}
                type={p.type}
              />
            </button>
          ))}
      </div>
    </div>
  );
};

export default TakenPieces;
