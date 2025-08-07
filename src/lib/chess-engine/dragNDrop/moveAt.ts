import { MoveAtType } from "./types";

export const moveAt: MoveAtType = (clone, pageX, pageY, offsetX, offsetY) => {
  clone.style.left = pageX - offsetX + "px";
  clone.style.top = pageY - offsetY + "px";
};
