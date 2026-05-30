export const RPS_KEYS  = ['scissors', 'rock', 'paper'];
export const RPS_EMOJI = { scissors: '✌️', rock: '✊', paper: '🖐️' };

export function rpsResult(player, cpu) {
  if (player === cpu) return 'draw';
  if (
    (player === 'scissors' && cpu === 'paper')  ||
    (player === 'rock'     && cpu === 'scissors') ||
    (player === 'paper'    && cpu === 'rock')
  ) return 'win';
  return 'lose';
}

export function randomRps() {
  return RPS_KEYS[Math.floor(Math.random() * 3)];
}
