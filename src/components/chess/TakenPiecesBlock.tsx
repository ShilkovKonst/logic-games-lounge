"use client";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { Color, GameState, PieceType } from "@/lib/chess-engine/types";

type TakenPiecesBlockProps = {
  state: GameState;
};

const TakenPiecesBlock: React.FC<TakenPiecesBlockProps> = ({ state }) => {
  const { currentBoardState } = state;
  return (
    <div
      className="flex justify-between border-b-4 border-l-4 border-amber-950 bg-amber-150
                order-2 h-[448px] flex-row w-[150px] border-r-4
                md:order-3 md:flex-col md:w-[758px] md:h-[96px] md:border-r-4
                lg:flex-row lg:order-1 lg:h-[508px] lg:w-[96px] lg:border-t-4 lg:border-r-0 "
    >
      <TakenPieces pieces={currentBoardState} player="black" />
      <TakenPieces pieces={currentBoardState} player="white" />
    </div>
  );
};

export default TakenPiecesBlock;

type TakenPiecesProps = {
  pieces: PieceType[];
  player: Color;
};

const TakenPieces: React.FC<TakenPiecesProps> = ({ pieces, player }) => {
  const taken = pieces.filter((p) => p.color !== player && p.isTaken).sort((a, b) => a.type.localeCompare(b.type));

  return (
    <div className="flex flex-col flex-wrap md:flex-row lg:flex-col px-1">
      {taken.map((p, i) => (
        <button
          key={i}
          className="flex justify-center items-center w-8 h-8 md:w-11 md:h-11 lg:w-8 lg:h-8"
        >
          <PieceIcon
            color={player === "white" ? "black" : "white"}
            type={p.type}
          />
        </button>
      ))}
    </div>
  );
};
