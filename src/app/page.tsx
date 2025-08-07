import Board from "@/components/chess/Board";
import ChessProvider from "@/context/chessContext";
import { Piece, Color, PlayerState } from "@/lib/chess-engine/types";

export default async function Home() {
  const pieces: Piece[] | null = null;
  const currentTurn: Color | null = null;
  const playerState: PlayerState | null = null;

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8">
      <main className="flex flex-col items-center sm:items-start">
        <ChessProvider>
          <Board
            pcs={pieces}
            curTurn={currentTurn}
            pState={playerState}
          />
        </ChessProvider>
      </main>
    </div>
  );
}
