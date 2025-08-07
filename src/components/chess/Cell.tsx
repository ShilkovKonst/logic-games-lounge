import { Piece as PieceT } from "@/lib/chess-engine/types";
import Piece from "./Piece";
import { useContext } from "react";
import { ChessContext } from "@/context/chessContext";
import HighLight from "./HighLight";

type CellProps = {
  row: number;
  col: number;
  piece: PieceT | undefined;
};

const Cell: React.FC<CellProps> = ({ row, col, piece }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Cell must be used within ChessProvider");
  const { moveSet } = context;

  const move = moveSet.find((m) => m.row === row && m.col === col);

  const cellColorStyle = `${
    (row + col) % 2 === 1 ? "bg-amber-700 inset-shadow-cell-amberdark" : "bg-amber-50 inset-shadow-cell-amberlight"
  }`;
  const borderStyle = `${row === 0 ? "border-t-2" : ""} ${
    row === 7 ? "border-b-2" : ""
  } ${col === 0 ? "border-l-2" : ""} ${col === 7 ? "border-r-2" : ""}`;

  return (
    <div
      id={`${row}-${col}`}
      className={`relative ${
        !!move && "dropzone"
      } flex justify-center items-center h-12 w-12 md:h-14 md:w-14 ${cellColorStyle} ${borderStyle} box-border border-amber-950 `}
    >
      <HighLight row={row} col={col} move={move} piece={piece} />
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Cell;
