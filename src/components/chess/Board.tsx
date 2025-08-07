/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Cell from "@/components/chess/Cell";
import { Piece, Color, PlayerState } from "@/lib/chess-engine/types";
import { populateBoard } from "@/lib/chess-engine/utils/populateBoard";
import RowCount from "./RowCount";
import ColCount from "./ColCount";
import { useContext, useEffect } from "react";
import { ChessContext } from "@/context/chessContext";
import TakenPieces from "./TakenPieces";

type BoardProps = {
  curTurn: Color | null;
  pState: PlayerState | null;
  pcs: Piece[] | null;
};

const Board: React.FC<BoardProps> = ({ pcs, curTurn, pState }) => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("Board must be used within ChessProvider");

  const {
    playerState,
    setPlayerState,
    currentTurn,
    setCurrentTurn,
    setSelectedPiece,
    setPieceToExchange,
    setMoveSet,
    pieces,
    setPieces,
  } = context;

  const board: (Piece | null)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null)
  );

  const thisPiece: (i: number, j: number) => Piece | undefined = (i, j) =>
    pieces.find((p) => p.cell.col === j && p.cell.row === i && !p.isTaken);

  useEffect(() => {
    setPlayerState(pState ?? { color: "white", status: "NORMAL", type: "host" });
    setCurrentTurn(curTurn ?? "white");
    setPieces(pcs ?? populateBoard());
  }, []);

  useEffect(() => {
    setMoveSet([]);
    setSelectedPiece(undefined);
  }, [currentTurn]);

  return (
    <>
      <div className="w-full flex justify-between">
        <div>
          <div>{currentTurn}</div>
          <button
            className="p-2 bg-amber-200"
            onClick={() => {
              setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
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
              setMoveSet([]);
              setSelectedPiece(undefined);
              setPieceToExchange(undefined);
              setPlayerState(pState ?? { color: "white", status: "NORMAL", type: "host" });
              setPieces(pcs ?? populateBoard());
              setCurrentTurn(curTurn ?? "white");
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
                  ? { color: "black", status: prev.status, type:"guest" }
                  : { color: "white", status: prev.status, type:"host" }
              );
            }}
          >
            change player
          </button>
        </div>
      </div>
      <div className={`grid grid-cols-12 `}>
        <div className="col-span-2 flex flex-col justify-between">
          <TakenPieces player="black" />
          <TakenPieces player="white" />
        </div>
        <div
          className={`col-start-3 col-span-10 border-4 border-amber-950 ${
            playerState.color === "white" ? "rotate-0" : "rotate-180"
          }`}
        >
          <ColCount increment={0} />
          <div className="grid grid-cols-10">
            <RowCount increment={0} />
            <div className="col-start-2 col-span-8 border-amber-950">
              {board.map((r, i) => (
                <div key={i} className="flex">
                  {r.map((_, j) => (
                    <Cell
                      key={i * 10 + j}
                      row={i}
                      col={j}
                      piece={thisPiece(i, j)}
                    />
                  ))}
                </div>
              ))}
            </div>
            <RowCount increment={1} />
          </div>
          <ColCount increment={1} />
        </div>
      </div>
    </>
  );
};

export default Board;
