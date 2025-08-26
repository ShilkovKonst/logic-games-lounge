"use client";
import { useGameState } from "@/context/GameStateContext";
import { GameState } from "@/lib/chess-engine/types";

type LogBlockProps = { state: GameState };

const LogBlock: React.FC<LogBlockProps> = ({ state }) => {
  const { log } = state;


  return (
    <div className="col-start-13 col-span-4 flex flex-col justify-start">
      {log.map((turn, i) => (
        <div key={i} className="text-xs">
          <p>
            {turn.turnNo} - {turn.curentPlayer}
          </p>
          <p>
            {turn.pieceToMove?.slice(0, -2)} from {turn.fromCell} to{" "}
            {turn.toCell} {turn.pieceToTake && `take ${turn.pieceToTake}`}{" "}
            {turn.enPassant ? " en passant" : ""}
          </p>
          {turn.castling && <p>{turn.castling} castling </p>}
          {turn.exchange && <p>exchange to {turn.pieceToExchange}</p>}
        </div>
      ))}
    </div>
  );
};

export default LogBlock;
