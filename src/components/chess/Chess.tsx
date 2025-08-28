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
import { useEffect, useReducer } from "react";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import { getAllActiveMoveSets } from "@/lib/chess-engine/moveSets/getAllActiveMoveSets";
import TakenPiecesBlock from "./TakenPiecesBlock";
import LogBlock from "./LogBlock";
import { blankTurn, gameReducer } from "@/reducer/chessReducer";
import { BOARD } from "@/lib/chess-engine/utils/createBoard";

type ChessProps = {
  gameType: GameType;
  currentTurn: Color;
  currentTurnNo: number;
  pieces: PieceType[];
  plState: PlayerState | null;
};
const Chess: React.FC<ChessProps> = ({ gameType, currentTurn, currentTurnNo, pieces, plState }) => {
  const { playerState, setPlayerState } = usePlayerState();

  const [state, dispatch] = useReducer(gameReducer, {
    currentBoardState: pieces,
    currentTurn: currentTurn,
    currentTurnNo: currentTurnNo,
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
        pieces: populateBoard("white", BOARD),
      },
    });
  }, []);

  useEffect(() => {
    getAllActiveMoveSets(state.currentTurn, state.currentBoardState, BOARD);
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
                type: "END_TURN",
                payload: { boardState: state.currentBoardState },
              });
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
                  pieces: populateBoard("white", BOARD),
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
        <Board state={state} dispatch={dispatch} gameType={gameType} />
        <LogBlock state={state} />
      </div>
    </>
  );
};

export default Chess;
