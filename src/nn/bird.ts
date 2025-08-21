import { Bird } from '$/game/bird';
import {
  BIRD_HEIGHT,
  BIRD_WIDTH,
  GAME_HEIGHT,
  HOLE_HEIGHT,
  PIPE_WIDTH,
} from '$/game/consts';
import type { Game } from '$/game';
import { angle, distance, normalizeValue } from '$/utils/math';
import { NeuralNetwork } from '.';
import { BirdInput, Matrix2D } from './types';

const DISTANCE_RANGE = GAME_HEIGHT / 1.5;

export class NeuralBird extends Bird {
  constructor(public nn: NeuralNetwork = new NeuralNetwork()) {
    super();
  }

  get fitness() {
    return Math.pow(this.x / 100, 2);
  }

  getInputs(game: Game): BirdInput[] {
    const pipe = game.getNextPipe(this.x);
    const birdMidX = this.x + BIRD_WIDTH / 2;
    const pipeMidX = pipe.x + PIPE_WIDTH / 2;

    return this.nn.inputNames
      .map(input => {
        switch (input) {
          case 'dist_bottom':
            return {
              type: 'distance',
              points: [
                { x: birdMidX, y: this.y },
                { x: pipeMidX, y: pipe.y },
              ],
            };
          case 'dist_top':
            return {
              type: 'distance',
              points: [
                { x: birdMidX, y: this.y + BIRD_HEIGHT },
                { x: pipeMidX, y: pipe.y + HOLE_HEIGHT },
              ],
            };
          case 'bird_y':
            return {
              type: 'value',
              value: this.y,
            };
          case 'angle':
            return {
              type: 'angle',
              points: [
                { x: pipeMidX, y: pipe.y + HOLE_HEIGHT / 2 }, // Vertex
                { x: birdMidX, y: this.y + BIRD_HEIGHT / 2 },
                { x: birdMidX, y: pipe.y + HOLE_HEIGHT / 2 },
              ],
            };
        }

        return undefined;
      })
      .filter(input => !!input) as BirdInput[];
  }

  private calculateInputs(game: Game) {
    const inputs = this.getInputs(game);
    return [
      inputs.map(input => {
        switch (input.type) {
          case 'value':
            return normalizeValue(input.value, GAME_HEIGHT);
          case 'distance':
            return normalizeValue(distance(...input.points), DISTANCE_RANGE);
          case 'angle': {
            const [a, b] = input.points;
            const val = angle(...input.points);
            return (b.x < a.x ? -val : val) / Math.PI;
          }
        }

        return 0;
      }),
    ] as any as Matrix2D<1, 2>;
  }

  neuralStep(game: Game) {
    const output = this.nn.run(this.calculateInputs(game));
    if (output[0][0] > 0) {
      this.flap();
    }
  }
}
