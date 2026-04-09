"use client";
import { GameState, GameType } from "@/lib/chess-engine/core/types";
import HeaderButton from "./HeaderButton";
import { useGlobalState } from "@/context/GlobalStateContext";
import { usePlayerState } from "@/context/PlayerStateContext";
import HourglassIcon from "@/lib/icons/HourglassIcon";

type HeaderType = {
  state: GameState;
  handleModalClick: () => void;
  handleDrawOfferClick: () => void;
  gameType: GameType;
  isResignActive?: boolean;
  isDrawActive?: boolean;
};

const HeaderBlock: React.FC<HeaderType> = ({
  state,
  handleModalClick,
  handleDrawOfferClick,
  gameType,
  isResignActive = false,
  isDrawActive = false,
}) => {
  const { t } = useGlobalState();
  const { playerState } = usePlayerState();

  const isMyTurn =
    gameType === "hotseat" || state.currentTurn === playerState.color;

  return (
    <div className="bg-amber-150 border-amber-950 p-4 w-[404px] md:w-[708px] lg:w-[804px] border-4 border-b-0">
      <div className="flex justify-between items-center gap-4 text-sm md:text-base h-full">
        <div className="flex flex-col justify-between items-start font-semibold h-full">
          {gameType === "online" && (
            <p className="font-semibold mb-2">
              {t("chess.header.playingAs")}
              <span
                className={`font-bold uppercase ${
                  playerState.color === "white"
                    ? "text-amber-800"
                    : "text-amber-950"
                }`}
              >
                {t(`chess.glossary.color.${playerState.color}`)}
              </span>
              {!isMyTurn && (
                <span className="inline-flex items-center gap-1 font-semibold normal-case pl-1">
                  {t("chess.header.waiting")}
                </span>
              )}
            </p>
          )}
          <p className="text-start capitalize *:pl-1">
            {t("chess.header.turnNo")}:
            <span className="font-bold">{state.currentTurnNo}</span> -
            <span
              className={`font-bold ${
                state.currentTurn === "white"
                  ? "text-amber-800"
                  : "text-amber-950"
              } normal-case`}
            >
              {t(`chess.glossary.color.${state.currentTurn}`)}
            </span>
            {state.currentStatus.check !== "NORMAL" && (
              <span className="text-red-600 font-bold normal-case">
                {`\u2192 ${
                  state.currentStatus.check === "CHECKMATE"
                    ? t("chess.glossary.checkmate")
                    : state.currentStatus.check === "CHECK"
                      ? t("chess.glossary.check")
                      : state.currentStatus.draw === "stalemate"
                        ? t("chess.glossary.draw.stalemate")
                        : ""
                }`}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <HeaderButton
            title={
              gameType === "online"
                ? t("chess.resign.button")
                : t("chess.header.restartButton")
            }
            style="bg-orange-500 hover:bg-orange-700"
            handleClick={handleModalClick}
            disabled={isResignActive || isDrawActive}
          />
          {gameType === "online" && (
            <HeaderButton
              title={t("chess.drawOffer.button")}
              style="bg-gray-400 hover:bg-gray-600"
              handleClick={handleDrawOfferClick}
              disabled={isResignActive || isDrawActive}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBlock;
