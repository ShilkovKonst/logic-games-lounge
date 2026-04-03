"use client";
import {
  Color,
  GameType,
  Modal,
  PieceType,
  PlayerState,
} from "@/lib/chess-engine/core/types";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useEffect, useReducer, useRef, useState } from "react";
import { populateBoard } from "@/lib/chess-engine/core/utils/populateBoard";
import TakenPiecesBlock from "./TakenPiecesBlock";
import ModalBlock from "./ModalBlock";
import HeaderBlock from "./HeaderBlock";
import LogBlock from "./LogBlock";
import Board from "./Board";
import {
  blankTurn,
  flip,
  gameReducer,
} from "@/lib/chess-engine/local/reducer/chessReducer";
import { useGlobalState } from "@/context/GlobalStateContext";
import { applyRemoteMove } from "@/lib/chess-engine/online/applyRemoteMove";
import {
  encodeMove,
  typeToUciPromo,
} from "@/lib/chess-engine/core/utils/uciUtil";
import ResignFlow, { ResignPhase } from "./ResignFlow";

type ChessProps = {
  gameType: GameType;
  currentTurn: Color;
  currentTurnNo: number;
  pieces: PieceType[];
  plState: PlayerState | null;
  sendMove?: (msg: string) => void;
  registerRemoteHandler?: (handler: (msg: string) => void) => void;
  onResignActiveChange?: (active: boolean) => void;
};

const Chess: React.FC<ChessProps> = ({
  gameType,
  currentTurn,
  currentTurnNo,
  pieces,
  plState,
  sendMove,
  registerRemoteHandler,
  onResignActiveChange,
}) => {
  const { t } = useGlobalState();
  const { playerState, setPlayerState } = usePlayerState();
  const [isReset, setIsReset] = useState<boolean>(false);
  const [modal, setModal] = useState<Modal | null>(null);
  const [resignPhase, setResignPhase] = useState<ResignPhase>(null);

  // Synchronously notify the parent alongside the phase update
  // to avoid a render gap where resignActive briefly becomes false.
  const setResignPhaseAndNotify = (phase: ResignPhase) => {
    setResignPhase(phase);
    onResignActiveChange?.(phase !== null);
  };

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

  // Always-fresh state ref — used by the remote handler to avoid stale closures
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  // Always-fresh handler ref — updated every render so HMR and new closures
  // are picked up without re-registering the stable wrapper below.
  const remoteHandlerRef = useRef<(msg: string) => void>(() => {});
  remoteHandlerRef.current = (msg: string) => {
    if (msg === "reset") {
      setIsReset(false);
      setModal(null);
      dispatch({ type: "INIT", payload: { currentTurn: "white", pieces: populateBoard("white") } });
      return;
    }
    if (msg === "resign:restart") { setResignPhaseAndNotify("opponent_resigned"); return; }
    if (msg === "resign:leave")   { setResignPhaseAndNotify("opponent_left_win"); return; }
    if (msg === "resign:cancel")  { setResignPhaseAndNotify(null); return; }
    if (msg === "resign:accept")  {
      setResignPhaseAndNotify(null);
      dispatch({ type: "INIT", payload: { currentTurn: "white", pieces: populateBoard("white") } });
      return;
    }
    if (msg === "resign:decline") { setResignPhaseAndNotify("declined"); return; }
    applyRemoteMove(msg, stateRef.current, dispatch);
  };

  // Register a stable wrapper once on mount.
  useEffect(() => {
    registerRemoteHandler?.((msg) => remoteHandlerRef.current(msg));
  }, [registerRemoteHandler]);

  // Send our move to the opponent after every END_TURN
  useEffect(() => {
    if (gameType !== "online" || !sendMove) return;
    const last = state.log.at(-1)?.at(-1);
    if (!last || last.currentPlayer !== playerState.color) return;
    if (!last.fromCell || !last.toCell) return;
    const promo = last.isExchange
      ? typeToUciPromo(last.pieceToExchange)
      : undefined;
    sendMove(encodeMove(last.fromCell, last.toCell, promo));
  }, [state.log, playerState]);

  const handleClick = () => {
    if (gameType === "online" && sendMove) {
      sendMove("reset");
    }
    dispatch({
      type: "INIT",
      payload: { currentTurn: "white", pieces: populateBoard("white") },
    });
  };

  const handleModalClick = () => {
    if (gameType === "online") {
      setResignPhaseAndNotify("confirming");
      return;
    }
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
    if (
      state.currentStatus.check === "CHECKMATE" ||
      state.currentStatus.draw !== "none"
    ) {
      setIsReset(true);
      setModal({
        turn: state.turnDetails,
        title:
          state.currentStatus.check === "CHECKMATE"
            ? t("chess.modal.checkmate.title", {
                player: t(`chess.glossary.color.${flip(state.currentTurn)}`),
              })
            : t("chess.modal.draw.title", {
                draw: t(`chess.glossary.draw.${state.currentStatus.draw}`),
              }),
        message:
          state.currentStatus.check === "CHECKMATE"
            ? t("chess.modal.checkmate.message")
            : t("chess.modal.draw.message"),
        confirmText:
          state.currentStatus.check === "CHECKMATE"
            ? t("chess.modal.checkmate.confirm")
            : t("chess.modal.draw.confirm"),
        cancelText:
          state.currentStatus.check === "CHECKMATE"
            ? t("chess.modal.checkmate.cancel")
            : t("chess.modal.draw.cancel"),
        handleClick,
      });
    }
  }, [state.currentStatus]);

  useEffect(() => {
    plState && setPlayerState(plState);
  }, []);

  return (
    <>
      {gameType === "online" && (
        <ResignFlow phase={resignPhase} setPhase={setResignPhaseAndNotify} dispatch={dispatch} />
      )}
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
          gameType={gameType}
          dispatch={dispatch}
          setIsReset={setIsReset}
          setModal={setModal}
        />
      </div>
    </>
  );
};

export default Chess;
