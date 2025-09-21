import Chess from "@/components/chess/Chess";
import {
  Color,
  PlayerState,
  GameType,
  PieceType,
} from "@/lib/chess-engine/types";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";

export default async function Home() {
  const gameType: GameType = "hotseat";
  const currentTurn: Color = "white";
  const currentTurnNo: number = 1;
  const pieces: PieceType[] = populateBoard("white");
  const playerState: PlayerState | null = {
    type: "guest",
    color: "white",
    status: { check: "NORMAL", draw: "none" },
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen">
      <main className="flex flex-col justify-center items-center">
        <Chess
          pieces={pieces}
          currentTurn={currentTurn}
          currentTurnNo={currentTurnNo}
          plState={playerState}
          gameType={gameType}
        />
      </main>
    </div>
  );
}
