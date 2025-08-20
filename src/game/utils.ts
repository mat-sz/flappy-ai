import { BIRD_WIDTH, PIPE_DISTANCE, PIPE_WIDTH, START_PIPE_X } from './consts';

export function calculateScore(x: number) {
  const offset = START_PIPE_X - PIPE_WIDTH / 2 + BIRD_WIDTH / 2;
  if (x < offset) {
    return 0;
  }

  return Math.floor((x - offset) / PIPE_DISTANCE) + 1;
}
