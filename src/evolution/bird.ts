import { NeuralNetwork } from '$/nn';
import { NeuralBird } from '$/nn/bird';
import { NNLinearLayer } from '$/nn/layer';
import { applyMutations, breed } from './utils';

export type EvolutionaryBirdParents = [EvolutionaryBird, EvolutionaryBird];

export type EvolutionaryBirdSource = 'random' | 'breed' | 'clone';

export class EvolutionaryBird extends NeuralBird {
  rank?: number;
  index?: number;

  constructor(
    public readonly gen: number,
    public readonly lineage?: EvolutionaryBirdParents,
    public readonly source: EvolutionaryBirdSource = 'random',
    nn?: NeuralNetwork,
  ) {
    super(nn);
  }

  breed(
    gen: number,
    bird: EvolutionaryBird,
    mutationChance = 0.05,
  ): EvolutionaryBird {
    const nn = new NeuralNetwork();
    for (let i = 0; i < nn.layers.length; i++) {
      const destinationLayer = nn.layers[i];
      if (destinationLayer instanceof NNLinearLayer) {
        const layerA = this.nn.layers[i] as NNLinearLayer<any, any>;
        const layerB = bird.nn.layers[i] as NNLinearLayer<any, any>;
        destinationLayer.weight = breed(
          layerA.weight,
          layerB.weight,
          mutationChance,
        );
      }
    }

    return new EvolutionaryBird(gen, [this, bird], 'breed', nn);
  }

  clone(mutationChance = 0): EvolutionaryBird {
    const nn = new NeuralNetwork();
    for (let i = 0; i < nn.layers.length; i++) {
      const destinationLayer = nn.layers[i];
      if (destinationLayer instanceof NNLinearLayer) {
        const sourceLayer = this.nn.layers[i] as NNLinearLayer<any, any>;
        destinationLayer.weight = mutationChance
          ? applyMutations(sourceLayer.weight, mutationChance)
          : sourceLayer.weight;
      }
    }

    return new EvolutionaryBird(this.gen, this.lineage, 'clone', this.nn);
  }
}
