"use client";
import { GameState, GameType } from "@/lib/chess-engine/types";
import HeaderButton from "./HeaderButton";
import { useGlobalState } from "@/context/GlobalStateContext";

type HeaderType = {
  state: GameState;
  handleModalClick: () => void;
  gameType: GameType;
};

const HeaderBlock: React.FC<HeaderType> = ({
  state,
  handleModalClick,
  gameType,
}) => {
  const { t } = useGlobalState();

  return (
    <div className="bg-amber-150 border-amber-950 p-4 backdrop-blur-lg w-[404px] md:w-[708px] lg:w-[804px] border-4 border-b-0">
      <div className="flex justify-between items-center gap-4 text-sm md:text-base">
        <div className="flex flex-col justify-center items-start lg:flex-row lg:justify-between lg:items-center gap-2 md:gap-4 lg:gap-6 font-semibold">
          <p className="text-start capitalize *:pl-1">
            {t("chess.header.turnNo")}:
            <span className="font-bold">{state.currentTurnNo}</span>
          </p>
          <p className="font-semibold *:pl-1 capitalize">
            {`${t("chess.header.currentTurn")}:`}
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
            title={t("chess.header.restartButton")}
            style="bg-orange-500 hover:bg-orange-700"
            handleClick={handleModalClick}
          />
          {gameType !== "hotseat" && (
            <HeaderButton
              title={t("chess.header.drawButton")}
              style="bg-gray-400 hover:bg-gray-600"
              handleClick={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBlock;
