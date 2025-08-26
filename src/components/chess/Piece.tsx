import { CellType, GameState, PieceType } from "@/lib/chess-engine/types";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { useGameState } from "@/context/GameStateContext";
import { usePlayerState } from "@/context/PlayerStateContext";

type PieceProps = {
  cell: CellType;
  piece: PieceType;
  state: GameState;
};

const Piece: React.FC<PieceProps> = ({ cell, piece, state }) => {
  const { type, color } = piece;

  const { playerState } = usePlayerState();
  const { gameType } = useGameState();
  const { selectedPiece, currentTurn, isExchange } = state;

  const isSelected = selectedPiece?.cell.id === cell.id;
  const inMoveSet =
    selectedPiece && selectedPiece.moveSet.some((m) => m.id === cell.id);
  const isCurrentPlayer =
    (gameType === "hotseat" || currentTurn === playerState.color) &&
    color === currentTurn;

  return (
    <div
      className={`${
        piece.color === currentTurn ? "piece" : ""
      } relative flex items-center justify-center text-amber-950 transform ease-in-out duration-300`}
    >
      <button
        data-piece-id={piece.id}
        className={`${piece.color === currentTurn && !isExchange && "piece"} ${
          piece.color !== currentTurn && inMoveSet && "to-take"
        } relative scale-100 ${
          isCurrentPlayer &&
          !isExchange &&
          (isSelected ? "cursor-grabbing" : "cursor-grab")
        } ${!isCurrentPlayer && inMoveSet && "cursor-crosshair"}
          ${
            isCurrentPlayer && "hover:scale-110"
          } bg-transparent transform ease-in-out duration-150 ${
          playerState.color === "white" ? "rotate-0" : "rotate-180"
        }`}
      >
        <PieceIcon color={color} type={type} />
      </button>
    </div>
  );
};

export default Piece;
