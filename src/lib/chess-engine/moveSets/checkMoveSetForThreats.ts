import { Cell, Color, King, Pawn, Piece } from "../types";
import { getCell } from "../utils/cellUtil";
import { checkThreats } from "./getAttackSets";

export function checkMoveSetForThreats(
  currentPiece: Piece,
  pieces: Piece[],
  playerColor: Color,
  board: Cell[][]
): void {
  const moveSet = currentPiece.moveSet;
  for (const move of moveSet) {
    const cell = getCell(board, move);
    const threats = checkThreats(
      currentPiece,
      move,
      pieces,
      playerColor,
      board
    );
    for (const threat of threats) cell.threats.add(threat);
  }
  if (currentPiece.type === "king" && currentPiece.color === playerColor) {
    const castlingMoves = getCastlingMoves(currentPiece, pieces, board);
    currentPiece.moveSet = moveSet.concat(castlingMoves);
    return;
  }
  if (currentPiece.type === "pawn" && moveSet[1]) {
    assignPawnEnPasantThreat(
      moveSet[1],
      moveSet[0],
      currentPiece,
      pieces,
      board
    );
    // const cell = getCell(board, moveSet[1]);
    // if (cell && !currentPiece.hasMoved && cell.threats.size === 0) {
    //   const threats = getCell(board, moveSet[0])?.threats;
    //   for (const t of threats) {
    //     const foe = pieces.find((f) => f.id === t);
    //     if (foe && foe.type === "pawn") cell.threats.add(t);
    //   }
    // }
  }
  currentPiece.moveSet = moveSet;
}

function assignPawnEnPasantThreat(
  enPassantMove: string,
  regularMove: string,
  currentPiece: Pawn,
  pieces: Piece[],
  board: Cell[][]
): void {
  const cell = getCell(board, enPassantMove);
  if (cell && !currentPiece.hasMoved && cell.threats.size === 0) {
    const threats = getCell(board, regularMove)?.threats;
    for (const t of threats) {
      const foe = pieces.find((f) => f.id === t);
      if (foe && foe.type === "pawn") cell.threats.add(t);
    }
  }
}

function getCastlingMoves(
  king: King,
  pieces: Piece[],
  board: Cell[][]
): string[] {
  const cMoves: string[] = [];
  if (king.isInDanger) return cMoves;

  const kingCell = getCell(board, king.cell);
  const rooks = pieces.filter(
    (p) =>
      p.type === "rook" && p.color === king.color && !p.hasMoved && !p.isTaken
  );
  for (const r of rooks) {
    if (r.type !== "rook") continue;

    const rookCell = getCell(board, r.cell);
    const row = kingCell.row;
    const dir = rookCell.col > kingCell.col ? 1 : -1;
    let col = kingCell.col + dir;
    let blocked = false;
    while (col !== rookCell.col) {
      const cell = board[row][col];
      const threats =
        Math.abs(kingCell.col - col) < 3
          ? checkThreats(king, cell.id, pieces, king.color, board)
          : [];
      if (isOcupied(pieces, cell) || threats.length > 0) {
        blocked = true;
        break;
      }
      col += dir;
    }

    if (blocked) continue;

    const cell = board[row][kingCell.col + dir * 2];
    cell["special"] = { type: "castling", rookId: r.id };
    cMoves.push(cell.id);
  }
  return cMoves;
}

function isOcupied(pieces: Piece[], cell: Cell): boolean {
  return pieces.some((p) => cell.id === p.cell);
}
