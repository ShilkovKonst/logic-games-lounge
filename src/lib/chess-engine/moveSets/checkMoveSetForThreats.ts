import { Color, King, MoveType, Pawn, PieceType } from "../types";
import { notToRC, rcToNot } from "../utils/cellUtil";
import { checkThreats } from "./getAttackSets";
import { buildBoardMap } from "../utils/pieceUtils";

export function checkMoveSetForThreats(
  currentPiece: PieceType,
  pieces: PieceType[],
  playerColor: Color
): void {
  const boardMap = buildBoardMap(pieces);
  const moveSet = currentPiece.moveSet;
  assignThreats(currentPiece, currentPiece.cell, playerColor, boardMap);
  for (const move of moveSet) {
    assignThreats(currentPiece, move, playerColor, boardMap);
  }
  if (
    currentPiece.type === "king" &&
    currentPiece.color === playerColor &&
    !currentPiece.hasMoved
  ) {
    const castlingMoves = getCastlingMoves(currentPiece, pieces, boardMap);
    currentPiece.moveSet = moveSet.concat(castlingMoves);
    return;
  }
  if (currentPiece.type === "pawn" && moveSet[1]) {
    assignPawnEnPasantThreat(moveSet[1], moveSet[0], currentPiece, pieces);
  }
  currentPiece.moveSet = moveSet;
}

function assignThreats(
  currentPiece: PieceType,
  move: MoveType,
  playerColor: Color,
  boardMap: Map<string, PieceType>
) {
  const pieceThreats = checkThreats(currentPiece, move.id, playerColor, boardMap);
  for (const threat of pieceThreats) move.threats.add(threat);
}

function assignPawnEnPasantThreat(
  enPassantMove: MoveType,
  regularMove: MoveType,
  currentPiece: Pawn,
  pieces: PieceType[]
): void {
  // Lookup is by piece id (not cell id) — array scan is correct here.
  if (!currentPiece.hasMoved && enPassantMove.threats.size === 0) {
    for (const t of regularMove.threats) {
      const foe = pieces.find((f) => f.id === t);
      if (foe && foe.type === "pawn") enPassantMove.threats.add(t);
    }
  }
}

function getCastlingMoves(
  king: King,
  pieces: PieceType[],
  boardMap: Map<string, PieceType>
): MoveType[] {
  const cMoves: MoveType[] = [];
  if (king.isInDanger || king.hasMoved) return cMoves;

  const kingCell = notToRC(king.cell.id);
  const rooks = pieces.filter(
    (p) =>
      p.type === "rook" && p.color === king.color && !p.hasMoved && !p.isTaken
  );
  for (const r of rooks) {
    if (r.type !== "rook") continue;

    const rookCell = notToRC(r.cell.id);
    const row = kingCell.row;
    const dir = rookCell.col > kingCell.col ? 1 : -1;
    let col = kingCell.col + dir;
    let blocked = false;
    while (col !== rookCell.col) {
      const cell = rcToNot(row, col);
      const threats =
        Math.abs(kingCell.col - col) < 3
          ? checkThreats(king, cell, king.color, boardMap)
          : [];
      if (boardMap.has(cell) || threats.length > 0) {
        blocked = true;
        break;
      }
      col += dir;
    }

    if (blocked) continue;

    const cMove: MoveType = {
      id: rcToNot(row, kingCell.col + dir * 2),
      threats: new Set<string>(),
      special: {
        type: "castling",
        rookId: r.id,
        long: Math.abs(kingCell.col - rookCell.col) === 4,
      },
    };
    cMoves.push(cMove);
  }
  return cMoves;
}
