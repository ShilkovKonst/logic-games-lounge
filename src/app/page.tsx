import Board from "@/components/chess/Board";
import AppProviders from "@/context/AppProviders";
import { Piece, Color, PlayerState } from "@/lib/chess-engine/types";

export default async function Home() {
  const pieces: Piece[] | null = null;
  const currentTurn: Color | null = null;
  const playerState: PlayerState | null = null;

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8">
      <main className="flex flex-col items-center sm:items-start">
        <AppProviders>
          <Board
            pcs={pieces}
            curTurn={currentTurn}
            plState={playerState}
          />
        </AppProviders>
      </main>
    </div>
  );
}
