import {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { HandleDragStartType } from "./types";
import { moveAt } from "./moveAt";
import { dragging } from "./dragging";
import { dragEnd } from "./dragEnd";
import { getMoveSet } from "../utils/getMoveSet";

export const dragStart: HandleDragStartType = (
  e,
  piece,
  pieces,
  playerColor,
  currentTurn,
  setSelectedPiece,
  setPieceToExchange,
  setMoveSet,
  changeTurn
) => {
  if (e.type === "mousedown") (e as ReactMouseEvent).preventDefault();

  const moveSet = getMoveSet(
    piece,
    pieces,
    setMoveSet,
    setSelectedPiece,
    currentTurn
  );

  const target = e.currentTarget as HTMLElement;
  target.style.opacity = "75%";
  const clone = target.cloneNode(true) as HTMLElement;
  clone.removeAttribute("class");
  clone.setAttribute(
    "class",
    "h-[4rem] w-[4rem] md:h-[5rem] md:w-[5rem] lg:w-18 lg:h-18 cursor-grabbing"
  );
  clone.style.position = "absolute";
  clone.style.rotate = playerColor === "white" ? "0deg" : "180deg";
  clone.style.zIndex = "1000";
  clone.style.opacity = "100%";
  document.body.appendChild(clone);
  clone.hidden = true;

  let offsetX: number = 0;
  let offsetY: number = 0;
  if (e.type === "mousedown") {
    const mouseE = e as ReactMouseEvent;
    offsetX = mouseE.clientX - target.getBoundingClientRect().left;
    offsetY = mouseE.clientY - target.getBoundingClientRect().top;
  }
  if (e.type === "touchstart") {
    const touchE = e as ReactTouchEvent;
    offsetX =
      touchE.changedTouches[0].clientX - target.getBoundingClientRect().left;
    offsetY =
      touchE.changedTouches[0].clientY - target.getBoundingClientRect().top;
  }

  if (e.type === "mousedown") {
    const mouseE = e as ReactMouseEvent;
    moveAt(clone, mouseE.clientX, mouseE.clientY, offsetX, offsetY);
  }
  if (e.type === "touchstart") {
    const touchE = e as ReactTouchEvent;
    moveAt(
      clone,
      touchE.changedTouches[0].clientX,
      touchE.changedTouches[0].clientY,
      offsetX,
      offsetY
    );
  }

  const handleDragging = (e: MouseEvent | TouchEvent) =>
    dragging(e, clone, offsetX, offsetY);

  const handleDragEnd = (e: MouseEvent | TouchEvent) =>
    dragEnd(
      e,
      target,
      clone,
      pieces,
      piece,
      moveSet,
      setPieceToExchange,
      changeTurn,
      handleDragging,
      handleDragEnd
    );

  if (e.type === "mousedown") {
    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", handleDragEnd);
  }
  if (e.type === "touchstart") {
    document.addEventListener("touchmove", handleDragging);
    document.addEventListener("touchend", handleDragEnd);
  }
};
