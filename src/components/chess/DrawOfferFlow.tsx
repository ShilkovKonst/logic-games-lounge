"use client";
import { ActionDispatch } from "react";
import { useP2PContext } from "@/context/P2PContext";
import { useGlobalState } from "@/context/GlobalStateContext";
import { GameAction } from "@/lib/chess-engine/local/reducer/chessReducer";
import { populateBoard } from "@/lib/chess-engine/core/utils/populateBoard";
import FlowOverlay from "./FlowOverlay";
import HeaderButton from "./HeaderButton";

export type DrawOfferPhase =
  | null
  | "waiting"            // initiator: offer sent, waiting for accept/decline
  | "opponent_offered"   // receiver: accept or decline the draw
  | "receiver_choose"    // receiver: accepted → restart or leave?
  | "receiver_waiting"   // receiver: chose restart, waiting for initiator
  | "initiator_waiting"  // initiator: offer accepted, waiting for receiver's restart/leave
  | "initiator_choose"   // initiator: receiver chose restart → restart or leave?
  | "opponent_left"      // either side: opponent left after draw was agreed

type DrawOfferFlowProps = {
  phase: DrawOfferPhase;
  setPhase: (phase: DrawOfferPhase) => void;
  dispatch: ActionDispatch<[action: GameAction]>;
  onLeave: () => void;
};

const DrawOfferFlow: React.FC<DrawOfferFlowProps> = ({ phase, setPhase, dispatch, onLeave }) => {
  const { t } = useGlobalState();
  const { sendMove } = useP2PContext();

  const resetBoard = () => {
    dispatch({ type: "INIT", payload: { currentTurn: "white", pieces: populateBoard("white") } });
    setPhase(null);
  };

  const leave = (msg: string) => {
    sendMove(msg);
    onLeave();
  };

  switch (phase) {
    case null:
      return null;

    case "waiting":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.drawOffer.waiting.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.drawOffer.waiting.message")}</p>
          <HeaderButton
            title={t("chess.drawOffer.waiting.cancel")}
            style="bg-gray-500 hover:bg-gray-600"
            handleClick={() => {
              sendMove("draw_offer:cancel");
              setPhase(null);
            }}
          />
        </FlowOverlay>
      );

    case "opponent_offered":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.drawOffer.opponentOffered.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.drawOffer.opponentOffered.message")}</p>
          <div className="flex gap-4 justify-center">
            <HeaderButton
              title={t("chess.drawOffer.opponentOffered.accept")}
              style="bg-green-600 hover:bg-green-700"
              handleClick={() => {
                sendMove("draw_offer:accept");
                setPhase("receiver_choose");
              }}
            />
            <HeaderButton
              title={t("chess.drawOffer.opponentOffered.decline")}
              style="bg-red-500 hover:bg-red-600"
              handleClick={() => {
                sendMove("draw_offer:decline");
                setPhase(null);
              }}
            />
          </div>
        </FlowOverlay>
      );

    case "receiver_choose":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.drawOffer.receiverChoose.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.drawOffer.receiverChoose.message")}</p>
          <div className="flex gap-4 justify-center">
            <HeaderButton
              title={t("chess.drawOffer.receiverChoose.restart")}
              style="bg-green-600 hover:bg-green-700"
              handleClick={() => {
                sendMove("draw_offer:restart");
                setPhase("receiver_waiting");
              }}
            />
            <HeaderButton
              title={t("chess.drawOffer.receiverChoose.leave")}
              style="bg-red-500 hover:bg-red-600"
              handleClick={() => leave("draw_offer:leave")}
            />
          </div>
        </FlowOverlay>
      );

    case "receiver_waiting":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.drawOffer.receiverWaiting.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.drawOffer.receiverWaiting.message")}</p>
        </FlowOverlay>
      );

    case "initiator_waiting":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.drawOffer.initiatorWaiting.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.drawOffer.initiatorWaiting.message")}</p>
        </FlowOverlay>
      );

    case "opponent_left":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.drawOffer.opponentLeft.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.drawOffer.opponentLeft.message")}</p>
          <HeaderButton
            title={t("chess.drawOffer.opponentLeft.confirm")}
            style="bg-amber-700 hover:bg-amber-600"
            handleClick={onLeave}
          />
        </FlowOverlay>
      );

    case "initiator_choose":
      return (
        <FlowOverlay>
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            {t("chess.drawOffer.initiatorChoose.title")}
          </h3>
          <p className="text-amber-800 mb-6">{t("chess.drawOffer.initiatorChoose.message")}</p>
          <div className="flex gap-4 justify-center">
            <HeaderButton
              title={t("chess.drawOffer.initiatorChoose.restart")}
              style="bg-green-600 hover:bg-green-700"
              handleClick={() => {
                sendMove("draw_offer:confirm");
                resetBoard();
              }}
            />
            <HeaderButton
              title={t("chess.drawOffer.initiatorChoose.leave")}
              style="bg-red-500 hover:bg-red-600"
              handleClick={() => leave("draw_offer:leave")}
            />
          </div>
        </FlowOverlay>
      );
  }
};


export default DrawOfferFlow;
