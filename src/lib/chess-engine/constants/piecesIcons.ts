import { PieceType } from "../types";
import {
  BishopIcon,
  IconProps,
  KingIcon,
  KnightIcon,
  PawnIcon,
  QueenIcon,
  RookIcon,
} from "./icons";

export type PiecesIcons = {
  [K in PieceType]: React.FC<IconProps>;
};

export const piecesIcons: PiecesIcons = {
  king: KingIcon,
  queen: QueenIcon,
  rook: RookIcon,
  bishop: BishopIcon,
  knight: KnightIcon,
  pawn: PawnIcon,
};
