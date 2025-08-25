import Chess from "@/components/chess/Chess";
import AppProviders from "@/context/AppProviders";
import {
  Color,
  PlayerState,
  GameType,
  PieceType,
} from "@/lib/chess-engine/types";

export default async function Home() {
  const pieces: PieceType[] | null = null;
  const currentTurn: Color | null = null;
  const playerState: PlayerState | null = null;
  const gameType: GameType | null = null;

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8">
      <main className="flex flex-col items-center sm:items-start">
        <AppProviders>
          <Chess
            pcs={pieces}
            curTurn={currentTurn}
            plState={playerState}
            gType={gameType}
          />
        </AppProviders>
      </main>
    </div>
  );
}
