import Board from "@/components/chess/Board";
import { Piece } from "@/lib/chess-engine/types";
import Image from "next/image";

export default async function Home() {

  const pieces: Piece[] | null = null;

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8">
      <main className="flex flex-col items-center sm:items-start">
        <Board pieces={pieces} />
      </main>
    </div>
  );
}
