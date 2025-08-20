import { Piece } from "../types";

export function filterAllValidMoves(
  currentPiece: Piece,
  attackTrajectory: string[]
): void {
  const validMoves = [];
  for (const cell of attackTrajectory) {
    if (currentPiece.moveSet.includes(cell)) {
      validMoves.push(cell);
    }
  }
  // console.log(currentPiece);
  // console.log(validMoves);
  currentPiece.moveSet.length = 0;
  currentPiece.moveSet.push(...validMoves);
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
