"use client";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Color } from "@/lib/chess-engine/types";

type ChessHeaderType = {
  currentTurn: Color;
  currentTurnNo: number;
  handleModalClick: () => void;
};

const ChessHeaderBlock: React.FC<ChessHeaderType> = ({
  currentTurn,
  currentTurnNo,
  handleModalClick,
}) => {
  const { t } = useGlobalState();

  return (
    <div className="bg-white bg-opacity-90 rounded-2xl p-4 mb-4 backdrop-blur-lg shadow-lg">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <p className="text-lg font-semibold text-amber-900">
            {`${t("chess.header.currentTurn")}: `}
            <span className="text-amber-700">
              {t(`chess.glossary.color.${currentTurn}`)}
            </span>
          </p>
          <p className="text-gray-600">
            {t("chess.header.turnNo")}: {currentTurnNo}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleModalClick}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
          >
            {t("chess.header.restartButton")}
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md">
            {t("chess.header.drawButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChessHeaderBlock;
