import { average, median, rand } from '$/utils/math';
import { EvolutionaryBird } from './bird';

export class Generation {
  birds: EvolutionaryBird[];
  totalFitness: number;

  constructor(
    public index: number,
    birds: EvolutionaryBird[],
  ) {
    this.birds = birds.toSorted((a, b) => b.fitness - a.fitness);

    let totalFitness = 0;
    for (let i = 0; i < this.birds.length; i++) {
      const bird = this.birds[i];
      bird.rank = i;
      totalFitness += bird.fitness;
    }

    this.totalFitness = totalFitness;
  }

  get best() {
    return this.birds[0];
  }

  get worst() {
    return this.birds[this.birds.length - 1];
  }

  get medianX() {
    return median(this.birds.map(bird => bird.x));
  }

  get averageX() {
    return average(this.birds.map(bird => bird.x));
  }

  get bestX() {
    return this.best.x;
  }

  get worstX() {
    return this.worst.x;
  }

  pick() {
    let value = rand(0, this.totalFitness);
    for (const bird of this.birds) {
      value -= bird.fitness;
      if (value < 0) {
        return bird;
      }
    }

    return this.best;
  }
}
