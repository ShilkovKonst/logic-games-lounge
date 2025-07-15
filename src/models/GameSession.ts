import mongoose, { Schema, Document } from "mongoose";

export interface IMove {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  timestamp: Date;
}

export interface IGameSession extends Document {
  sessionId: string;
  players: {
    white: string;
    black?: string;
  };
  gameType: "chess" | "tic-tac-toe";
  gameState: {
    board: string[][];
    turn: "white" | "black";
    moves: IMove[];
  };
  status: "waiting" | "in_progress" | "finished";
  winner?: "white" | "black" | "draw";
  createdAt: Date;
  updatedAt: Date;
}

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
    },
    gameType: {
      type: String,
      enum: ["chess", "tic-tac-toe"],
      default: "chess",
    },
    gameState: {
      board: [[String]],
      turn: { type: String, enum: ["host", "guest"], default: "host" },
      moves: [MoveSchema],
    },
    status: {
      type: String,
      enum: ["waiting", "in_progress", "finished"],
      default: "waiting",
    },
    winner: { type: String, enum: ["host", "guest", "draw"] },
  },
  { timestamps: true }
);

export const GameSession =
  mongoose.models.GameSession ||
  mongoose.model<IGameSession>("GameSession", GameSessionSchema);
