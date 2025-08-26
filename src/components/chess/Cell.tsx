import { CellType, GameState } from "@/lib/chess-engine/types";
import Piece from "./Piece";
import HighLight from "./HighLight";
import { useGameState } from "@/context/GameStateContext";
import { useBoardState } from "@/context/BoardStateContext";
import PiecesToExchange from "./PiecesToExchange";
import { getPieceAt } from "@/lib/chess-engine/utils/pieceUtils";

type CellProps = {
  cell: CellType;
  state: GameState;
};

const Cell: React.FC<CellProps> = ({ cell, state }) => {
  const { selectedPiece, currentBoardState, isExchange } = state;
  const piece = getPieceAt(cell.id, currentBoardState);

  const inMoveSet = selectedPiece?.moveSet.some((m) => m.id === cell.id);
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
  console.log();
  return (
    <div
      data-cell-id={cell.id}
      className={`${
        inMoveSet && "move cursor-pointer"
      } relative flex justify-center items-center h-12 w-12 md:h-14 md:w-14 ${cellColorStyle} ${borderStyle} box-border border-amber-950 `}
    >
      {isExchange && selectedPiece?.cell.id === cell.id && <PiecesToExchange />}
      <HighLight cell={cell} piece={piece} state={state} />
      {piece && <Piece cell={cell} piece={piece} state={state} />}
    </div>
  );
};

export default Cell;
