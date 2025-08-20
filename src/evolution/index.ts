import { BasicEventEmitter } from '$/utils/events';
import { rand } from '$/utils/math';
import { EvolutionaryBird } from './bird';
import { Generation } from './generation';

export interface EvolutionSettings {
  breedCount: number;
  cloneTopCount: number;
  cloneBestCount: number;
  randomCount: number;
  breedMutationChance: number;
  cloneMutationChance: number;
}

export class Evolution extends BasicEventEmitter<{
  generation: [generation: Generation];
  birds: [birds: EvolutionaryBird[]];
}> {
  generations: Generation[] = [];
  birds: EvolutionaryBird[] = [];

  public bestX = 0;
  public settings: EvolutionSettings = {
    breedCount: 25,
    cloneTopCount: 3,
    cloneBestCount: 2,
    randomCount: 5,
    breedMutationChance: 0.05,
    cloneMutationChance: 0,
  };

  get gen() {
    return this.generations.length;
  }

  randomBirdByFitness(bestBirds: EvolutionaryBird[], totalFitness: number) {
    let value = rand(0, totalFitness);
    for (const bird of bestBirds) {
      value -= bird.fitness;
      if (value < 0) {
        return bird;
      }
    }

    return bestBirds[bestBirds.length - 1];
  }

  reset() {
    this.bestX = 0;
    this.generations.length = 0;

    const birds: EvolutionaryBird[] = [];
    const total =
      this.settings.breedCount +
      this.settings.cloneBestCount +
      this.settings.cloneTopCount +
      this.settings.randomCount;
    for (let i = 0; i < total; i++) {
      birds.push(new EvolutionaryBird(this.gen));
    }

    this.setBirds(birds);
    this.emit('birds', this.birds);
  }

  setBirds(birds: EvolutionaryBird[]) {
    this.birds = birds;
    for (let i = 0; i < this.birds.length; i++) {
      this.birds[i].index = i;
    }
  }

  next() {
    const generation = new Generation(this.gen, this.birds);
    this.generations.push(generation);

    if (generation.bestX > this.bestX) {
      this.bestX = generation.bestX;
    }

    const {
      breedCount,
      cloneBestCount,
      cloneTopCount,
      randomCount,
      breedMutationChance,
      cloneMutationChance,
    } = this.settings;

    const birds: EvolutionaryBird[] = [];

    for (let i = 0; i < breedCount; i++) {
      birds.push(
        generation
          .pick()
          .breed(this.gen, generation.pick(), breedMutationChance),
      );
    }

    for (let i = 0; i < cloneTopCount; i++) {
      birds.push(generation.birds[i].clone(cloneMutationChance));
    }

    for (let i = 0; i < cloneBestCount; i++) {
      birds.push(generation.best.clone(cloneMutationChance));
    }

    for (let i = 0; i < randomCount; i++) {
      birds.push(new EvolutionaryBird(this.gen));
    }

    this.setBirds(birds);

    this.emit('generation', generation);
    this.emit('birds', birds);
  }
}
