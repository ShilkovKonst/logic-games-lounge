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

type CastlingType = "short" | "long";

export interface TurnDetails {
  turnNo: number;
  curentPlayer: Color;
  boardState: PieceType[];
  pieceToMove?: string;
  fromCell?: string;
  toCell?: string;
  pieceToTake?: string;
  pieceToExchange?: Pieces;
  castling?: CastlingType;
  draw?: string;
  ambiguity?: string[];
  check?: Color;
  checkmate?: Color;
  isExchange?: boolean;
  isEnPassant?: boolean;
  hash: string;
}

export interface GameState {
  currentBoardState: PieceType[];
  currentTurnNo: number;
  currentTurn: Color;
  turnDetails: TurnDetails;
  log: TurnDetails[][];
  selectedPiece?: PieceType;
  isExchange: boolean;
}

export type Pieces = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export type Castling = {
  type: "castling";
  rookId: string;
  long: boolean;
};

export type EnPassant = {
  type: "enPassant";
  pawnId: string;
};

export interface CellType {
  id: string;
  row: number;
  col: number;
}

export type MoveType = {
  id: string;
  threats: Set<string>;
  special?: Castling | EnPassant;
};

export interface BasePiece {
  id: string;
  cell: MoveType;
  color: Color;
  isTaken: boolean;
  moveSet: MoveType[];
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
