export const rDir: number[][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
export const bDir: number[][] = [
  [1, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
];
export const kDir: number[][] = [
  [1, 2],
  [-1, 2],
  [2, 1],
  [-2, 1],
  [1, -2],
  [-1, -2],
  [2, -1],
  [-2, -1],
];
export const qDir: number[][] = [...rDir, ...bDir];
