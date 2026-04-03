import { Pieces } from "../types";

export function encodeMove(fromCell: string, toCell: string, promo?: string): string {
  return promo ? `${fromCell}${toCell}${promo}` : `${fromCell}${toCell}`;
}

export function decodeMove(msg: string): {
  fromCell: string;
  toCell: string;
  promo: string | null;
} {
  return {
    fromCell: msg.slice(0, 2),
    toCell: msg.slice(2, 4),
    promo: msg[4] ?? null,
  };
}

const UCI_PROMO_MAP: Record<string, Pieces> = {
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
};

const TYPE_TO_UCI_MAP: Partial<Record<Pieces, string>> = {
  queen: "q",
  rook: "r",
  bishop: "b",
  knight: "n",
};

export function uciPromoToType(char: string): Pieces | null {
  return UCI_PROMO_MAP[char] ?? null;
}

export function typeToUciPromo(type: Pieces | undefined): string | undefined {
  if (!type) return undefined;
  return TYPE_TO_UCI_MAP[type];
}
