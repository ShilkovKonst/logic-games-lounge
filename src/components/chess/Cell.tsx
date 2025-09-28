import { Color, GameType, PieceType } from "@/lib/chess-engine/types";
import Piece from "./Piece";
import PiecesToExchange from "./PiecesToExchange";
import { memo } from "react";
import { CellHighlightType } from "@/lib/chess-engine/utils/styleUtils";
import { notToRC } from "@/lib/chess-engine/utils/cellUtil";

type CellProps = {
  cell: string;
  piece: PieceType | undefined;
  currentTurn: Color;
  gameType: GameType;
  highlight: CellHighlightType;
  isExchange: boolean;
};

const Cell = memo<CellProps>(function Cell({
  cell,
  piece,
  currentTurn,
  gameType,
  isExchange,
  highlight,
}) {
  const { row, col } = notToRC(cell);
  const {
    isSelected,
    isMove,
    isDanger,
    isCastling,
    isEnPassant,
  } = highlight;

  const cellShadowPieceStyle = `${
    isSelected
      ? !isDanger
        ? "inset-shadow-select-safe"
        : "inset-shadow-select-danger"
      : ""
  }`;
  const cellShadowMoveStyle = `${
    isMove
      ? isDanger
        ? "inset-shadow-move-danger"
        : "inset-shadow-move-safe"
      : ""
  }`;
  const cellShadowEpMove = isEnPassant ? "inset-shadow-piece-ep" : "";
  const cellShadowCastlingMove = isCastling
    ? "inset-shadow-piece-castling"
    : "";
  const cellShadowBaseStyle =
    (row + col) % 2 === 1
      ? "inset-shadow-cell-amberdark"
      : "inset-shadow-cell-amberlight";
  const shadowStyle = cellShadowCastlingMove
    ? cellShadowCastlingMove
    : cellShadowEpMove
    ? cellShadowEpMove
    : cellShadowMoveStyle
    ? cellShadowMoveStyle
    : cellShadowPieceStyle
    ? cellShadowPieceStyle
    : cellShadowBaseStyle;

  const cellBgStyle = `${
    (row + col) % 2 === 1 ? "bg-amber-600" : "bg-amber-100"
  }`;
  const borderStyle = `border-amber-950 ${row === 0 ? `border-t-2` : ""}${
    row === 7 ? "border-b-2" : ""
  }${col === 0 ? " border-l-2" : ""}${col === 7 ? " border-r-2" : ""}`;
  const hoverStyle = piece && piece.color === currentTurn && !isSelected ? "hover:inset-shadow-select-hover" : "";
  const moveStyle = isMove ? "move cursor-pointer" : "";

  return (
    <div
      data-cell-id={cell}
      className={`${moveStyle} ${hoverStyle} relative flex justify-center items-center h-[44px] w-[44px] md:h-[50px] md:w-[50px] ${shadowStyle} ${cellBgStyle} ${borderStyle} box-border transition-colors duration-100 ease-in-out`}
    >
      {isExchange && isSelected && (
        <PiecesToExchange currentTurn={currentTurn} />
      )}
      {piece && (
        <Piece
          piece={piece}
          currentTurn={currentTurn}
          gameType={gameType}
          isSelected={!!isSelected}
          isInMoveSet={!!isMove}
          isExchange={isExchange}
        />
      )}
    </div>
  );
});

export default Cell;
