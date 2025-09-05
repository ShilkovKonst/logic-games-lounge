"use client";
import { UndoIcon } from "@/lib/chess-engine/constants/icons";
import { getDisambiguation, getSAN } from "@/lib/chess-engine/constants/san";
import { GameState, Pieces, TurnDetails } from "@/lib/chess-engine/types";
import { GameAction } from "@/reducer/chessReducer";
import { ActionDispatch, useEffect, useRef } from "react";

type LogBlockProps = {
  state: GameState;
  dispatch: ActionDispatch<[action: GameAction]>;
};

const LogBlock: React.FC<LogBlockProps> = ({ state, dispatch }) => {
  const { log } = state;

  const title = (turn: TurnDetails) => {
    const {
      turnNo,
      curentPlayer,
      castling,
      fromCell,
      toCell,
      pieceToMove,
      pieceToTake,
      pieceToExchange,
      check,
      checkmate,
      isExchange,
      isEnPassant,
      isDraw,
    } = turn;

    return `${turnNo} - ${curentPlayer} ${pieceToMove?.slice(
      0,
      -2
    )} moves from ${fromCell} to ${toCell}${
      pieceToTake ? ` takes ${pieceToTake?.slice(0, -2)}` : ""
    }${isEnPassant ? " en passant" : ""}${
      castling ? ` ${castling} castling` : ""
    }${isExchange ? ` exchange to ${pieceToExchange}` : ""}${
      check && !checkmate ? ` check to ${check}` : ""
    }${checkmate ? ` checkmate to ${checkmate}` : ""}${isDraw ? ` draw` : ""}`;
  };

  const san = (turn: TurnDetails) => {
    const {
      isDraw,
      isExchange,
      castling,
      isEnPassant,
      fromCell,
      toCell,
      pieceToMove,
      pieceToTake,
      pieceToExchange,
      check,
      checkmate,
      ambiguity,
    } = turn;
    const pieceType: Pieces | undefined = pieceToMove?.slice(0, -2) as Pieces;
    const pieceSAN = getSAN(pieceType);
    const disambiguation =
      fromCell && ambiguity && getDisambiguation(fromCell, ambiguity);

    let sanString = "";
    if (isDraw) return "1/2 - 1/2";
    else if (castling) sanString = castling === "long" ? "O-O-O" : "O-O";
    else if (isExchange) {
      const exchangeSAN = pieceToExchange && getSAN(pieceToExchange);
      sanString = pieceToTake
        ? `${pieceSAN}${fromCell?.charAt(0)}x${toCell}=${exchangeSAN}`
        : `${pieceSAN}${toCell}=${exchangeSAN}`;
    } else {
      sanString = `${pieceSAN}${disambiguation}${
        pieceToTake ? (pieceSAN ? "x" : `${fromCell?.charAt(0)}x`) : ""
      }${toCell}`;
    }

    if (check && !checkmate) sanString += "+";
    else if (checkmate) sanString += "#";

    if (pieceToTake && isEnPassant) sanString += " e.p.";
    return sanString;
  };

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
                w-[298px] h-[454px] border-t-0
                md:w-[250px] md:h-[508px] md:order-2 md:border-t-4"
    >
      {log.map((turns, i) => (
        <div
          key={i}
          className="flex justify-between w-[294px] md:w-[236px] my-[5px]"
        >
          {turns.map((turn, j) => (
            <div
              key={j}
              className="flex justify-start items-center gap-1 w-[130px] md:w-[112px] h-10 rounded-full  mx-1 bg-linear-to-r from-amber-700 to-transparent hover:from-transparent hover:to-amber-700 transition ease-in-out duration-150"
            >
              <button
                onClick={() => handleClick(turn)}
                className={`cursor-pointer rounded-full bg-amber-700 hover:bg-amber-500 transition ease-in-out duration-150 inset-shadow-log-amberdark`}
              >
                <UndoIcon color={turn.curentPlayer} />
              </button>

              <button title={title(turn)} onTouchStart={() => {}} className="">
                <p className="cursor-default w-full text-start text-sm">
                  {san(turn)}
                </p>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LogBlock;
