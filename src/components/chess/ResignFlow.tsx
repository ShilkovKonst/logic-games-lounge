"use client";
import { ActionDispatch } from "react";
import { populateBoard } from "@/lib/chess-engine/core/utils/populateBoard";
import { useP2PContext } from "@/context/P2PContext";
import { useGlobalState } from "@/context/GlobalStateContext";
import { GameAction } from "@/lib/chess-engine/local/reducer/chessReducer";
import FlowOverlay from "./FlowOverlay";
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
  onLeave: () => void;
};

const ResignFlow: React.FC<ResignFlowProps> = ({ phase, setPhase, dispatch, onLeave }) => {
  const { t } = useGlobalState();
  const { sendMove } = useP2PContext();

  const resetBoard = () =>
    dispatch({
      type: "INIT",
      payload: { currentTurn: "white", pieces: populateBoard("white") },
    });

  switch (phase) {
    case null:
      return null;

    case "confirming":
      return (
        <FlowOverlay>
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
                onLeave();
              }}
            />
          </div>
        </FlowOverlay>
      );

    case "waiting":
      return (
        <FlowOverlay>
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
        </FlowOverlay>
      );

    case "declined":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.resign.declined.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.resign.declined.message")}</p>
          <HeaderButton
            title={t("chess.resign.declined.confirm")}
            style="bg-amber-700 hover:bg-amber-600"
            handleClick={onLeave}
          />
        </FlowOverlay>
      );

    case "opponent_resigned":
      return (
        <FlowOverlay>
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
                onLeave();
              }}
            />
          </div>
        </FlowOverlay>
      );

    case "opponent_left_win":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.resign.opponentLeft.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.resign.opponentLeft.message")}</p>
          <HeaderButton
            title={t("chess.resign.opponentLeft.confirm")}
            style="bg-amber-700 hover:bg-amber-600"
            handleClick={onLeave}
          />
        </FlowOverlay>
      );
  }
};

export default ResignFlow;
