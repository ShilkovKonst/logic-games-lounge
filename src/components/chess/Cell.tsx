import { CellType, GameState, GameType } from "@/lib/chess-engine/types";
import Piece from "./Piece";
import HighLight from "./HighLight";
import PiecesToExchange from "./PiecesToExchange";
import { getPieceAt } from "@/lib/chess-engine/utils/pieceUtils";

type CellProps = {
  cell: CellType;
  gameType: GameType;
  state: GameState;
};

const Cell: React.FC<CellProps> = ({ cell, state, gameType }) => {
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
  return (
    <div
      data-cell-id={cell.id}
      className={`${
        inMoveSet && "move cursor-pointer"
      } relative flex justify-center items-center h-[44px] w-[44px] md:h-[50px] md:w-[50px] ${cellColorStyle} ${borderStyle} box-border border-amber-950 `}
    >
      {isExchange && selectedPiece?.cell.id === cell.id && (
        <PiecesToExchange state={state} />
      )}
      <HighLight cell={cell} piece={piece} state={state} gameType={gameType} />
      {piece && <Piece cell={cell} piece={piece} state={state} gameType={gameType} />}
    </div>
  );
};

export default Cell;
