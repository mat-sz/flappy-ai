import GUI from 'lil-gui';

import type { Simulation } from '$/simulation';

export class SettingsView {
  gui;

  constructor(container: HTMLElement, simulation: Simulation) {
    this.gui = new GUI({ container });

    const evolutionFolder = this.gui.addFolder('Evolution');
    evolutionFolder.add(
      simulation.evolution.settings,
      'breedCount',
      1,
      1000,
      1,
    );
    evolutionFolder.add(
      simulation.evolution.settings,
      'breedMutationChance',
      0,
      1,
      0.01,
    );
    evolutionFolder.add(
      simulation.evolution.settings,
      'cloneBestCount',
      1,
      1000,
      1,
    );
    evolutionFolder.add(
      simulation.evolution.settings,
      'cloneTopCount',
      1,
      1000,
      1,
    );
    evolutionFolder.add(
      simulation.evolution.settings,
      'cloneMutationChance',
      0,
      1,
      0.01,
    );
    evolutionFolder.add(
      simulation.evolution.settings,
      'randomCount',
      1,
      500,
      1,
    );

    const simulationFolder = this.gui.addFolder('Simulation');
    simulationFolder.add(
      simulation.settings,
      'actionStepInterval',
      10,
      1000,
      10,
    );
    simulationFolder.add(
      simulation.settings,
      'simulationStepInterval',
      10,
      1000,
      10,
    );
    simulationFolder.add(simulation.settings, 'speed', 0.25, 16, 0.25);

    const gameFolder = this.gui.addFolder('Game');
    gameFolder.add(simulation.game.settings, 'randomSeed');
    gameFolder.add(
      simulation.game.settings,
      'seed',
      -2147483648,
      2147483647,
      1,
    );

    const viewSettings = this.gui.addFolder('View');
    viewSettings.add(simulation.settings, 'trackBestBird');

    const actionsFolder = this.gui.addFolder('Actions');
    actionsFolder.add(simulation, 'start');
    actionsFolder.add(simulation, 'stop');
    actionsFolder.add(simulation, 'reset');
    actionsFolder.add(simulation, 'killAll');
  }

  update() {
    for (const controller of this.gui.controllersRecursive()) {
      controller.updateDisplay();
    }
  }
}
