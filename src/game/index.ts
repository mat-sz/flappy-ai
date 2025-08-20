import { mapScale } from '$/utils/math';
import { Noise } from '$/utils/noise';
import { Point, Rect } from '$/utils/rect';
import { Bird } from './bird';
import {
  GAME_HEIGHT,
  SCROLL_X_VELOCITY,
  START_PIPE_X,
  MIN_HOLE_Y,
  MAX_HOLE_Y,
  PIPE_DISTANCE,
  PIPE_WIDTH,
  HOLE_HEIGHT,
} from './consts';

export interface GameSettings {
  randomSeed: boolean;
  seed: number;
}

export class Game {
  x = 0;

  running = false;

  birds: Bird[] = [];

  settings: GameSettings = {
    randomSeed: true,
    seed: 1000,
  };

  noise = new Noise();
  pipeCounter = 0;

  getPipesInRange(x1: number, x2 = x1) {
    const startX = Math.max(x1 - START_PIPE_X - PIPE_WIDTH, 0);
    const endX = Math.max(x2 - START_PIPE_X, 0);
    const pipeCount = Math.max(Math.ceil((endX - startX) / PIPE_DISTANCE), 1);
    const firstPipeIndex = Math.floor(startX / PIPE_DISTANCE);

    const pipes: Point[] = [];
    for (let i = 0; i < pipeCount; i++) {
      const index = firstPipeIndex + i;
      pipes.push({
        x: START_PIPE_X + index * PIPE_DISTANCE,
        y: Math.floor(
          mapScale(
            this.noise.simplex2(1, index),
            -1,
            1,
            MIN_HOLE_Y,
            MAX_HOLE_Y,
          ),
        ),
      });
    }

    return pipes;
  }

  getNextPipe(x: number) {
    return this.getPipesInRange(x + PIPE_DISTANCE)[0];
  }

  get pipeRects(): Rect[] {
    const pipes = this.getPipesInRange(this.x);
    return pipes.flatMap(pipe => [
      {
        x: pipe.x,
        y: 0,
        w: PIPE_WIDTH,
        h: pipe.y,
      },
      {
        x: pipe.x,
        y: pipe.y + HOLE_HEIGHT,
        w: PIPE_WIDTH,
        h: GAME_HEIGHT - pipe.y + HOLE_HEIGHT,
      },
    ]);
  }

  get xOffset() {
    return Math.max(...this.birds.map(bird => bird.x));
  }

  get aliveBirds() {
    return this.birds.filter(bird => bird.alive);
  }

  step(diffSec: number) {
    const alive = this.aliveBirds;
    if (!alive.length || !this.running) {
      return;
    }

    this.x += SCROLL_X_VELOCITY * diffSec;

    const pipeRects = this.pipeRects;
    for (const bird of alive) {
      bird.update(diffSec);
      bird.checkPipes(pipeRects);
    }
  }

  reset() {
    this.pipeCounter = 0;

    if (this.settings.randomSeed) {
      this.noise.randomizeSeed();
    } else {
      this.noise.seed = this.settings.seed;
    }

    this.birds = [];
    this.running = false;
    this.x = 0;
  }
}
