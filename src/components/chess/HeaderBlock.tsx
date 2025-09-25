"use client";
import { GameState, GameType } from "@/lib/chess-engine/types";
import HeaderButton from "./HeaderButton";
import { Locale, t } from "@/lib/locales/locale";
import { useParams } from "next/navigation";

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
  const { locale } = useParams<{ locale: Locale }>();

  return (
    <div className="bg-amber-150 border-amber-950 p-4 backdrop-blur-lg w-[404px] md:w-[708px] lg:w-[804px] border-4 border-b-0">
      <div className="flex justify-between items-center gap-4 text-sm md:text-base">
        <div className="flex flex-col justify-center items-start lg:flex-row lg:justify-between lg:items-center gap-2 md:gap-4 lg:gap-6 font-semibold">
          <p className="text-start capitalize *:pl-1">
            {t(locale, "chess.header.turnNo")}:
            <span className="font-bold">{state.currentTurnNo}</span>
          </p>
          <p className="font-semibold *:pl-1 capitalize">
            {`${t(locale, "chess.header.currentTurn")}:`}
            <span
              className={`font-bold ${
                state.currentTurn === "white"
                  ? "text-amber-800"
                  : "text-amber-950"
              } normal-case`}
            >
              {t(locale, `chess.glossary.color.${state.currentTurn}`)}
            </span>
            {state.currentStatus.check !== "NORMAL" && (
              <span className="text-red-600 font-bold normal-case">
                {`\u2192 ${
                  state.currentStatus.check === "CHECKMATE"
                    ? t(locale, "chess.glossary.checkmate")
                    : state.currentStatus.check === "CHECK"
                    ? t(locale, "chess.glossary.check")
                    : state.currentStatus.draw === "stalemate"
                    ? t(locale, "chess.glossary.draw.stalemate")
                    : ""
                }`}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <HeaderButton
            title={t(locale, "chess.header.restartButton")}
            style="bg-orange-500 hover:bg-orange-700"
            handleClick={handleModalClick}
          />
          {gameType !== "hotseat" && (
            <HeaderButton
              title={t(locale, "chess.header.drawButton")}
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
