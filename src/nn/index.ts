import { NNLinearLayer, NNTanhLayer } from './layer';
import { Matrix2D } from './types';
import { randMatrix } from './utils';

export class NeuralNetwork<
  TInputColumns extends number = 2,
  TOutputColumns extends number = 1,
> {
  layers;
  lastActivations?: any[];

  readonly inputNames = ['dist_top', 'dist_bottom'];
  readonly outputNames = ['flap'];

  constructor() {
    this.layers = [
      new NNLinearLayer(randMatrix(3, 2)),
      new NNTanhLayer(),
      new NNLinearLayer(randMatrix(2, 3)),
      new NNTanhLayer(),
      new NNLinearLayer(randMatrix(1, 2)),
      new NNTanhLayer(),
    ] as const;
  }

  run(input: Matrix2D<1, TInputColumns>): Matrix2D<1, TOutputColumns> {
    let data: Matrix2D<any, any> = input;

    this.lastActivations = [input];
    for (const layer of this.layers) {
      // TODO: Types.
      data = layer.forward(data as any);
      if (layer instanceof NNTanhLayer) {
        this.lastActivations.push(data);
      }
    }

    return data;
  }
}
