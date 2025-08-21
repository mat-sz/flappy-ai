import { EvolutionaryBird } from '$/evolution/bird';
import type { Simulation } from '$/simulation';
import { NeuralNetwork } from '$/nn';
import { NNLinearLayer } from '$/nn/layer';
import { CanvasView } from './base/canvas';

function color(value: number) {
  const abs = Math.abs(value);
  return `hsl(${value < 0 ? '200deg' : '0deg'} ${Math.sqrt(abs) * 100}% 50%)`;
}

interface LayerParams {
  i: number;
  x: number;
  neuronSpacing: number;
  neurons: { i: number; x: number; y: number; name?: string }[];
}

export class NeuronView extends CanvasView {
  layerParams: LayerParams[] = [];

  constructor(canvas: HTMLCanvasElement, simulation: Simulation) {
    super(canvas, simulation);
    this.setSize(500, 400);
  }

  computeParams(nn: NeuralNetwork) {
    const activations = nn.lastActivations!;
    const layerCount = activations.length;
    const layerSpacing = this.width / layerCount;
    const layerParams: LayerParams[] = activations.map(
      (layerActivations, i) => {
        const x = layerSpacing * (i + 0.5);
        const neuronSpacing = this.height / layerActivations[0].length;
        const nameArray =
          i === 0
            ? nn.inputNames
            : i === activations.length - 1
              ? nn.outputNames
              : undefined;
        return {
          i,
          x,
          neuronSpacing,
          neurons: layerActivations[0].map((_: any, j: number) => ({
            i: j,
            x,
            y: neuronSpacing * (j + 0.5),
            name: nameArray?.[j],
          })),
        };
      },
    );

    this.layerParams = layerParams;
  }

  reset() {
    this.layerParams = [];
  }

  frame() {
    const ctx = this.ctx;
    const bird = this.simulation.game.birds[
      this.simulation.selectedIndex
    ] as EvolutionaryBird;
    const activations = bird?.nn.lastActivations;
    if (!activations) {
      super.frame();
      return;
    }

    this.clear();

    if (!this.layerParams.length) {
      this.computeParams(bird.nn);
    }

    const neuronSize = 12;
    const weights = bird.nn.layers
      .filter(layer => layer instanceof NNLinearLayer)
      .map(layer => layer.weight);

    for (let i = 0; i < weights.length; i++) {
      const layerA = this.layerParams[i];
      const layerB = this.layerParams[i + 1];

      for (let j = 0; j < layerA.neurons.length; j++) {
        const startNeuron = layerA.neurons[j];
        const value = activations[layerA.i][0][startNeuron.i];

        for (let k = 0; k < layerB.neurons.length; k++) {
          const endNeuron = layerB.neurons[k];

          this.drawLine(startNeuron, endNeuron, {
            stroke: color(weights[i][k][j] * value),
          });
        }
      }
    }

    for (const layer of this.layerParams) {
      for (const neuron of layer.neurons) {
        const value = activations[layer.i][0][neuron.i];
        this.drawCircle(neuron, neuronSize, {
          stroke: value > 0 ? 'white' : undefined,
          lineWidth: 4,
          fill: color(value),
        });

        ctx.fillStyle = 'white';
        this.drawText(
          `${neuron.name ? `${neuron.name}: ` : ''}${value.toFixed(2)}`,
          neuron.x,
          neuron.y + neuronSize,
          { align: 'center' },
        );
      }
    }

    super.frame();
  }
}
