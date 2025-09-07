import {
  CellType,
  GameState,
  GameType,
  PieceType,
} from "@/lib/chess-engine/types";
import Piece from "./Piece";
import PiecesToExchange from "./PiecesToExchange";
import { checkMoveSet, getPieceAt } from "@/lib/chess-engine/utils/pieceUtils";
import { notToRC, rcToNot } from "@/lib/chess-engine/utils/cellUtil";

type CellProps = {
  cell: CellType;
  gameType: GameType;
  state: GameState;
};

const Cell: React.FC<CellProps> = ({ cell, state, gameType }) => {
  const { selectedPiece, currentBoardState, isExchange, currentTurn } = state;
  const piece = getPieceAt(cell.id, currentBoardState);

  const canMove =
    selectedPiece?.color === currentTurn && gameType === "hotseat"; // TODO: add logic for online mode
  const thisMove = checkMoveSet(selectedPiece, cell);
  const isInDanger = thisMove && thisMove?.threats.size > 0;

  const cellShadowPieceStyle = `${
    !!selectedPiece && selectedPiece?.id === piece?.id
      ? selectedPiece.cell.threats.size === 0
        ? "inset-shadow-select-safe"
        : "inset-shadow-select-danger"
      : ""
  }`;
  const cellShadowMoveStyle = `${
    !!thisMove
      ? canMove && isInDanger
        ? "inset-shadow-move-danger"
        : "inset-shadow-move-safe"
      : ""
  }`;
  const cellShadowEpMove = canBeTakenEnPassant(selectedPiece, piece)
    ? "inset-shadow-piece-ep"
    : "";
  const cellShadowCastlingMove = canCastle(selectedPiece, piece)
    ? "inset-shadow-piece-castling"
    : "";

  const cellShadowBaseStyle =
    (cell.row + cell.col) % 2 === 1
      ? "inset-shadow-cell-amberdark"
      : "inset-shadow-cell-amberlight";
  const cellBgStyle = `${
    (cell.row + cell.col) % 2 === 1 ? "bg-amber-600" : "bg-amber-100"
  }`;
  const borderStyle = `${cell.row === 0 ? `border-t-2` : ""}${
    cell.row === 7 ? "border-b-2" : ""
  }${cell.col === 0 ? " border-l-2" : ""}${
    cell.col === 7 ? " border-r-2" : ""
  }`;

  const finaShadowlStyle = cellShadowCastlingMove
    ? cellShadowCastlingMove
    : cellShadowEpMove
    ? cellShadowEpMove
    : cellShadowMoveStyle
    ? cellShadowMoveStyle
    : cellShadowPieceStyle
    ? cellShadowPieceStyle
    : cellShadowBaseStyle;
    
  return (
    <div
      data-cell-id={cell.id}
      className={`${!!thisMove ? "move cursor-pointer" : ""} ${
        piece &&
        piece.color === currentTurn &&
        piece.id !== selectedPiece?.id &&
        "hover:inset-shadow-select-hover"
      } relative flex justify-center items-center h-[44px] w-[44px] md:h-[50px] md:w-[50px] ${finaShadowlStyle} ${cellBgStyle} ${borderStyle} box-border border-amber-950 transition duration-100 ease-in-out`}
    >
      {isExchange && selectedPiece?.cell.id === cell.id && (
        <PiecesToExchange state={state} />
      )}
      {piece && (
        <Piece cell={cell} piece={piece} state={state} gameType={gameType} />
      )}
    </div>
  );
};

export default Cell;

function canBeTakenEnPassant(
  selectedPiece: PieceType | undefined,
  piece: PieceType | undefined
): boolean {
  if (
    !selectedPiece ||
    !piece ||
    piece.color === selectedPiece.color ||
    selectedPiece.type !== "pawn" ||
    piece.type !== "pawn" ||
    selectedPiece === piece ||
    !piece.canBeTakenEnPassant
  )
    return false;
  return selectedPiece.moveSet.some((m) => {
    const { row, col } = notToRC(m.id);
    const epRow = row - (piece.color === "white" ? 1 : -1);
    const epCell = rcToNot(epRow, col);
    return piece.cell.id === epCell;
  });
}

function canCastle(
  selectedPiece: PieceType | undefined,
  piece: PieceType | undefined
): boolean {
  if (
    !selectedPiece ||
    !piece ||
    piece.color !== selectedPiece.color ||
    selectedPiece.type !== "king" ||
    piece.type !== "rook" ||
    piece.hasMoved ||
    selectedPiece.hasMoved
  )
    return false;
  const sCell = notToRC(selectedPiece.cell.id);
  const pCell = notToRC(piece.cell.id);
  const d = sCell.col > pCell.col ? -1 : 1;
  const col = sCell.col + d * 2;
  const cell = rcToNot(sCell.row, col);
  return selectedPiece.moveSet.some((m) => m.id === cell);
}
