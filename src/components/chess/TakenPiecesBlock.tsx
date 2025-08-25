"use client";
import { useBoardState } from "@/context/BoardStateContext";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { Color, PieceType } from "@/lib/chess-engine/types";

const TakenPiecesBlock = () => {
  const { pieces } = useBoardState();
  return (
    <div className="col-span-2 flex flex-col justify-between">
      <TakenPieces pieces={pieces} player="black" />
      <TakenPieces pieces={pieces} player="white" />
    </div>
  );
};

export default TakenPiecesBlock;

type TakenPiecesProps = {
  pieces: PieceType[];
  player: Color;
};

const TakenPieces: React.FC<TakenPiecesProps> = ({ pieces, player }) => {
  const takenPawns = pieces.filter(
    (p) => p.color !== player && p.isTaken && p.type === "pawn"
  );
  const takenPieces = pieces.filter(
    (p) => p.color !== player && p.isTaken && p.type !== "pawn"
  );

  return (
    <div className="flex max-h-60 md:max-h-70">
      <div className="flex flex-col">
        {takenPawns.map((p, i) => (
          <button key={i} className="w-9 h-9">
            <PieceIcon
              color={player === "white" ? "black" : "white"}
              isTaken={true}
              type={p.type}
            />
          </button>
        ))}
      </div>
      <div className="flex flex-col flex-wrap">
        {takenPieces.map((p, i) => (
          <button key={i} className="w-9 h-9 flex">
            <PieceIcon
              color={player === "white" ? "black" : "white"}
              isTaken={true}
              type={p.type}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
