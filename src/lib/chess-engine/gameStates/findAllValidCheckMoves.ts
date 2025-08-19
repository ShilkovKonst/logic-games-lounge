import { Cell, Piece } from "../types";
import { getCell } from "../utils/cellUtil";

export function findAllValidMoves(
  kingCell: Cell,
  currentPiece: Piece,
  pieces: Piece[],
  board: Cell[][]
) {
  const threatPieces = [];
  for (const threat of kingCell.threats) {
    const threatPiece = pieces.find((p) => p.id === threat);
    if (threatPiece) threatPieces.push(threatPiece);
  }

//   for (const threatPiece of threatPieces) {
//     const threatCell = getCell(board, threatPiece.cell);
//     if (threatPiece.type === "pawn" || threatPiece.type === "knight") {
//       currentPiece.moveSet.clear();
//       if (currentPiece.moveSet.has(threatPiece.cell)) {
//         currentPiece.moveSet.add(threatPiece.cell);
//       }
//     }
//   }
}


/*
1 если шах:
    1а - проверяем тип атакующей фигуры
    1б - пешка или конь - фильтруем только те фигуры, которые могут взять на текущем ходу эту пешку или коня
    1в - слон, ладья или ферзь - находим траекторию атаки и проверяем все фигуры. оставляем те, что 
        могут перекрыть траеткорию атаки (то есть встать на любую клетку на траектории между королем и атакующей фигурой), 
        что могут взять атакующую фигуру 
2 - если шах и если доступных ходов нет - объявляем мат
3 - если нет доступных ходов - объявляем пат
*/