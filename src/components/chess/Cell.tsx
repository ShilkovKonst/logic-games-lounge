import { Cell as CellType, Piece as PieceT } from "@/lib/chess-engine/types";
import Piece from "./Piece";
import HighLight from "./HighLight";
import { useGameState } from "@/context/GameStateContext";

type CellProps = {
  board: CellType[][];
  cell: CellType;
  piece: PieceT | undefined;
};

const Cell: React.FC<CellProps> = ({ board, cell, piece }) => {
  const { selectedPiece } = useGameState();

  const move =
    selectedPiece && selectedPiece.moveSet.find((m) => m.id === cell.id);

  const cellColorStyle = `${
    (cell.row + cell.col) % 2 === 1
      ? "bg-amber-700 inset-shadow-cell-amberdark"
      : "bg-amber-50 inset-shadow-cell-amberlight"
  }`;
  const borderStyle = `${cell.row === 0 ? "border-t-2" : ""} ${
    cell.row === 7 ? "border-b-2" : ""
  } ${cell.col === 0 ? "border-l-2" : ""} ${
    cell.col === 7 ? "border-r-2" : ""
  }`;

  return (
    <div
      id={`${cell.row}-${cell.col}`}
      className={`relative ${
        !!move && "dropzone"
      } flex justify-center items-center h-12 w-12 md:h-14 md:w-14 ${cellColorStyle} ${borderStyle} box-border border-amber-950 `}
    >
      <HighLight row={cell.row} col={cell.col} move={move} piece={piece} />
      {piece && <Piece board={board} piece={piece} />}
    </div>
  );
};

export default Cell;
