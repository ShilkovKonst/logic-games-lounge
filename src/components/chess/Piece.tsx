import { pieces } from "@/lib/chess-engine/constants/chessPieces";
import { Piece as PieceT } from "@/lib/chess-engine/types";

type PieceProps = {
  piece: PieceT;
};

const Piece: React.FC<PieceProps> = ({ piece }) => {
  const { type, color } = piece;
  return (
    <span className="text-6xl text-amber-950 cursor-pointer">
      {pieces[type][color]}
    </span>
  );
};

export default Piece;
