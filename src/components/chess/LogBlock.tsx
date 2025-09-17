"use client";
import { GameState, Modal, TurnDetails } from "@/lib/chess-engine/types";
import { GameAction } from "@/lib/chess-engine/reducer/chessReducer";
import {
  ActionDispatch,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import LogRecord from "./LogRecord";

type LogBlockProps = {
  state: GameState;
  dispatch: ActionDispatch<[action: GameAction]>;
  setIsReset: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<Modal | null>>;
};

const LogBlock: React.FC<LogBlockProps> = ({
  state,
  dispatch,
  setIsReset,
  setModal,
}) => {
  const { log } = state;
  const { t } = useGlobalState();

  const handleClick = (turn: TurnDetails) => {
    const fullTurnIndex = turn.turnNo - 1;
    let oldLog: TurnDetails[][];

    if (turn.curentPlayer === "white") {
      oldLog = log.slice(0, fullTurnIndex);
    } else {
      oldLog = log.slice(0, fullTurnIndex);
      if (log[fullTurnIndex]) {
        oldLog.push([log[fullTurnIndex][0]]);
      }
    }
    dispatch({
      type: "RESET",
      payload: {
        currentTurn: turn.curentPlayer,
        pieces: turn.boardState,
        turnNo: turn.turnNo,
        log: oldLog,
      },
    });
  };

  const handleModalClick = (turn: TurnDetails) => {
    setIsReset(true);
    setModal({
      turn,
      title: t("chess.modal.undo.title"),
      message: t("chess.modal.undo.message"),
      confirmText: t("chess.modal.undo.confirm"),
      cancelText: t("chess.modal.undo.cancel"),
      handleClick,
    });
  };

  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [log]);

  return (
    <div
      ref={logRef}
      className="log overflow-x-hidden pr-[10px] flex flex-col justify-start items-start order-3 bg-amber-150 border-amber-950 border-b-4 border-r-4 overflow-y-auto
                w-[254px] h-[454px] border-t-0
                md:w-[250px] md:h-[458px] md:order-2 md:border-t-4"
    >
      {log.map((turns, i) => (
        <div
          key={i}
          className="flex justify-between w-[242px] md:w-[236px] my-[5px]"
        >
          {turns.map((turn, j) => (
            <LogRecord
              key={j}
              turn={turn}
              handleClick={() => handleModalClick(turn)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LogBlock;
