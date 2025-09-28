import { Color, GameType, PieceType } from "../types";
import { notToRC, rcToNot } from "./cellUtil";
import { checkMoveSet, getPieceAt } from "./pieceUtils";

export function defineCellPropsNStyles(
  selectedPiece: PieceType | undefined,
  cell: string,
  currentBoardState: PieceType[],
  currentTurn: Color,
  gameType: GameType
) {
  const { row, col } = notToRC(cell);
  const piece = getPieceAt(cell, currentBoardState);
  const thisMove = checkMoveSet(selectedPiece, cell);
  const canMove =
    selectedPiece?.color === currentTurn && gameType === "hotseat"; // TODO: add logic for online mode
  const isThisMoveInDanger = !!thisMove && thisMove?.threats.size > 0;
  const isInMoveSet = !!selectedPiece?.moveSet.some((m) => m.id === cell);

  const isDangerMove = canMove && isThisMoveInDanger;
  const isThisSelectedPiece = selectedPiece && selectedPiece.id === piece?.id;
  const isSafeMove = selectedPiece?.cell.threats.size === 0;
  const isEpMove = canBeTakenEnPassant(selectedPiece, piece);
  const isCastlingMove = canCastle(selectedPiece, piece);
  const canHover =
    piece?.color === currentTurn && piece?.id !== selectedPiece?.id;
  const isSelected = selectedPiece?.cell.id === cell;

  const cellShadowPieceStyle = `${
    isThisSelectedPiece
      ? isSafeMove
        ? "inset-shadow-select-safe"
        : "inset-shadow-select-danger"
      : ""
  }`;
  const cellShadowMoveStyle = `${
    thisMove
      ? isDangerMove
        ? "inset-shadow-move-danger"
        : "inset-shadow-move-safe"
      : ""
  }`;
  const cellShadowEpMove = isEpMove ? "inset-shadow-piece-ep" : "";
  const cellShadowCastlingMove = isCastlingMove
    ? "inset-shadow-piece-castling"
    : "";

  const cellShadowBaseStyle =
    (row + col) % 2 === 1
      ? "inset-shadow-cell-amberdark"
      : "inset-shadow-cell-amberlight";

  const cellBgStyle = `${
    (row + col) % 2 === 1 ? "bg-amber-600" : "bg-amber-100"
  }`;
  const borderStyle = `border-amber-950 ${row === 0 ? `border-t-2` : ""}${
    row === 7 ? "border-b-2" : ""
  }${col === 0 ? " border-l-2" : ""}${col === 7 ? " border-r-2" : ""}`;

  const hoverStyle = canHover ? "hover:inset-shadow-select-hover" : "";

  const moveStyle = thisMove ? "move cursor-pointer" : "";

  return {
    piece,
    shadowStyle: cellShadowCastlingMove
      ? cellShadowCastlingMove
      : cellShadowEpMove
      ? cellShadowEpMove
      : cellShadowMoveStyle
      ? cellShadowMoveStyle
      : cellShadowPieceStyle
      ? cellShadowPieceStyle
      : cellShadowBaseStyle,
    borderStyle,
    cellBgStyle,
    hoverStyle,
    moveStyle,
    isSelected,
    isInMoveSet,
  };
}

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
