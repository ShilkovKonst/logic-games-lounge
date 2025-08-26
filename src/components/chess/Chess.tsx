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
import { useGameState } from "@/context/GameStateContext";
import { useBoardState } from "@/context/BoardStateContext";
import { useEffect, useReducer } from "react";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import { getAllActiveMoveSets } from "@/lib/chess-engine/moveSets/getAllActiveMoveSets";
import { checkKingSafety } from "@/lib/chess-engine/moveSets/checkKingSafety";
import TakenPiecesBlock from "./TakenPiecesBlock";
import LogBlock from "./LogBlock";
import { blankTurn, flip, gameReducer } from "@/reducer/chessReducer";

type ChessProps = {
  gType: GameType | null;
  curTurn: Color | null;
  plState: PlayerState | null;
  pcs: PieceType[] | null;
};
const Chess: React.FC<ChessProps> = ({ gType, pcs, curTurn, plState }) => {
  const { playerState, setPlayerState } = usePlayerState();
  const { board } = useBoardState();

  const [state, dispatch] = useReducer(gameReducer, {
    currentBoardState: populateBoard("white", board),
    currentTurn: "white",
    currentTurnNo: 1,
    turnDetails: blankTurn(1, "white"),
    log: [],
    selectedPiece: undefined,
    isExchange: false,
  });

  useEffect(() => {
    dispatch({
      type: "INIT",
      payload: {
        currentTurn: "white",
        pieces: populateBoard("white", board),
      },
    });
  }, []);

  useEffect(() => {
    getAllActiveMoveSets(state.currentTurn, state.currentBoardState, board);
  }, [state.currentTurn]);

  return (
    <>
      <div className="w-full flex justify-between">
        <div>
          <div>{state.currentTurn}</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              dispatch({
                type: "PATCH_TURN",
                payload: { curentPlayer: flip(state.currentTurn) },
              });
              // setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
            }}
          >
            change turn
          </button>
        </div>
        <div>
          <div>RESTART GAME</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              dispatch({
                type: "INIT",
                payload: {
                  currentTurn: "white",
                  pieces: populateBoard("white", board),
                },
              });
            }}
          >
            restart
          </button>
        </div>
        <div>
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
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        Current player: {state.currentTurn}; current turn no:{" "}
        {state.currentTurnNo}
      </div>

      <div className={`grid grid-cols-16 `}>
        <TakenPiecesBlock state={state} />
        <Board state={state} dispatch={dispatch} />
        <LogBlock state={state} />
      </div>
    </>
  );
};

export default Chess;
