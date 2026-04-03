"use client";
import { useParams, useRouter } from "next/navigation";
import { ActionDispatch } from "react";
import { populateBoard } from "@/lib/chess-engine/core/utils/populateBoard";
import { useP2PContext } from "@/context/P2PContext";
import { useGlobalState } from "@/context/GlobalStateContext";
import { GameAction } from "@/lib/chess-engine/local/reducer/chessReducer";
import HeaderButton from "./HeaderButton";

export type ResignPhase =
  | null
  | "confirming"        // initiator: asking what to do
  | "waiting"           // initiator: waiting for opponent response
  | "declined"          // initiator: opponent declined restart
  | "opponent_resigned" // receiver: opponent wants restart
  | "opponent_left_win" // receiver: opponent resigned and left

type ResignFlowProps = {
  phase: ResignPhase;
  setPhase: (phase: ResignPhase) => void;
  dispatch: ActionDispatch<[action: GameAction]>;
};

const ResignFlow: React.FC<ResignFlowProps> = ({ phase, setPhase, dispatch }) => {
  const { t } = useGlobalState();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { sendMove, leaveGame } = useP2PContext();

  const resetBoard = () =>
    dispatch({
      type: "INIT",
      payload: { currentTurn: "white", pieces: populateBoard("white") },
    });

  const navigateHome = () => {
    leaveGame();
    router.push(`/${locale}`);
  };

  if (!phase) return null;

  if (phase === "confirming") {
    return (
      <Overlay>
        <h3 className="text-xl font-semibold text-amber-900 mb-6">
          {t("chess.resign.confirming.title")}
        </h3>
        <div className="flex gap-4 justify-center">
          <HeaderButton
            title={t("chess.resign.confirming.restart")}
            style="bg-orange-500 hover:bg-orange-700"
            handleClick={() => {
              sendMove("resign:restart");
              setPhase("waiting");
            }}
          />
          <HeaderButton
            title={t("chess.resign.confirming.leave")}
            style="bg-red-500 hover:bg-red-600"
            handleClick={() => {
              sendMove("resign:leave");
              navigateHome();
            }}
          />
        </div>
      </Overlay>
    );
  }

  if (phase === "waiting") {
    return (
      <Overlay>
        <h3 className="text-xl font-semibold text-amber-900 mb-4">
          {t("chess.resign.waiting.title")}
        </h3>
        <p className="text-amber-800 mb-6">{t("chess.resign.waiting.message")}</p>
        <HeaderButton
          title={t("chess.resign.waiting.cancel")}
          style="bg-gray-500 hover:bg-gray-600"
          handleClick={() => {
            sendMove("resign:cancel");
            setPhase(null);
          }}
        />
      </Overlay>
    );
  }

  if (phase === "declined") {
    return (
      <Overlay>
        <h3 className="text-xl font-semibold text-amber-900 mb-4">
          {t("chess.resign.declined.title")}
        </h3>
        <p className="text-amber-800 mb-6">{t("chess.resign.declined.message")}</p>
        <HeaderButton
          title={t("chess.resign.declined.confirm")}
          style="bg-amber-700 hover:bg-amber-600"
          handleClick={navigateHome}
        />
      </Overlay>
    );
  }

  if (phase === "opponent_resigned") {
    return (
      <Overlay>
        <h3 className="text-xl font-semibold text-amber-900 mb-4">
          {t("chess.resign.opponentResigned.title")}
        </h3>
        <p className="text-amber-800 mb-6">{t("chess.resign.opponentResigned.message")}</p>
        <div className="flex gap-4 justify-center">
          <HeaderButton
            title={t("chess.resign.opponentResigned.accept")}
            style="bg-green-600 hover:bg-green-700"
            handleClick={() => {
              sendMove("resign:accept");
              resetBoard();
              setPhase(null);
            }}
          />
          <HeaderButton
            title={t("chess.resign.opponentResigned.decline")}
            style="bg-red-500 hover:bg-red-600"
            handleClick={() => {
              sendMove("resign:decline");
              navigateHome();
            }}
          />
        </div>
      </Overlay>
    );
  }

  if (phase === "opponent_left_win") {
    return (
      <Overlay>
        <h3 className="text-xl font-semibold text-amber-900 mb-4">
          {t("chess.resign.opponentLeft.title")}
        </h3>
        <p className="text-amber-800 mb-6">{t("chess.resign.opponentLeft.message")}</p>
        <HeaderButton
          title={t("chess.resign.opponentLeft.confirm")}
          style="bg-amber-700 hover:bg-amber-600"
          handleClick={navigateHome}
        />
      </Overlay>
    );
  }

  return null;
};

const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
    <div className="bg-amber-50 bg-opacity-95 rounded-3xl p-8 text-center shadow-2xl max-w-md w-11/12 mx-4">
      {children}
    </div>
  </div>
);

export default ResignFlow;
