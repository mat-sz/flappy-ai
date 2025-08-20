import { Bird } from '$/game/bird';
import {
  BIRD_HEIGHT,
  BIRD_WIDTH,
  GAME_HEIGHT,
  HOLE_HEIGHT,
  PIPE_WIDTH,
} from '$/game/consts';
import type { Game } from '$/game';
import { distance, normalizeValue } from '$/utils/math';
import { Point } from '$/utils/rect';
import { NeuralNetwork } from '.';
import { Matrix2D } from './types';

const DISTANCE_RANGE = GAME_HEIGHT / 1.5;

export class NeuralBird extends Bird {
  constructor(public nn: NeuralNetwork = new NeuralNetwork()) {
    super();
  }

  get fitness() {
    return Math.pow(this.x, 2);
  }

  getInputPointPairs(game: Game): [Point, Point][] {
    const pipe = game.getNextPipe(this.x);
    const birdMidX = this.x + BIRD_WIDTH / 2;
    const pipeMidX = pipe.x + PIPE_WIDTH / 2;
    return [
      [
        { x: birdMidX, y: this.y + BIRD_HEIGHT },
        { x: pipeMidX, y: pipe.y + HOLE_HEIGHT },
      ],
      [
        { x: birdMidX, y: this.y },
        { x: pipeMidX, y: pipe.y },
      ],
    ];
  }

  private calculateInputs(game: Game) {
    const pointPairs = this.getInputPointPairs(game);
    return [
      pointPairs.map(([a, b]) =>
        normalizeValue(distance(a, b), DISTANCE_RANGE),
      ),
    ] as any as Matrix2D<1, 2>;
  }

  neuralStep(game: Game) {
    const output = this.nn.run(this.calculateInputs(game));
    if (output[0][0] > 0) {
      this.flap();
    }
  }
}
