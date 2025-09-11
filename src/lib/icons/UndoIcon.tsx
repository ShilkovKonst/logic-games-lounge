import React from "react";
import { Color } from "../chess-engine/types";

export type UndoProps = {
  color: Color;
};

const UndoIcon: React.FC<UndoProps> = ({ color }) => {
  return (
    <svg
      className={`w-9 h-9`}
      viewBox="0 0 24 24"
      fill={color === "white" ? "#fef3c6" : "#461901"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 10h6c1.654 0 3 1.346 3 3s-1.346 3-3 3h-3v2h3c2.757 0 5-2.243 5-5s-2.243-5-5-5H9V5L4 9l5 4v-3z" />
    </svg>
  );
};

export default UndoIcon;
