import { moveAt } from "./moveAt";
import { HandleDraggingType } from "./types";

export const dragging: HandleDraggingType = (e, clone, offsetX, offsetY) => {
  clone.hidden = false;
  clone.style.pointerEvents = "auto";
  clone.style.cursor = "grabbing";

  if (e.type === "mousemove") {
    const mouseE = e as MouseEvent;
    moveAt(clone, mouseE.clientX, mouseE.clientY, offsetX, offsetY);
  }
  if (e.type === "touchmove") {
    const touchE = e as TouchEvent;
    moveAt(
      clone,
      touchE.changedTouches[0].clientX,
      touchE.changedTouches[0].clientY,
      offsetX,
      offsetY
    );
  }
};
