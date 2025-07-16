import mongoose, { Schema, Document } from "mongoose";

export type PlayerColor = "white" | "black";

export interface IMove {
  from: string;
  to: string;
  piece: string; // например "pawn"
  captured?: string;
  timestamp: Date;
}

export interface IChessPiece {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: PlayerColor;  // теперь "white" или "black"
  position: string;    // например "e4"
  captured: boolean;
}

export interface IGameSession extends Document {
  sessionId: string;
  players: {
    host: string;         // кто создал сессию
    guest?: string;       // кто присоединился
    colors: {             // кто каким цветом играет
      host: PlayerColor;
      guest: PlayerColor;
    };
  };
  gameType: "chess" | "tic-tac-toe";
  gameState: {
    pieces: IChessPiece[];
    turn: PlayerColor;   // теперь очередь белых или чёрных
    moves: IMove[];
  };
  status: "waiting" | "in_progress" | "finished";
  winner?: PlayerColor | "draw"; // победитель — белые или чёрные
  createdAt: Date;
  updatedAt: Date;
}

// Подсхема для фигуры
const PieceSchema = new Schema<IChessPiece>({
  type: {
    type: String,
    enum: ["pawn", "rook", "knight", "bishop", "queen", "king"],
    required: true,
  },
  color: { type: String, enum: ["white", "black"], required: true },
  position: { type: String, required: true },
  captured: { type: Boolean, default: false },
});

// Подсхема для хода
const MoveSchema = new Schema<IMove>({
  from: String,
  to: String,
  piece: String,
  captured: String,
  timestamp: { type: Date, default: Date.now },
});

const GameSessionSchema = new Schema<IGameSession>(
  {
    sessionId: { type: String, unique: true, required: true },
    players: {
      host: { type: String, required: true },
      guest: { type: String },
      colors: {
        host: { type: String, enum: ["white", "black"], required: true },
        guest: { type: String, enum: ["white", "black"], required: true },
      },
    },
    gameType: {
      type: String,
      enum: ["chess", "tic-tac-toe"],
      default: "chess",
    },
    gameState: {
      pieces: [PieceSchema],
      turn: { type: String, enum: ["white", "black"], default: "white" },
      moves: [MoveSchema],
    },
    status: {
      type: String,
      enum: ["waiting", "in_progress", "finished"],
      default: "waiting",
    },
    winner: { type: String, enum: ["white", "black", "draw"] },
  },
  { timestamps: true }
);

export const GameSession =
  mongoose.models.GameSession ||
  mongoose.model<IGameSession>("GameSession", GameSessionSchema);