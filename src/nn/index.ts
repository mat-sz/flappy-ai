import { NNLayer, NNLinearLayer, NNTanhLayer } from './layer';
import { Matrix2D } from './types';
import { randMatrix } from './utils';

export interface NeuralNetworkSettings {
  inputs: string[];
  hiddenLayers: number[];
}

export class NeuralNetwork {
  layers: NNLayer<any, any>[] = [];
  lastActivations?: any[];

  static settings: NeuralNetworkSettings = {
    inputs: ['dist_bottom', 'dist_top', 'angle'],
    hiddenLayers: [2, 3],
  };

  readonly inputNames = NeuralNetwork.settings.inputs;
  readonly outputNames = ['flap'];

  constructor() {
    let previous = this.inputNames.length;
    const hiddenLayers = NeuralNetwork.settings.hiddenLayers;

    for (const neurons of hiddenLayers) {
      this.layers.push(
        new NNLinearLayer(randMatrix(neurons, previous)),
        new NNTanhLayer(),
      );
      previous = neurons;
    }

    this.layers.push(
      new NNLinearLayer(randMatrix(this.outputNames.length, previous)),
      new NNTanhLayer(),
    );
  }

  run(input: Matrix2D<1, any>): Matrix2D<1, 1> {
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
