"use client";
import {
  Color,
  GameType,
  Modal,
  PieceType,
  PlayerState,
} from "@/lib/chess-engine/core/types";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
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
import { applyMovePure } from "@/lib/chess-engine/online/applyMovePure";
import {
  encodeMove,
  typeToUciPromo,
} from "@/lib/chess-engine/core/utils/uciUtil";
import { createInitialState } from "@/lib/chess-engine/local/reducer/chessReducer";
import ResignFlow, { ResignPhase } from "./ResignFlow";
import DrawOfferFlow, { DrawOfferPhase } from "./DrawOfferFlow";

type ChessProps = {
  gameType: GameType;
  currentTurn: Color;
  currentTurnNo: number;
  pieces: PieceType[];
  plState: PlayerState | null;
  sendMove?: (msg: string) => void;
  registerRemoteHandler?: (handler: (msg: string) => void) => void;
  registerSyncProvider?: (fn: () => string) => void;
  registerSyncHandler?: (fn: (moves: string[]) => void) => void;
  onResignActiveChange?: (active: boolean) => void;
  onDrawActiveChange?: (active: boolean) => void;
  onLeave?: () => void;
};

const Chess: React.FC<ChessProps> = ({
  gameType,
  currentTurn,
  currentTurnNo,
  pieces,
  plState,
  sendMove,
  registerRemoteHandler,
  registerSyncProvider,
  registerSyncHandler,
  onResignActiveChange,
  onDrawActiveChange,
  onLeave,
}) => {
  const { t } = useGlobalState();
  const { playerState, setPlayerState } = usePlayerState();
  const [isReset, setIsReset] = useState<boolean>(false);
  const [modal, setModal] = useState<Modal | null>(null);
  const [resignPhase, setResignPhase] = useState<ResignPhase>(null);
  const [drawPhase, setDrawPhase] = useState<DrawOfferPhase>(null);

  const setResignPhaseAndNotify = (phase: ResignPhase) => {
    setResignPhase(phase);
    onResignActiveChange?.(phase !== null);
  };

  const setDrawPhaseAndNotify = (phase: DrawOfferPhase) => {
    setDrawPhase(phase);
    onDrawActiveChange?.(phase !== null);
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

  // Always-fresh handler ref — updated every render so HMR and new closures
  // are picked up without re-registering the stable wrapper below.
  const remoteHandlerRef = useRef<(msg: string) => void>(() => {});
  remoteHandlerRef.current = (msg: string) => {
    switch (msg) {
      case "reset":
        setIsReset(false);
        setModal(null);
        dispatch({
          type: "INIT",
          payload: { currentTurn: "white", pieces: populateBoard("white") },
        });
        break;
      case "resign:restart":
        setResignPhaseAndNotify("opponent_resigned");
        break;
      case "resign:leave":
        setResignPhaseAndNotify("opponent_left_win");
        break;
      case "resign:cancel":
        setResignPhaseAndNotify(null);
        break;
      case "resign:accept":
        setResignPhaseAndNotify(null);
        dispatch({
          type: "INIT",
          payload: { currentTurn: "white", pieces: populateBoard("white") },
        });
        break;
      case "resign:decline":
        setResignPhaseAndNotify("declined");
        break;
      case "draw_offer":
        setDrawPhaseAndNotify("opponent_offered");
        break;
      case "draw_offer:cancel":
      case "draw_offer:decline":
        setDrawPhaseAndNotify(null);
        break;
      case "draw_offer:accept":
        setDrawPhaseAndNotify("initiator_waiting");
        break;
      case "draw_offer:restart":
        setDrawPhaseAndNotify("initiator_choose");
        break;
      case "draw_offer:leave":
        setDrawPhaseAndNotify("opponent_left");
        break;
      case "draw_offer:confirm":
        setDrawPhaseAndNotify(null);
        dispatch({
          type: "INIT",
          payload: { currentTurn: "white", pieces: populateBoard("white") },
        });
        break;
      default:
        applyRemoteMove(msg, stateRef.current, dispatch);
    }
  };

  const handleClick = useCallback(() => {
    if (gameType === "online" && sendMove) {
      sendMove("reset");
    }
    dispatch({
      type: "INIT",
      payload: { currentTurn: "white", pieces: populateBoard("white") },
    });
  }, [gameType, sendMove]);

  const handleDrawOfferClick = () => {
    if (!sendMove) return;
    sendMove("draw_offer");
    setDrawPhaseAndNotify("waiting");
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
    stateRef.current = state;
  });

  // Register a stable wrapper once on mount.
  useEffect(() => {
    registerRemoteHandler?.((msg) => remoteHandlerRef.current(msg));
  }, [registerRemoteHandler]);

  // Host: provide the current move log for sync on reconnect (reads stateRef — always fresh).
  useEffect(() => {
    if (gameType !== "online") return;
    registerSyncProvider?.(() => {
      const moves: string[] = [];
      for (const turnPair of stateRef.current.log) {
        for (const turn of turnPair) {
          if (turn.fromCell && turn.toCell) {
            const promo = turn.isExchange ? typeToUciPromo(turn.pieceToExchange) : undefined;
            moves.push(encodeMove(turn.fromCell, turn.toCell, promo));
          }
        }
      }
      return JSON.stringify({ type: "sync", moves });
    });
  }, [gameType, registerSyncProvider]);

  // Guest: replay all moves from sync and load the resulting state in one dispatch.
  useEffect(() => {
    if (gameType !== "online") return;
    registerSyncHandler?.((moves) => {
      let syncState = createInitialState(populateBoard("white"), "white", 1, []);
      for (const uci of moves) {
        syncState = applyMovePure(uci, syncState);
      }
      dispatch({ type: "SYNC", payload: syncState });
    });
  }, [gameType, registerSyncHandler]);

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
  }, [state.log, playerState, gameType, sendMove]);

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
          gameType === "online"
            ? t("chess.online.leave.confirm")
            : state.currentStatus.check === "CHECKMATE"
              ? t("chess.modal.checkmate.cancel")
              : t("chess.modal.draw.cancel"),
        handleClick,
        cancelClick: gameType === "online" ? onLeave : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameType,
    handleClick,
    onLeave,
    state.currentStatus,
    state.currentTurn,
    t,
  ]);

  useEffect(() => {
    if (plState) setPlayerState(plState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPlayerState]);

  return (
    <>
      {gameType === "online" && onLeave && (
        <ResignFlow
          phase={resignPhase}
          setPhase={setResignPhaseAndNotify}
          dispatch={dispatch}
          onLeave={onLeave}
        />
      )}
      {gameType === "online" && onLeave && (
        <DrawOfferFlow
          phase={drawPhase}
          setPhase={setDrawPhaseAndNotify}
          dispatch={dispatch}
          onLeave={onLeave}
        />
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
            cancelClick={modal.cancelClick}
          />
        )}
      </div>
      <HeaderBlock
        state={state}
        handleModalClick={handleModalClick}
        handleDrawOfferClick={handleDrawOfferClick}
        gameType={gameType}
        isResignActive={resignPhase !== null}
        isDrawActive={drawPhase !== null}
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
