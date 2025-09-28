import { Color, GameType, PieceType } from "@/lib/chess-engine/types";
import Piece from "./Piece";
import PiecesToExchange from "./PiecesToExchange";
import { memo } from "react";

type CellProps = {
  cell: string;
  piece: PieceType | undefined;
  currentTurn: Color;
  gameType: GameType;
  shadowStyle: string;
  borderStyle: string;
  cellBgStyle: string;
  hoverStyle: string;
  moveStyle: string;
  isExchange: boolean;
  isSelected: boolean;
  isInMoveSet: boolean;
};

const Cell = memo<CellProps>(function Cell({
  cell,
  piece,
  currentTurn,
  gameType,
  shadowStyle,
  borderStyle,
  cellBgStyle,
  hoverStyle,
  moveStyle,
  isExchange,
  isSelected,
  isInMoveSet,
}) {
  return (
    <div
      data-cell-id={cell}
      className={`${moveStyle} ${hoverStyle} relative flex justify-center items-center h-[44px] w-[44px] md:h-[50px] md:w-[50px] ${shadowStyle} ${cellBgStyle} ${borderStyle} box-border transition duration-100 ease-in-out`}
    >
      {isExchange && isSelected && (
        <PiecesToExchange currentTurn={currentTurn} />
      )}
      {piece && (
        <Piece
          piece={piece}
          currentTurn={currentTurn}
          gameType={gameType}
          isSelected={isSelected}
          isInMoveSet={isInMoveSet}
          isExchange={isExchange}
        />
      )}
    </div>
  );
});

export default Cell;
