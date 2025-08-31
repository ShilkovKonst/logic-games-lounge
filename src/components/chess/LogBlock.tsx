"use client";
import { UndoIcon } from "@/lib/chess-engine/constants/icons";
import { getDisambiguation, getSAN } from "@/lib/chess-engine/constants/san";
import { GameState, Pieces, TurnDetails } from "@/lib/chess-engine/types";
import { GameAction } from "@/reducer/chessReducer";
import { ActionDispatch } from "react";

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
      isStalemate,
    } = turn;

    return `${turnNo} - ${curentPlayer} ${pieceToMove?.slice(
      0,
      -2
    )} moves from ${fromCell} to ${toCell} ${
      pieceToTake ? `takes ${pieceToTake?.slice(0, -2)}` : ""
    } ${isEnPassant ? " en passant" : ""} ${
      castling ? ` ${castling} castling` : ""
    } ${isExchange ? `exchange to ${pieceToExchange}` : ""}`;
  };

  const san = (turn: TurnDetails) => {
    const {
      isStalemate,
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
    if (isStalemate) return "1/2 - 1/2";
    else if (castling) sanString = castling === "long" ? "O-O-O" : "O-O";
    else if (isExchange) {
      const exchangeSAN = pieceToExchange && getSAN(pieceToExchange);
      sanString = pieceToTake
        ? `${pieceSAN}${fromCell?.charAt(0)}x${toCell}=${exchangeSAN}`
        : `${pieceSAN}${toCell}=${exchangeSAN}`;
    } else {
      sanString = `${pieceSAN}${disambiguation}${
        pieceToTake ? (pieceSAN ? "x" : `${fromCell?.charAt(0)}x`) : ""
      }${toCell} ${pieceToTake && isEnPassant ? "e.p." : ""}`;
    }

    if (check) sanString += "+";
    else if (checkmate) sanString += "#";
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

  return (
    <div
      className="flex flex-col justify-start items-start gap-3 order-3 border-amber-950 bg-amber-150 border-b-4 border-r-4 overflow-y-auto
                w-[298px] h-[448px] border-t-0
                md:w-[220px] md:h-[508px] md:order-2 md:border-t-4"
    >
      {log.map((turns, i) => (
        <div key={i} className="flex flex-row gap-5">
          {turns.map((turn, j) => (
            <div key={j} className="flex justify-start items-center w-[84px] h-10">
              <button
                onClick={() => handleClick(turn)}
                className="cursor-pointer "
              >
                <UndoIcon color={turn.curentPlayer} />
              </button>

              <button title={title(turn)} onTouchStart={() => {}}>
                <p className="cursor-default w-full text-center text-sm">
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
