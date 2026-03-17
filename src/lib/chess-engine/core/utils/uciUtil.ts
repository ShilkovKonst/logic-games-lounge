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

const UCI_PROMO_MAP: Record<string, string> = {
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
};

export function uciPromoToType(char: string): string {
  return UCI_PROMO_MAP[char] ?? "queen";
}
