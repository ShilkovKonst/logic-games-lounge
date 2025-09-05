import {
  CellType,
  GameState,
  GameType,
  PieceType,
} from "@/lib/chess-engine/types";
import Piece from "./Piece";
import PiecesToExchange from "./PiecesToExchange";
import { checkMoveSet, getPieceAt } from "@/lib/chess-engine/utils/pieceUtils";
import {
  colToNot,
  notToCol,
  notToRow,
} from "@/lib/chess-engine/constants/board";
import { rcToNotation } from "@/lib/chess-engine/utils/cellUtil";

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

  // const cellShadowPieceStyle = `${
  //   !!selectedPiece && selectedPiece?.id === piece?.id
  //     ? `inset-ring-4 ${
  //         selectedPiece.cell.threats.size === 0
  //           ? "inset-ring-amber-400"
  //           : "inset-ring-red-500"
  //       }`
  //     : ""
  // }`;
  // const cellShadowMoveStyle = `${
  //   !!thisMove
  //     ? canMove &&
  //       `inset-ring-4 ${
  //         isInDanger ? "inset-ring-red-700/75" : "inset-ring-green-700/75"
  //       }`
  //     : ""
  // }`;
  // const cellShadowEpMove = canBeTakenEnPassant(selectedPiece, piece)
  //   ? "inset-ring-4 inset-ring-rose-500"
  //   : "";
  // const cellShadowCastlingMove = canCastle(selectedPiece, piece)
  //   ? "inset-ring-4 inset-ring-lime-500"
  //   : "";

  const cellShadowBaseStyle =
    (cell.row + cell.col) % 2 === 1
      ? "inset-shadow-cell-amberdark"
      : "inset-shadow-cell-amberlight";
  const cellBgStyle = `${
    (cell.row + cell.col) % 2 === 1 ? "bg-amber-700" : "bg-amber-50"
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
      className={`${
        !!thisMove ? "move cursor-pointer" : ""
      } ${piece && piece.color === currentTurn && piece.id !== selectedPiece?.id && "hover:inset-shadow-select-hover"} relative flex justify-center items-center h-[44px] w-[44px] md:h-[50px] md:w-[50px] ${finaShadowlStyle} ${cellBgStyle} ${borderStyle} box-border border-amber-950 transition duration-200 ease-in-out`}
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
    const mCol = notToCol[m.id[0]];
    const epRow = notToRow[m.id[1]] - (piece.color === "white" ? 1 : -1);
    const epCell = rcToNotation(epRow, mCol);
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
  const d = selectedPiece.cell.id[0] > piece.cell.id[0] ? -1 : 1;
  const col = notToCol[selectedPiece.cell.id[0]] + d * 2;
  const cell = colToNot[col] + selectedPiece.cell.id[1];
  return selectedPiece.moveSet.some((m) => m.id === cell);
}
