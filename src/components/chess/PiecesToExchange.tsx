import { useGameState } from "@/context/GameStateContext";
import { usePlayerState } from "@/context/PlayerStateContext";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { PieceType } from "@/lib/chess-engine/types";

const PiecesToExchange: React.FC = () => {
  const { currentTurn } = useGameState();
  const { playerState } = usePlayerState();

  const piecesToExchange: PieceType[] = [
    {
      id: "",
      cell: "",
      color: currentTurn,
      isTaken: true,
      type: "rook",
      hasMoved: true,
      moveSet: [],
    },
    {
      id: "",
      cell: "",
      color: currentTurn,
      isTaken: true,
      type: "bishop",
      moveSet: [],
    },
    {
      id: "",
      cell: "",
      color: currentTurn,
      isTaken: true,
      type: "knight",
      moveSet: [],
    },
    {
      id: "",
      cell: "",
      color: currentTurn,
      isTaken: true,
      type: "queen",
      moveSet: [],
    },
  ];

  return (
    <div
      className={`z-10 absolute ${
        playerState.color === "white" ? "top-1/2" : "bottom-1/2"
      }  m-1 left-1/2 transform -translate-x-1/2 bg-amber-200 flex justify-evenly items-center border-2 border-amber-800 `}
    >
      {piecesToExchange.map((p, i) => (
        <button
          key={i}
          data-exchange-to={p.type}
          className={`exchange-to ${
            playerState.color === "white" ? "rotate-0" : "rotate-180"
          } cursor-pointer p-1 inset-shadow-cell-ambermedium hover:bg-amber-600 hover:opacity-90`}
        >
          <PieceIcon color={p.color} type={p.type} />
        </button>
      ))}
    </div>
  );
};

export default PiecesToExchange;
