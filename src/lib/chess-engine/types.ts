export type IncrementProps = {
  increment: number;
};

export type Player = "host" | "guest";

export type PieceColor = "white" | "black";

export type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";

export type BoardMatrix = (Piece | null)[][]; // [row][col]

export interface Cell {
  row: number;
  col: number;
}

export interface Piece {
  cell: Cell;
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}
export interface BoardState {
  pieces: Piece[];
}
export interface GameState {
  board: BoardState;
  turn: Player;
  castling: {
    whiteKingSide: boolean;
    whiteQueenSide: boolean;
    blackKingSide: boolean;
    blackQueenSide: boolean;
  };
  enPassantTarget?: Cell | null; // клетка для взятия на проходе
  halfmoveClock: number; // для правила 50 ходов
  fullmoveNumber: number; // увеличивается после хода черных
}

export interface Move {
  from: Cell;
  to: Cell;
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
