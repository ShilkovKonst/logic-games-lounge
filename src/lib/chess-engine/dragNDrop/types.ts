import {
  Dispatch,
  MouseEvent as ReactMouseEvent,
  SetStateAction,
  TouchEvent as ReactTouchEvent,
} from "react";
import { Piece, Color, Cell } from "../types";

export type HandleDragStartType = (
  e: ReactMouseEvent | ReactTouchEvent,
  piece: Piece,
  piecesState: Piece[],
  playerColor: Color,
  currentTurn: Color,
  setSelectedPiece: Dispatch<SetStateAction<Piece | undefined>>,
  setPieceToExchange: Dispatch<SetStateAction<Piece | undefined>>,
  setMoveSet: Dispatch<SetStateAction<Cell[]>>,
  changeTurn: () => void
) => void;

export type HandleDragEndType = (
  e: MouseEvent | TouchEvent,
  target: HTMLElement,
  clone: HTMLElement,
  piecesState: Piece[],
  piece: Piece,
  moveSet: Cell[],
  setPieceToExchange: Dispatch<SetStateAction<Piece | undefined>>,
  changeTurn: () => void,
  handleDragging: (e: MouseEvent | TouchEvent) => void,
  handleDragEnd: (e: MouseEvent | TouchEvent) => void
) => void;

export type HandleDraggingType = (
  e: MouseEvent | TouchEvent,
  clone: HTMLElement,
  offsetX: number,
  offsetY: number
) => void;

export type MoveAtType = (
  clone: HTMLElement,
  pageX: number,
  pageY: number,
  offsetX: number,
  offsetY: number
) => void;

export type DefineDropzoneType = (
  e: ReactMouseEvent | ReactTouchEvent | MouseEvent | TouchEvent,
  clone: HTMLElement
) => HTMLElement | null;
