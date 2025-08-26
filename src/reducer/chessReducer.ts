import {
  Color,
  GameState,
  PieceType,
  TurnDetails,
} from "@/lib/chess-engine/types";

export type GameAction =
  | { type: "INIT"; payload: { pieces: PieceType[]; currentTurn: Color } }
  | { type: "SELECT_PIECE"; payload: { selectedPiece?: PieceType } } // опционально, если хочешь тоже унести
  | { type: "PATCH_TURN"; payload: Partial<TurnDetails> } // пометить детали хода (castling, enPassant, toCell и т.п.)
  | { type: "START_EXCHANGE" }
  | { type: "END_EXCHANGE" }
  | {
      type: "END_TURN"; // зафиксировать ход АТОМАРНО
      payload: {
        turnPatch?: Partial<TurnDetails>; // то, что не успели пропатчить ранее
        boardState: PieceType[]; // снэпшот фигур ПОСЛЕ хода
      };
    }
  | { type: "RESET"; payload: { pieces: PieceType[]; currentTurn: Color } };

export const flip = (c: Color): Color => (c === "white" ? "black" : "white");

export const blankTurn = (turnNo: number, cur: Color): TurnDetails => ({
  turnNo,
  curentPlayer: cur,
  boardState: [],
  pieceToMove: "",
  fromCell: "",
  toCell: "",
  pieceToTake: "",
  pieceToExchange: "",
  exchange: false,
  enPassant: false,
  castling: undefined,
  check: undefined,
  checkmate: undefined,
  stalemate: false,
});

export function createInitialState(
  pieces: PieceType[],
  currentTurn: Color
): GameState {
  return {
    currentBoardState: pieces,
    currentTurnNo: 1,
    currentTurn,
    turnDetails: blankTurn(1, currentTurn),
    log: [],
    selectedPiece: undefined,
    isExchange: false,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INIT": {
      //   console.log(action.payload.pieces);
      return createInitialState(
        action.payload.pieces,
        action.payload.currentTurn
      );
    }

    case "RESET": {
      return createInitialState(
        action.payload.pieces,
        action.payload.currentTurn
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
      console.log("END_TURN");
      const justMoved = state.currentTurn;
      const completed: TurnDetails = {
        ...state.turnDetails,
        ...(action.payload.turnPatch ?? {}),
        curentPlayer: justMoved,
        boardState: action.payload.boardState,
      };

      const newLog = [...state.log, completed];

      const nextTurnNo =
        justMoved === "black"
          ? state.currentTurnNo + 1
          : state.currentTurnNo;
      const nextPlayer = flip(justMoved);

      console.log(nextTurnNo, nextPlayer);
      return {
        ...state,
        log: newLog,
        currentBoardState: action.payload.boardState,
        currentTurn: nextPlayer,
        currentTurnNo: nextTurnNo,
        selectedPiece: undefined,
        isExchange: false,
        turnDetails: blankTurn(nextTurnNo, nextPlayer),
      };
    }

    default:
      return state;
  }
}
