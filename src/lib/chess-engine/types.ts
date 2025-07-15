export type Color = "white" | "black";

export type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";

export type BoardMatrix = (Piece | null)[][]; // [row][col]

export interface Square {
  row: number;
  col: number;
}

export interface Piece {
  type: PieceType;
  color: Color;
  hasMoved?: boolean;
}

export interface GameState {
  board: BoardMatrix;
  turn: Color;
  castling: {
    whiteKingSide: boolean;
    whiteQueenSide: boolean;
    blackKingSide: boolean;
    blackQueenSide: boolean;
  };
  enPassantTarget?: Square | null; // клетка для взятия на проходе
  halfmoveClock: number; // для правила 50 ходов
  fullmoveNumber: number; // увеличивается после хода черных
}

export interface Move {
  from: Square;
  to: Square;
  promotion?: PieceType; // если пешка превращается
  isCapture?: boolean;
  isEnPassant?: boolean;
  isCastling?: boolean;
}

export interface MoveResult {
  success: boolean;
  move?: Move;
  newState?: GameState;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isStalemate?: boolean;
  error?: string; // например "Illegal move" или "Not your turn"
}