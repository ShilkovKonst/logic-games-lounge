/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Color,
  GameType,
  Modal,
  PieceType,
  PlayerState,
} from "@/lib/chess-engine/types";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useEffect, useReducer, useState } from "react";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import TakenPiecesBlock from "./TakenPiecesBlock";
import ModalBlock from "./ModalBlock";
import HeaderBlock from "./HeaderBlock";
import LogBlock from "./LogBlock";
import Board from "./Board";
import {
  blankTurn,
  flip,
  gameReducer,
} from "@/lib/chess-engine/reducer/chessReducer";
import { Locale, t } from "@/lib/locales/locale";
import { useParams } from "next/navigation";

type ChessProps = {
  gameType: GameType;
  currentTurn: Color;
  currentTurnNo: number;
  pieces: PieceType[];
  plState: PlayerState | null;
};

const Chess: React.FC<ChessProps> = ({
  gameType,
  currentTurn,
  currentTurnNo,
  pieces,
  plState,
}) => {
  const { locale } = useParams<{locale: Locale}>();
  const { playerState, setPlayerState } = usePlayerState();
  const [isReset, setIsReset] = useState<boolean>(false);
  const [modal, setModal] = useState<Modal | null>(null);

  const [state, dispatch] = useReducer(gameReducer, {
    currentBoardState: pieces,
    currentTurn: currentTurn,
    currentTurnNo: currentTurnNo,
    currentStatus: {
      check: "NORMAL",
      draw: "none",
    },
    turnDetails: blankTurn(1, "white", pieces),
    log: [],
    selectedPiece: undefined,
    isExchange: false,
  });

  const handleClick = () => {
    dispatch({
      type: "INIT",
      payload: {
        currentTurn: "white",
        pieces: populateBoard("white"),
      },
    });
  };

  const handleModalClick = () => {
    setIsReset(true);
    setModal({
      turn: state.turnDetails,
      title: t(locale, "chess.modal.reset.title"),
      message: t(locale, "chess.modal.reset.message"),
      confirmText: t(locale, "chess.modal.reset.confirm"),
      cancelText: t(locale, "chess.modal.reset.cancel"),
      handleClick,
    });
  };

  useEffect(() => {
    if (
      state.currentStatus.check === "CHECKMATE" ||
      state.currentStatus.draw !== "none"
    ) {
      setIsReset(true);
      setModal({
        turn: state.turnDetails,
        title:
          state.currentStatus.check === "CHECKMATE"
            ? t(locale, "chess.modal.checkmate.title", {
                player: t(locale, `chess.glossary.color.${flip(state.currentTurn)}`),
              })
            : t(locale, "chess.modal.draw.title", {
                draw: t(locale, `chess.glossary.draw.${state.currentStatus.draw}`),
              }),
        message:
          state.currentStatus.check === "CHECKMATE"
            ? t(locale, "chess.modal.checkmate.message")
            : t(locale, "chess.modal.draw.message"),
        confirmText:
          state.currentStatus.check === "CHECKMATE"
            ? t(locale, "chess.modal.checkmate.confirm")
            : t(locale, "chess.modal.draw.confirm"),
        cancelText:
          state.currentStatus.check === "CHECKMATE"
            ? t(locale, "chess.modal.checkmate.cancel")
            : t(locale, "chess.modal.draw.cancel"),
        handleClick,
      });
    }
  }, [state.currentStatus]);

  useEffect(() => {
    plState && setPlayerState(plState);
  }, []);

  return (
    <>
      <div className="relative w-full">
        {isReset && modal && (
          <ModalBlock
            setIsReset={setIsReset}
            confirmClick={modal.handleClick}
            turn={modal.turn}
            title={modal.title}
            message={modal.message}
            confirmText={modal.confirmText}
            cancelText={modal.cancelText}
          />
        )}
      </div>
      <HeaderBlock
        state={state}
        handleModalClick={handleModalClick}
        gameType={gameType}
      />
      <div
        className={`flex flex-row flex-wrap w-[404px] md:w-[708px] lg:w-auto lg:flex-nowrap`}
      >
        <TakenPiecesBlock state={state} />
        <Board state={state} dispatch={dispatch} gameType={gameType} />
        <LogBlock
          state={state}
          dispatch={dispatch}
          setIsReset={setIsReset}
          setModal={setModal}
        />
      </div>
    </>
  );
};

export default Chess;
