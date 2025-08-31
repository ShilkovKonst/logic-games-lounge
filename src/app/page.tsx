import Chess from "@/components/chess/Chess";
import AppProviders from "@/context/AppProviders";
import {
  Color,
  PlayerState,
  GameType,
  PieceType,
} from "@/lib/chess-engine/types";
import { BOARD } from "@/lib/chess-engine/utils/createBoard";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";

export default async function Home() {
  const gameType: GameType = "hotseat";
  const currentTurn: Color = "white";
  const currentTurnNo: number = 1;
  const pieces: PieceType[] = populateBoard("white", BOARD);
  const playerState: PlayerState | null = null;

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-1">
      <main className="flex flex-col items-center sm:items-start">
        <AppProviders>
          <Chess
            pieces={pieces}
            currentTurn={currentTurn}
            currentTurnNo={currentTurnNo}
            plState={playerState}
            gameType={gameType}
          />
        </AppProviders>
      </main>
    </div>
  );
}
