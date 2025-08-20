import { Evolution } from './evolution';
import { EvolutionaryBird } from './evolution/bird';
import { Game } from './game';
import { BasicEventEmitter } from './utils/events';
import { ChartView } from './view/chart';
import { GameView } from './view/game';
import { NeuronView } from './view/neuron';
import { SettingsView } from './view/settings';
import { TableView } from './view/table';

interface SimulationSettings {
  speed: number;
  actionStepInterval: number;
  simulationStepInterval: number;
  trackBestBird: boolean;
}

export class Simulation extends BasicEventEmitter<{
  select: [index: number];
}> {
  game = new Game();
  evolution = new Evolution();

  settings: SimulationSettings = {
    speed: 4,
    actionStepInterval: 100,
    simulationStepInterval: 50,
    trackBestBird: true,
  };

  running = false;

  selectedIndex = 0;

  gameView;
  chartView;
  tableView;
  settingsView;
  neuronView;

  private actionTimeout: any;
  private simulationTimeout: any;

  constructor() {
    super();

    this.evolution.on('birds', birds => {
      // TODO: Think of a better way to pass birds.
      this.game.reset();
      this.game.birds = birds;
      this.game.running = true;
      this.select(0);
    });

    this.chartView = new ChartView(
      document.getElementById('chart') as HTMLCanvasElement,
      this.evolution,
    );
    this.tableView = new TableView(
      document.getElementById('birdsTbody')!,
      this,
    );
    this.gameView = new GameView(
      document.getElementById('game') as HTMLCanvasElement,
      this,
    );
    this.settingsView = new SettingsView(
      document.getElementById('settings')!,
      this,
    );
    this.neuronView = new NeuronView(
      document.getElementById('neurons') as HTMLCanvasElement,
      this,
    );

    this.actionStep = this.actionStep.bind(this);
    this.simulationStep = this.simulationStep.bind(this);
    this.dynamicUpdate = this.dynamicUpdate.bind(this);

    setInterval(this.dynamicUpdate, 50);

    document.getElementById('loading')!.remove();
  }

  get selectedBird(): EvolutionaryBird | undefined {
    return this.evolution.birds[this.selectedIndex];
  }

  get x() {
    return this.selectedBird?.x ?? this.game.x;
  }

  dynamicUpdate() {
    if (!this.running) {
      return;
    }

    this.tableView.dynamicUpdate();

    const firstAlive = this.game.aliveBirds[0];
    if (this.settings.trackBestBird && firstAlive) {
      const bestBirdIndex = this.game.birds.indexOf(firstAlive);
      this.select(bestBirdIndex);
    }
  }

  select(index: number, stopTracking = false) {
    if (stopTracking && this.settings.trackBestBird) {
      this.settings.trackBestBird = false;
      this.settingsView.update();
    }

    if (this.selectedIndex === index) {
      return;
    }
    this.selectedIndex = index;
    this.tableView.select(index);
  }

  actionStep() {
    if (!this.running) {
      return;
    }

    const { actionStepInterval, speed } = this.settings;
    for (const bird of this.evolution.birds) {
      bird.neuralStep(this.game);
    }

    this.actionTimeout = setTimeout(
      this.actionStep,
      actionStepInterval / speed,
    );
  }

  simulationStep() {
    if (!this.running) {
      return;
    }

    const { simulationStepInterval, speed } = this.settings;
    this.game.step(simulationStepInterval / 1000);

    if (!this.game.aliveBirds.length) {
      this.evolution.next();
    }

    this.simulationTimeout = setTimeout(
      this.simulationStep,
      simulationStepInterval / speed,
    );
  }

  reset() {
    this.stop();

    this.game.reset();
    this.evolution.reset();

    this.gameView.reset();
    this.tableView.update();
    this.chartView.reset();

    this.start();
  }

  start() {
    this.stop();
    this.running = true;
    this.actionStep();
    this.simulationStep();
  }

  stop() {
    clearTimeout(this.simulationTimeout);
    clearTimeout(this.actionTimeout);
    this.running = false;
  }

  killAll() {
    for (const bird of this.game.aliveBirds) {
      bird.kill();
    }
  }
}
