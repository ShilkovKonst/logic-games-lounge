import { Pieces } from "../types";

export function getSAN(piece: Pieces): string {
  switch (piece) {
    case "pawn":
      return "";
    case "rook":
      return "R";
    case "knight":
      return "N";
    case "bishop":
      return "B";
    case "queen":
      return "Q";
    case "king":
      return "K";
    default:
      return ''
      throw new Error(`Piece type ${piece} should correspond SAN`);
  }
}

export function getDisambiguation(from: string, ambiguity: string[]) {
  if (ambiguity.length <= 1) return '';

  const fromFile = from[0]; // 'a'–'h'
  const fromRank = from[1]; // '1'–'8'

  const otherFiles = ambiguity.map(c => c[0]);
  const otherRanks = ambiguity.map(c => c[1]);

  const sameFile = otherFiles.includes(fromFile);
  const sameRank = otherRanks.includes(fromRank);

  if (!sameFile) {
    return fromFile;
  } else if (!sameRank) {
    return fromRank;
  } else {
    return from;
  }
}
