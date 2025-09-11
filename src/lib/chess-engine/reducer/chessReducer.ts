import { getPositionHashInit } from "@/lib/chess-engine/drawChecker/drawChecker";
import {
  Color,
  GameState,
  PieceType,
  TurnDetails,
} from "@/lib/chess-engine/types";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";

export type GameAction =
  | { type: "INIT"; payload: { pieces: PieceType[]; currentTurn: Color } }
  | {
      type: "SELECT_PIECE";
      payload: { selectedPiece?: PieceType };
    }
  | { type: "PATCH_TURN"; payload: Partial<TurnDetails> }
  | { type: "START_EXCHANGE" }
  | { type: "END_EXCHANGE" }
  | {
      type: "END_TURN";
      payload: {
        turnPatch?: Partial<TurnDetails>;
        boardState: PieceType[];
      };
    }
  | {
      type: "RESET";
      payload: {
        pieces: PieceType[];
        currentTurn: Color;
        turnNo: number;
        log: TurnDetails[][];
      };
    };

export const flip = (c: Color): Color => (c === "white" ? "black" : "white");

export const blankTurn = (
  turnNo: number,
  currentTurn: Color,
  boardState: PieceType[]
): TurnDetails => ({
  turnNo,
  curentPlayer: currentTurn,
  boardState,
  castling: undefined,
  check: undefined,
  checkmate: undefined,
  isExchange: false,
  isEnPassant: false,
  draw: "",
  hash: getPositionHashInit(boardState, currentTurn, undefined, false),
});

export function createInitialState(
  pieces: PieceType[],
  currentTurn: Color,
  turnNo: number,
  log: TurnDetails[][]
): GameState {
  const boardState = pieces.length === 0 ? populateBoard("white") : pieces;
  return {
    currentBoardState: boardState,
    currentTurnNo: turnNo,
    currentTurn,
    turnDetails: blankTurn(turnNo, currentTurn, boardState),
    log,
    selectedPiece: undefined,
    isExchange: false,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INIT": {
      return createInitialState(
        action.payload.pieces,
        action.payload.currentTurn,
        1,
        []
      );
    }

    case "RESET": {
      return createInitialState(
        action.payload.pieces,
        action.payload.currentTurn,
        action.payload.turnNo,
        action.payload.log
      );
    }

    case "SELECT_PIECE": {
      return { ...state, selectedPiece: action.payload.selectedPiece };
    }

    case "PATCH_TURN": {
      return {
        ...state,
        turnDetails: { ...state.turnDetails, ...action.payload },
      };
    }

    case "START_EXCHANGE":
      return { ...state, isExchange: true };

    case "END_EXCHANGE":
      return { ...state, isExchange: false };

    case "END_TURN": {
      const { currentTurn, currentTurnNo, turnDetails, log } = state;
      const justMoved = currentTurn;
      const completedTurn: TurnDetails = {
        ...turnDetails,
        ...(action.payload.turnPatch ?? {}),
        curentPlayer: justMoved,
        boardState: [...turnDetails.boardState],
      };

      const fullTurnIndex = completedTurn.turnNo - 1;
      const newLog = [...log];
      if (newLog[fullTurnIndex]) {
        newLog[fullTurnIndex] = [...newLog[fullTurnIndex], completedTurn];
      } else {
        newLog[fullTurnIndex] = [completedTurn];
      }

      const nextTurnNo =
        justMoved === "black" ? currentTurnNo + 1 : currentTurnNo;
      const nextPlayer = flip(justMoved);

      return {
        ...state,
        log: newLog,
        currentBoardState: action.payload.boardState,
        currentTurn: nextPlayer,
        currentTurnNo: nextTurnNo,
        selectedPiece: undefined,
        isExchange: false,
        turnDetails: blankTurn(
          nextTurnNo,
          nextPlayer,
          action.payload.boardState
        ),
      };
    }

    default:
      return state;
  }
}
