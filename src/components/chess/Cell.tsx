import { Piece as PieceT } from "@/lib/chess-engine/types";
import Piece from "./Piece";
import { useContext } from "react";
import { ChessContext } from "@/context/chessContext";

type CellProps = {
  i: number;
  j: number;
  piece: PieceT | null;
};

const Cell: React.FC<CellProps> = ({ i, j, piece }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Piece must be used within ChessProvider");

  const { moveSet } = context;

  const inMoveSet: boolean = moveSet.some((m) => m.row === i && m.col === j);

  const cellColorStyle = `${
    (i + j) % 2 === 1 ? "bg-amber-700" : "bg-amber-50"
  }`;

  const borderStyle = `${i === 0 ? "border-t-2" : ""} ${
    i === 7 ? "border-b-2" : ""
  } ${j === 0 ? "border-l-2" : ""} ${j === 7 ? "border-r-2" : ""}`;

  return (
    <div
      key={j}
      className={`flex justify-center items-center h-20 w-20 relative ${cellColorStyle} ${borderStyle} box-border border-amber-950`}
    >
      <span
        className={`absolute top-1 left-1 right-1 bottom-1 ${
          inMoveSet ? "opacity-100" : "opacity-0"
        } rounded-full border-4 ${
          piece ? "border-orange-700" : "border-green-700"
        } transform ease-in-out duration-150`}
      >
        {i + " " + j}
      </span>
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Cell;
