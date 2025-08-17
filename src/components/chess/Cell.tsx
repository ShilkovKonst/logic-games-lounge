import { Cell as CellType } from "@/lib/chess-engine/types";
import Piece from "./Piece";
import HighLight from "./HighLight";
import { useGameState } from "@/context/GameStateContext";
import { getPieceAt } from "@/lib/chess-engine/moveSets/generator";
import { useBoardState } from "@/context/BoardStateContext";

type CellProps = {
  board: CellType[][];
  cell: CellType;
};

const Cell: React.FC<CellProps> = ({ board, cell }) => {
  const { selectedPiece } = useGameState();
  const { pieces } = useBoardState();
  if (selectedPiece) {
    // console.log(cell.id, selectedPiece.moveSet.values().toArray());
    for (const move of selectedPiece.moveSet)
      if (move == cell.id) {
        console.log(cell, selectedPiece.moveSet.values().toArray());
        console.log(selectedPiece.moveSet.has(cell.id));
      }
  }
  const piece = getPieceAt(cell.id, pieces);
  const inMoveSet = selectedPiece?.moveSet.has(cell.id);

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
        inMoveSet && "dropzone"
      } flex justify-center items-center h-12 w-12 md:h-14 md:w-14 ${cellColorStyle} ${borderStyle} box-border border-amber-950 `}
    >
      <HighLight cell={cell} piece={piece} />
      {piece && <Piece board={board} piece={piece} />}
    </div>
  );
};

export default Cell;
