import { bDir, kDir, qDir, rDir } from "../constants/dirs";
import { attackGenerator } from "./generator";
import {
  Bishop,
  Cell,
  Color,
  King,
  Knight,
  Pawn,
  Piece,
  Queen,
  Rook,
} from "../types";
import { getCell } from "../utils/cellUtil";

export function checkThreats(
  current: Piece,
  cellId: string,
  pieces: Piece[],
  currentPlayerColor: Color,
  board: Cell[][]
): string[] {
  const foes = pieces.filter(
    (p) => !p.isTaken && p.color !== currentPlayerColor
  );
  const threatenedBy: string[] = [];

  for (const foe of foes) {
    const attacks = getAttackSet(current, foe, pieces, board);
    if (attacks.some((id) => id === cellId)) {
      threatenedBy.push(foe.id);
    }
  }
  return threatenedBy;
}

function getAttackSet(
  current: Piece,
  pieceToCheck: Piece,
  pieces: Piece[],
  board: Cell[][]
): string[] {
  switch (pieceToCheck.type) {
    case "pawn":
      return pawnAttacks(pieceToCheck as Pawn, board);
    case "rook":
      return attackGenerator(
        current,
        pieceToCheck as Rook,
        pieces,
        board,
        rDir,
        7
      );
    case "bishop":
      return attackGenerator(
        current,
        pieceToCheck as Bishop,
        pieces,
        board,
        bDir,
        7
      );
    case "queen":
      return attackGenerator(
        current,
        pieceToCheck as Queen,
        pieces,
        board,
        qDir,
        7
      );
    case "knight":
      return attackGenerator(
        current,
        pieceToCheck as Knight,
        pieces,
        board,
        kDir,
        1
      );
    case "king":
      return attackGenerator(
        current,
        pieceToCheck as King,
        pieces,
        board,
        qDir,
        1
      );
    default:
      return [];
  }
}

function pawnAttacks(pawn: Pawn, board: Cell[][]): string[] {
  const res: string[] = [];
  const cell = getCell(board, pawn.cell);
  const dir = pawn.color === "white" ? -1 : 1;
  const nextRow = cell.row + dir;
  const col = cell.col;

  if (nextRow < 0 || nextRow >= 8) return res;

  if (col - 1 >= 0) res.push(board[nextRow][col - 1].id);
  if (col + 1 < 8) res.push(board[nextRow][col + 1].id);

  return res;
}
