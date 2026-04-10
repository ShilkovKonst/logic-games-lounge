import { Castling, GameState } from "../core/types";
import { getPieceAt } from "../core/utils/pieceUtils";
import { decodeMove, uciPromoToType } from "../core/utils/uciUtil";
import { notToRC } from "../core/utils/cellUtil";
import { handlePieceClick, handleMoveClick } from "../local/moveHandler/moveHandler";
import { calcFoeState } from "../local/moveHandler/produceMoves";
import { gameReducer } from "../local/reducer/chessReducer";

const UCI_RE = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

/**
 * Pure version of applyRemoteMove — applies a single UCI move to a GameState
 * and returns the next GameState without dispatching. Used for synchronous replay
 * of a full game history on reconnect.
 */
export function applyMovePure(uci: string, state: GameState): GameState {
  if (!UCI_RE.test(uci)) return state;

  const { fromCell, toCell, promo } = decodeMove(uci);
  const piece = getPieceAt(fromCell, state.currentBoardState);
  if (!piece) return state;

  const pieceWithMoves = handlePieceClick(piece.id, state.currentBoardState, state.currentTurn);
  const move = pieceWithMoves.moveSet.find((m) => m.id === toCell);
  if (!move) return state;

  const workingBoard = state.currentBoardState.map((p) => ({
    ...p,
    cell: { ...p.cell },
    moveSet: [],
  }));
  const workingPiece = workingBoard.find((p) => p.id === pieceWithMoves.id);
  if (!workingPiece) return state;

  const ambiguity = state.currentBoardState.reduce<string[]>((acc, p) => {
    if (
      !p.isTaken &&
      p.color === state.currentTurn &&
      p.type === pieceWithMoves.type &&
      p.id !== pieceWithMoves.id
    ) {
      if (p.moveSet.find((m) => m.id === toCell)) acc.push(p.cell.id);
    }
    return acc;
  }, []);

  const { pieceToTake } = handleMoveClick(move, workingPiece, workingBoard);

  if (promo) {
    const promoType = uciPromoToType(promo);
    if (!promoType) return state;
    workingPiece.type = promoType;

    const { foeColor, check, checkmate, draw } = calcFoeState(
      state.currentTurn,
      workingBoard,
      state.log,
      state.turnDetails,
    );
    return gameReducer(state, {
      type: "END_TURN",
      payload: {
        turnPatch: {
          pieceToMove: pieceWithMoves.type + pieceWithMoves.id,
          fromCell: pieceWithMoves.cell.id,
          toCell,
          pieceToTake,
          isExchange: true,
          pieceToExchange: workingPiece.type,
          ambiguity,
          check: check ? foeColor : undefined,
          checkmate: checkmate ? foeColor : undefined,
          draw,
        },
        boardState: workingBoard,
      },
    });
  }

  // Promotion without promo char — should not occur in a valid game log
  const moveCell = notToRC(toCell);
  const needsPromotion =
    pieceWithMoves.type === "pawn" &&
    ((pieceWithMoves.color === "white" && moveCell.row === 0) ||
      (pieceWithMoves.color === "black" && moveCell.row === 7));
  if (needsPromotion) return state;

  const patch: Record<string, unknown> = {
    pieceToMove: pieceWithMoves.type + pieceWithMoves.id,
    fromCell: pieceWithMoves.cell.id,
    toCell,
    pieceToTake,
    ambiguity,
  };

  if (move.special?.type === "castling") {
    const castling = move.special as Castling;
    patch.castling = castling.long ? "long" : "short";
  }
  if (move.special?.type === "enPassant") {
    patch.isEnPassant = true;
  }

  const { foeColor, check, checkmate, draw } = calcFoeState(
    state.currentTurn,
    workingBoard,
    state.log,
    state.turnDetails,
  );
  patch.check = check ? foeColor : undefined;
  patch.checkmate = checkmate ? foeColor : undefined;
  patch.draw = draw;

  return gameReducer(state, {
    type: "END_TURN",
    payload: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      turnPatch: patch as any,
      boardState: workingBoard,
    },
  });
}
