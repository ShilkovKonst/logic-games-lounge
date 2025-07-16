import { Piece as PieceT } from "@/lib/chess-engine/types";
import Piece from "./Piece";

type CellProps = {
  i: number;
  j: number;
  piece: PieceT | null;
};

const Cell: React.FC<CellProps> = ({ i, j, piece }) => {
  return (
    <div
      key={j}
      className={`flex justify-center items-center h-20 w-20  ${
        (i + j) % 2 === 1 ? "bg-amber-700" : "bg-amber-50"
      } 
        ${i === 0 && "border-t-2"} 
        ${i === 7 && "border-b-2"} 
        ${j === 0 && "border-l-2"} 
        ${j === 7 && "border-r-2"} 
        box-border border-amber-950`}
    >
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Cell;
