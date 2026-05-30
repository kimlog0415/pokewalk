export const FACE_RIGHT = new Set([
  1, 2, 18, 28, 32, 39, 40, 48, 60, 64, 66, 68, 74, 89, 96, 100, 106, 109, 114, 118, 122, 138, 147, 150
]);

export const flipStyle = (id) =>
  FACE_RIGHT.has(id) ? { transform: 'scaleX(-1)' } : undefined;
