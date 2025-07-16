import Board from "@/components/chess/Board";
import ChessProvider from "@/context/chessContext";
import BishopIcon from "@/lib/chess-engine/icons/BishopIcon";
import KingIcon from "@/lib/chess-engine/icons/KingIcon";
import KnightIcon from "@/lib/chess-engine/icons/KnightIcon";
import PawnIcon from "@/lib/chess-engine/icons/PawnIcon";
import QueenIcon from "@/lib/chess-engine/icons/QueenIcon";
import RookIcon from "@/lib/chess-engine/icons/RookIcon";
import { Piece } from "@/lib/chess-engine/types";

export default async function Home() {
  const pieces: Piece[] | null = null;

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8">
      <main className="flex flex-col items-center sm:items-start">
        <ChessProvider>
          <Board pieces={pieces} />
        </ChessProvider>
      </main>
    </div>
  );
}
