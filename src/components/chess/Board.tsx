"use client";
import Cell from "@/components/chess/Cell";
import { Piece } from "@/lib/chess-engine/types";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import { useContext, useEffect } from "react";
import { ChessContext } from "@/context/chessContext";

type BoardProps = {
  pieces: Piece[] | null;
};

const Board: React.FC<BoardProps> = ({ pieces }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Piece must be used within ChessProvider");

  const {
    selectedPiece,
    setSelectedPiece,
    moveSet,
    setMoveSet,
    piecesState,
    setPiecesState,
  } = context;

  const boardPieces = pieces ?? populateBoard();

  const board: (Piece | null)[][] = Array.from({ length: 8 }, (_, row) =>
    Array.from(
      { length: 8 },
      (_, col) =>
        boardPieces.find((p) => p.cell.col === col && p.cell.row === row) ||
        null
    )
  );

  useEffect(() => {
    setPiecesState(pieces ?? populateBoard());
    console.log(selectedPiece?.cell);
    console.log(moveSet);
  }, [moveSet, pieces, selectedPiece, setPiecesState]);

  return (
    <div className="border-4 border-amber-950">
      <ColCount increment={0} />
      <div className="grid grid-cols-10">
        <RowCount increment={0} />
        <div className="col-start-2 col-span-8 border-amber-950">
          {board.map((r, i) => (
            <div key={i} className="flex">
              {r.map((c, j) => (
                <Cell key={j} i={i} j={j} piece={c ? c : null} />
              ))}
            </div>
          ))}
        </div>
        <RowCount increment={1} />
      </div>
      <ColCount increment={1} />
    </div>
  );
};

export default Board;
