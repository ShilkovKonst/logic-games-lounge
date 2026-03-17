import { ActionDispatch } from "react";
import { GameState } from "@/lib/chess-engine/core/types";
import { getPieceAt } from "@/lib/chess-engine/core/utils/pieceUtils";
import { decodeMove, uciPromoToType } from "@/lib/chess-engine/core/utils/uciUtil";
import {
  handlePieceClick,
  handleMoveClick,
} from "@/lib/chess-engine/local/moveHandler/moveHandler";
import {
  produceMove,
  calcFoeState,
} from "@/lib/chess-engine/local/moveHandler/produceMoves";
import { GameAction } from "@/lib/chess-engine/local/reducer/chessReducer";

export function applyRemoteMove(
  msg: string,
  state: GameState,
  dispatch: ActionDispatch<[action: GameAction]>
): void {
  const { fromCell, toCell, promo } = decodeMove(msg);

  const piece = getPieceAt(fromCell, state.currentBoardState);
  if (!piece) return;

  const pieceWithMoves = handlePieceClick(
    piece.id,
    state.currentBoardState,
    state.currentTurn
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
    const workingPiece = workingBoard.find((p) => p.id === pieceWithMoves.id)!;
    handleMoveClick(move, workingPiece, workingBoard);
    workingPiece.type = uciPromoToType(promo);

    const { foeColor, check, checkmate, draw } = calcFoeState(
      state.currentTurn,
      workingBoard,
      state.log,
      state.turnDetails
    );
    dispatch({
      type: "END_TURN",
      payload: {
        turnPatch: {
          isExchange: true,
          pieceToExchange: workingPiece.type,
          toCell: move.id,
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
