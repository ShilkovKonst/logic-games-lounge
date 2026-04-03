import { ActionDispatch } from "react";
import { GameState } from "@/lib/chess-engine/core/types";
import { getPieceAt } from "@/lib/chess-engine/core/utils/pieceUtils";
import {
  decodeMove,
  uciPromoToType,
} from "@/lib/chess-engine/core/utils/uciUtil";
import {
  handlePieceClick,
  handleMoveClick,
} from "@/lib/chess-engine/local/moveHandler/moveHandler";
import {
  produceMove,
  calcFoeState,
} from "@/lib/chess-engine/local/moveHandler/produceMoves";
import { GameAction } from "@/lib/chess-engine/local/reducer/chessReducer";
import { populateBoard } from "../core/utils/populateBoard";

// Valid UCI: "e2e4" (normal) or "e7e8q" (promotion with q/r/b/n)
const UCI_RE = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

export function applyRemoteMove(
  msg: string,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>,
): void {
  if (msg === "reset") {
    dispatch({
      type: "INIT",
      payload: { currentTurn: "white", pieces: populateBoard("white") },
    });
    return;
  }
  if (!UCI_RE.test(msg)) return;

  const { fromCell, toCell, promo } = decodeMove(msg);

  const piece = getPieceAt(fromCell, state.currentBoardState);
  if (!piece) return;

  const pieceWithMoves = handlePieceClick(
    piece.id,
    state.currentBoardState,
    state.currentTurn,
  );
  const move = pieceWithMoves.moveSet.find((m) => m.id === toCell);
  if (!move) return;

  // Promotion: apply pawn move + exchange atomically in one END_TURN dispatch.
  // Local mode is two-phase (START_EXCHANGE → END_TURN), but the remote side
  // already knows the chosen piece, so we skip the intermediate state entirely.
  if (promo) {
    const workingBoard = state.currentBoardState.map((p) => ({
      ...p,
      cell: { ...p.cell },
      moveSet: [],
    }));
    const workingPiece = workingBoard.find((p) => p.id === pieceWithMoves.id);
    if (!workingPiece) {
      console.error(
        `[applyRemoteMove] piece ${pieceWithMoves.id} not found in workingBoard — state desync`,
      );
      return;
    }

    const promoType = uciPromoToType(promo);
    if (!promoType) {
      // UCI_RE guarantees promo ∈ {q,r,b,n} — reaching here is a bug
      console.error(`[applyRemoteMove] unexpected promo char: "${promo}"`);
      return;
    }

    const ambiguity = state.currentBoardState.reduce<string[]>((acc, p) => {
      if (
        !p.isTaken &&
        p.color === state.currentTurn &&
        p.type === pieceWithMoves.type &&
        p.id !== pieceWithMoves.id
      ) {
        if (p.moveSet.find((m) => m.id === move.id)) acc.push(p.cell.id);
      }
      return acc;
    }, []);

    const { pieceToTake } = handleMoveClick(move, workingPiece, workingBoard);
    workingPiece.type = promoType;

    const { foeColor, check, checkmate, draw } = calcFoeState(
      state.currentTurn,
      workingBoard,
      state.log,
      state.turnDetails,
    );
    dispatch({
      type: "END_TURN",
      payload: {
        turnPatch: {
          pieceToMove: pieceWithMoves.type + pieceWithMoves.id,
          fromCell: pieceWithMoves.cell.id,
          pieceToTake,
          isExchange: true,
          pieceToExchange: workingPiece.type,
          toCell: move.id,
          ambiguity,
          check: check ? foeColor : undefined,
          checkmate: checkmate ? foeColor : undefined,
          draw,
        },
        boardState: workingBoard,
      },
    });
    return;
  }

  produceMove(pieceWithMoves, state, dispatch, toCell);
}
