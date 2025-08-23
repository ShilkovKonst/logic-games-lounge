export type IncrementProps = {
  increment: number;
};

export type Player = "host" | "guest";

export type GameType = "hotseat" | "online";

export type Status = "CHECK" | "CHECKMATE" | "STALEMATE" | "NORMAL";

export type Color = "white" | "black";

export type ColorState = {
  color: Color;
  status: Status;
};

export type PlayerState = {
  type: Player;
  color: Color;
  status: Status;
};

export interface BoardState {
  pieces: PieceType[];
}

export interface Turn {
  turnNo: number;
  pieceToMove: PieceType;
  pieceToTake?: PieceType;
  pieceToCastle?: PieceType;
  pieceToExchange?: PieceType;
  fromCell: CellType;
  toCell: CellType;
  exchange: boolean;
  castling: boolean;
  gameState: PlayerState[];
  boardState: BoardState;
}

export interface GameState {
  gameType: GameType;
  currentBoardState: BoardState;
  currentTurn: Color;
  log: Turn[];
  winner: Color;
}

export type Pieces =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";

type Castling = {
  type: "castling";
  rookId: string;
};

type EnPassant = {
  type: "enPassant";
  pawnId: string;
};

export interface CellType {
  id: string;
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
  moveSet: string[];
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

export type PieceType = Pawn | King | Rook | Queen | Knight | Bishop;
