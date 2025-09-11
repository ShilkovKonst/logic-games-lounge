/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Color,
  GameType,
  Modal,
  PieceType,
  PlayerState,
} from "@/lib/chess-engine/types";
import Board from "./Board";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useEffect, useReducer, useState } from "react";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import { getAllActiveMoveSets } from "@/lib/chess-engine/moveSets/getAllActiveMoveSets";
import TakenPiecesBlock from "./TakenPiecesBlock";
import LogBlock from "./LogBlock";
import {
  blankTurn,
  gameReducer,
} from "@/lib/chess-engine/reducer/chessReducer";
import ConfirmationBox from "./ConfirmationBox";
import { useGlobalState } from "@/context/GlobalStateContext";
import ChessHeaderBlock from "./ChessHeaderBlock";

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
  const { playerState, setPlayerState } = usePlayerState();
  const { t } = useGlobalState();
  const [isReset, setIsReset] = useState<boolean>(false);
  const [modal, setModal] = useState<Modal | null>(null);

  const [state, dispatch] = useReducer(gameReducer, {
    currentBoardState: pieces,
    currentTurn: currentTurn,
    currentTurnNo: currentTurnNo,
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
      title: t("chess.modal.reset.title"),
      message: t("chess.modal.reset.message"),
      confirmText: t("chess.modal.reset.confirm"),
      cancelText: t("chess.modal.reset.cancel"),
      handleClick,
    });
  };

  useEffect(() => {
    if (state.currentBoardState.length > 0)
      getAllActiveMoveSets(state.currentTurn, state.currentBoardState);
  }, [state.log.flat().length]);

  return (
    <>
      <div className="relative w-full flex justify-between bg-cell-dark">
        {isReset && modal && (
          <ConfirmationBox
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
      <ChessHeaderBlock
        currentTurn={state.currentTurn}
        currentTurnNo={state.currentTurnNo}
        handleModalClick={handleModalClick}
      />
      <div
        className={`flex flex-row flex-wrap w-[440px] md:w-[760px] lg:w-auto lg:flex-nowrap`}
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
