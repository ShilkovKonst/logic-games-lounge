import { GameState, GameType, PieceType } from "@/lib/chess-engine/types";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useParams } from "next/navigation";
import { Locale, t } from "@/lib/locales/locale";

type PieceProps = {
  cell: string;
  piece: PieceType;
  state: GameState;
  gameType: GameType;
};

const Piece: React.FC<PieceProps> = ({ cell, piece, state, gameType }) => {
  const { playerState } = usePlayerState();
  const { locale } = useParams<{ locale: Locale }>();

  const { type, color } = piece;
  const { selectedPiece, currentTurn, isExchange } = state;

  const isSelected = selectedPiece?.cell.id === cell;
  const inMoveSet =
    selectedPiece && selectedPiece.moveSet.some((m) => m.id === cell);
  const isCurrentPlayer =
    color === currentTurn &&
    (gameType === "hotseat" || currentTurn === playerState.color);
  return (
    <div
      title={t(locale, `chess.glossary.pieces.${piece.type}`) + piece.id}
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
           bg-transparent transform ease-in-out duration-150 ${
             playerState.color === "white" ? "rotate-0" : "rotate-180"
           }`}
      >
        <PieceIcon color={color} type={type} />
      </button>
    </div>
  );
};

export default Piece;
