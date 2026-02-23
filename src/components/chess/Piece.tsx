import { Color, GameType, PieceType } from "@/lib/chess-engine/types";
import { PieceIcon } from "@/lib/chess-engine/constants/icons";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useGlobalState } from "@/context/GlobalStateContext";

type PieceProps = {
  piece: PieceType;
  gameType: GameType;
  currentTurn: Color;
  isSelected: boolean;
  isInMoveSet: boolean;
  isExchange: boolean;
};

const Piece: React.FC<PieceProps> = ({
  isSelected,
  isInMoveSet,
  piece,
  currentTurn,
  isExchange,
  gameType,
}) => {
  const { playerState } = usePlayerState();
  const { t } = useGlobalState();

  const { type, color } = piece;

  const isCurrentPlayer =
    color === currentTurn &&
    (gameType === "hotseat" || currentTurn === playerState.color);

  const pieceStyle =
    piece.color === currentTurn
      ? !isExchange
        ? "piece"
        : ""
      : isInMoveSet
      ? "to-take"
      : "";

  const grabStyle =
    isCurrentPlayer && !isExchange
      ? isSelected
        ? "cursor-grabbing"
        : "cursor-grab"
      : "";
  const canTakeStyle =
    !isCurrentPlayer && isInMoveSet ? "cursor-crosshair" : "";

  const orientationStyle =
    playerState.color === "white" ? "rotate-0" : "rotate-180";

  return (
    <button
      data-piece-id={piece.id}
      title={t(`chess.glossary.pieces.${piece.type}`) + piece.id}
      className={`relative ${pieceStyle} ${grabStyle} ${canTakeStyle} ${orientationStyle} bg-transparent`}
    >
      <PieceIcon color={color} type={type} />
    </button>
  );
};

export default Piece;
