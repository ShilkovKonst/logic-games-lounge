import { PieceType, TurnDetails } from "../types";
import { notToRC } from "../utils/cellUtil";

export function checkIsEnoughPieces(activePieces: PieceType[]): boolean {
  const nonKings = activePieces.filter((p) => p.type !== "king");

  if (nonKings.length === 0) return true;

  if (nonKings.length === 1)
    return nonKings[0].type === "knight" || nonKings[0].type === "bishop";

  const onlyBishops = nonKings.every((p) => p.type === "bishop");
  if (onlyBishops) {
    const nonKingsCells = nonKings.map((p) => notToRC(p.cell.id));
    const colors = new Set(nonKingsCells.map((c) => (c.row + c.col) % 2));
    return colors.size === 1;
  }

  return false;
}

export function checkRepetition(
  log: TurnDetails[][],
  current: TurnDetails
): { threefold: boolean; fivefold: boolean } {
  const hash = getPositionHash(current);
  let count = 0;
  for (const fullTurn of log) {
    for (const halfTurn of fullTurn) {
      if (getPositionHash(halfTurn) === hash) {
        count++;
      }
    }
  }
  return { threefold: count >= 2, fivefold: count >= 4 };
}

function getPositionHash(turn: TurnDetails): string {
  const pieces = turn.boardState
    .filter((p) => !p.isTaken)
    .map((p) => `${p.type}${p.color}${p.cell.id}`)
    .sort()
    .join("|");

  return `${turn.curentPlayer}|${turn.castling ?? ""}|${
    turn.isEnPassant ?? false
  }|${pieces}`;
}
