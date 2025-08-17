export type IncrementProps = {
  increment: number;
};

export type Player = "host" | "guest";

export type Status = "CHECK" | "CHECKMATE" | "STALEMATE" | "NORMAL";

export type Color = "white" | "black";

export type PlayerState = {
  type: Player;
  color: Color;
  status: Status;
};

export interface BoardState {
  pieces: Piece[];
}

export interface Turn {
  turnNo: number;
  pieceToMove: Piece;
  pieceToTake?: Piece;
  pieceToCastle?: Piece;
  pieceToExchange?: Piece;
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
  threats: Set<string>;
  special?: Castling | EnPassant;
}

export interface BasePiece {
  id: string;
  cell: string;
  color: Color;
  isTaken: boolean;
  moveSet: Set<string>;
}

export interface Pawn extends BasePiece {
  type: "pawn";
  hasMoved: boolean;
  canBeTakenEnPassant: boolean;
}
export interface Rook extends BasePiece {
  type: "rook";
  hasMoved: boolean;
}
export interface King extends BasePiece {
  type: "king";
  hasMoved: boolean;
  isInDanger: boolean;
}
export interface Queen extends BasePiece {
  type: "queen";
}
export interface Knight extends BasePiece {
  type: "knight";
}
export interface Bishop extends BasePiece {
  type: "bishop";
}

export type Piece = Pawn | King | Rook | Queen | Knight | Bishop;
