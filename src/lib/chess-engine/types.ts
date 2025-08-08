export type IncrementProps = {
  increment: number;
};

export type Player = "host" | "guest";

export type Status = "CHECK" | "CHECKMATE" | "STALEMATE" | "NORMAL";

export type PlayerState = {
  type: Player;
  color: Color;
  status: Status;
};

export type Color = "white" | "black";

export type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";

export type BoardMatrix = (Piece | null)[][];

type Castling = {
  type: "castling";
  rookId: string;
};

type EnPassant = {
  type: "enPassant";
  pawnId: string;
};

export interface Cell {
  id: string
  row: number;
  col: number;
  threats: Piece[];
  special?: Castling | EnPassant;
}

export interface Base {
  id: string;
  cell: Cell;
  color: Color;
  isTaken: boolean;
  moveSet: Cell[];
}

export interface Pawn extends Base {
  type: "pawn";
  hasMoved: boolean;
  canBeTakenEnPassant: boolean;
}
export interface Rook extends Base {
  type: "rook";
  hasMoved: boolean;
}
export interface King extends Base {
  type: "king";
  hasMoved: boolean;
  isInDanger: boolean;
}
export interface Queen extends Base {
  type: "queen";
}
export interface Knight extends Base {
  type: "knight";
}
export interface Bishop extends Base {
  type: "bishop";
}

export type Piece = Pawn | King | Rook | Queen | Knight | Bishop;

export interface BoardState {
  pieces: Piece[];
}

export interface Turn {
  turnNo: number;
  pieceToMove: Piece;
  pieceToTake: Piece | undefined;
  pieceToCastle: Piece | undefined;
  pieceToExchange: Piece | undefined;
  fromCell: Cell;
  toCell: Cell;
  exchange: boolean;
  castling: boolean;
  gameState: PlayerState[];
  boardState: BoardState;
}

export interface GameState {
  currentBoardState: BoardState;
  turn: PlayerState;
  log: Turn[];
}
