import { NeuralNetwork } from '$/nn';
import type { Simulation } from '$/simulation';
import { CanvasView } from './base/canvas';

export class EditorView extends CanvasView {
  inputs: Record<string, boolean> = {
    dist_top: false,
    dist_bottom: false,
    angle: false,
    bird_y: false,
  };
  hiddenLayers: number[] = [];

  inputsEl;
  inputTemplate;

  layersEl;
  layerTemplate;

  addLayerBtn;

  constructor(
    trigger: HTMLElement,
    dialog: HTMLDialogElement,
    simulation: Simulation,
  ) {
    trigger.addEventListener('click', () => {
      this.reset();
      dialog.showModal();
    });

    const canvas = dialog.querySelector('canvas')!;
    super(canvas, simulation);
    this.setSize(500, 400);

    this.addLayerBtn = dialog.querySelector('#addLayer') as HTMLButtonElement;
    this.addLayerBtn.addEventListener('click', () => {
      this.hiddenLayers.push(1);
      this.updateLayers();
    });

    for (const cancelEl of dialog.querySelectorAll('.cancel')) {
      cancelEl.addEventListener('click', () => {
        dialog.close();
      });
    }

    dialog.querySelector('.save')!.addEventListener('click', () => {
      const inputs = Object.entries(this.inputs)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      if (!inputs.length) {
        return;
      }

      NeuralNetwork.settings = {
        inputs,
        hiddenLayers: [...this.hiddenLayers],
      };
      simulation.reset();
      dialog.close();
    });

    this.inputsEl = dialog.querySelector('.inputs')!;
    this.inputTemplate = dialog.querySelector(
      '#editorInputTemplate',
    ) as HTMLTemplateElement;

    this.layersEl = dialog.querySelector('.layers')!;
    this.layerTemplate = dialog.querySelector(
      '#editorLayerTemplate',
    ) as HTMLTemplateElement;
  }

  updateLayers() {
    this.addLayerBtn.disabled = this.hiddenLayers.length >= 5;
    this.layersEl.innerHTML = '';
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      const neuronCount = this.hiddenLayers[i];
      const clone = this.layerTemplate.content.cloneNode(true) as HTMLElement;

      const selectEl = clone.querySelector('select')!;
      selectEl.value = neuronCount.toString();
      selectEl.addEventListener('change', () => {
        this.hiddenLayers[i] = parseInt(selectEl.value);
      });

      const buttonEl = clone.querySelector('button')!;
      buttonEl.addEventListener('click', () => {
        this.hiddenLayers.splice(i, 1);
        this.updateLayers();
      });
      this.layersEl.append(clone);
    }
  }

  reset() {
    this.inputs = Object.fromEntries(
      Object.entries(this.inputs).map(([key]) => [
        key,
        NeuralNetwork.settings.inputs.includes(key),
      ]),
    );
    this.hiddenLayers = [...NeuralNetwork.settings.hiddenLayers];

    this.inputsEl.innerHTML = '';
    for (const [key, value] of Object.entries(this.inputs)) {
      const clone = this.inputTemplate.content.cloneNode(true) as HTMLElement;
      clone.querySelector('.name')!.textContent = key;

      const inputEl = clone.querySelector('input')!;
      inputEl.checked = value;
      clone.querySelector('input')!.addEventListener('change', () => {
        this.inputs[key] = inputEl.checked;
      });

      this.inputsEl.append(clone);
    }

    this.updateLayers();
  }

  computeParams() {
    const layerCount = this.hiddenLayers.length + 2;
    const layerSpacing = this.width / layerCount;
    const selectedInputs = Object.entries(this.inputs)
      .filter(([_, selected]) => selected)
      .map(([key]) => key);
    const outputs = ['flap'];

    return Array.from({ length: layerCount }, (_, i) => {
      const x = layerSpacing * (i + 0.5);
      const names =
        i === 0
          ? selectedInputs
          : i === layerCount - 1
            ? outputs
            : new Array(this.hiddenLayers[i - 1]).fill(undefined);
      const neuronCount =
        i === 0
          ? selectedInputs.length
          : i === layerCount - 1
            ? outputs.length
            : this.hiddenLayers[i - 1];
      const neuronSpacing = this.height / neuronCount;

      return {
        i,
        x,
        neuronSpacing,
        neurons: names.map((name, j) => ({
          i: j,
          x,
          y: neuronSpacing * (j + 0.5),
          name,
        })),
      };
    });
  }

  frame() {
    const ctx = this.ctx;
    this.clear();

    const layerParams = this.computeParams();

    const neuronSize = 12;

    for (let i = 0; i < layerParams.length - 1; i++) {
      const layerA = layerParams[i];
      const layerB = layerParams[i + 1];

      for (let j = 0; j < layerA.neurons.length; j++) {
        const startNeuron = layerA.neurons[j];

        for (let k = 0; k < layerB.neurons.length; k++) {
          const endNeuron = layerB.neurons[k];

          this.drawLine(startNeuron, endNeuron, {
            stroke: '#999999',
          });
        }
      }
    }

    for (const layer of layerParams) {
      for (const neuron of layer.neurons) {
        this.drawCircle(neuron, neuronSize, {
          lineWidth: 4,
          fill: 'white',
        });

        ctx.fillStyle = 'white';

        if (neuron.name) {
          this.drawText(neuron.name, neuron.x, neuron.y + neuronSize, {
            align: 'center',
          });
        }
      }
    }

    super.frame();
  }
}
