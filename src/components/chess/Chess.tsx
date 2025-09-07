/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Color,
  GameType,
  PieceType,
  PlayerState,
} from "@/lib/chess-engine/types";
import Board from "./Board";
import { usePlayerState } from "@/context/PlayerStateContext";
import { useEffect, useReducer, useRef, useState } from "react";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import { getAllActiveMoveSets } from "@/lib/chess-engine/moveSets/getAllActiveMoveSets";
import TakenPiecesBlock from "./TakenPiecesBlock";
import LogBlock from "./LogBlock";
import { blankTurn, gameReducer } from "@/reducer/chessReducer";
import ConfirmationBox from "./ConfirmationBox";

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
  const [isReset, setIsReset] = useState<boolean>(false);

  const [state, dispatch] = useReducer(gameReducer, {
    currentBoardState: pieces,
    currentTurn: currentTurn,
    currentTurnNo: currentTurnNo,
    turnDetails: blankTurn(1, "white"),
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

  useEffect(() => {
    if (state.currentBoardState.length > 0)
      getAllActiveMoveSets(state.currentTurn, state.currentBoardState);
  }, [state.log.flat().length]);

  return (
    <>
      <div className="relative w-full flex justify-between bg-cell-dark">
        {isReset && (
          <ConfirmationBox
            setIsReset={setIsReset}
            turn={state.turnDetails}
            confirmClick={handleClick}
            title="Reset this game?"
            message="All progress will be lost"
            confirmText="Yes"
            cancelText="No"
          />
        )}
        {/* <div>
          <div>{state.currentTurn}</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              dispatch({
                type: "END_TURN",
                payload: { boardState: state.currentBoardState },
              });
            }}
          >
            change turn
          </button>
        </div> */}
        <div>
          <div>RESTART GAME</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              console.log("test");
              setIsReset((prev) => !prev);
              console.log(isReset);
            }}
          >
            restart
          </button>
        </div>
        {/* <div>
          <div>{playerState.type}</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              setPlayerState((prev) =>
                prev.color === "white"
                  ? { color: "black", status: prev.status, type: "guest" }
                  : { color: "white", status: prev.status, type: "host" }
              );
            }}
          >
            change player
          </button>
        </div> */}
      </div>
      <div className="w-full flex justify-center items-center">
        Current player: {state.currentTurn}; current turn no:{" "}
        {state.currentTurnNo}
      </div>

      <div
        className={`flex flex-row flex-wrap w-[440px] md:w-[760px] lg:w-auto lg:flex-nowrap`}
      >
        <TakenPiecesBlock state={state} />
        <Board state={state} dispatch={dispatch} gameType={gameType} />
        <LogBlock state={state} dispatch={dispatch} />
      </div>
    </>
  );
};

export default Chess;
