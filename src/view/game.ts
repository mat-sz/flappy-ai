import { EvolutionaryBird } from '$/evolution/bird';
import { sprites } from '$/game/assets';
import {
  BIRD_HEIGHT,
  BIRD_WIDTH,
  FLAP_Y_VELOCITY,
  GAME_HEIGHT,
  GAME_WIDTH,
  GRAVITY,
  HOLE_HEIGHT,
} from '$/game/consts';
import { calculateScore } from '$/game/utils';
import type { Simulation } from '$/simulation';
import { scaleImage } from '$/utils/image';
import { clamp } from '$/utils/math';
import { Point, Rect, rectContains } from '$/utils/rect';
import { CanvasView } from './base/canvas';

interface Marker {
  label: string;
  x: number;
  color?: string;
}

const X_OFFSET = 60;

export class GameView extends CanvasView {
  private markers: Record<string, Marker> = {};
  private backgroundPattern;
  private backgroundPatternWidth;

  constructor(canvas: HTMLCanvasElement, simulation: Simulation) {
    super(canvas, simulation);

    const background = scaleImage(sprites.background, this.scale);
    this.backgroundPattern = this.ctx.createPattern(background, 'repeat-x')!;
    this.backgroundPatternWidth = background.width;

    this.setSize(GAME_WIDTH, GAME_HEIGHT);

    this.simulation.evolution.on('generation', generation => {
      this.setMarker(
        `gen${generation.index}`,
        `Gen ${generation.index}`,
        generation.bestX,
      );
      this.setMarker('best', '', this.simulation.evolution.bestX, 'red');
    });

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const point = { x: e.clientX - rect.x, y: e.clientY - rect.y };

      for (const bird of this.visibleBirds) {
        const rect = this.getBirdRect(bird);
        if (rectContains(rect, point)) {
          this.simulation.select(bird.index!, true);
          return;
        }
      }
    });
  }

  get visibleBirds() {
    const minX = this.simulation.x - X_OFFSET - BIRD_WIDTH;
    const maxX = minX + this.width + BIRD_WIDTH;
    return this.simulation.evolution.birds.filter(
      bird => bird.x >= minX && bird.x <= maxX,
    );
  }

  setMarker(id: string, label: string, x: number, color?: string) {
    delete this.markers[id];
    this.markers[id] = { label, x, color };
  }

  reset() {
    this.markers = {};
  }

  drawPipe(pipe: Point) {
    const point = this.transformPoint(pipe);
    this.drawSprite(sprites.pipeFlipped, point.x, point.y - HOLE_HEIGHT, {
      anchorV: 'bottom',
    });
    this.drawSprite(sprites.pipe, point.x, point.y);
  }

  drawBackground() {
    const offset = Math.floor(
      (this.simulation.x / this.scale / 1.5) % this.backgroundPatternWidth,
    );
    this.ctx.save();
    this.ctx.translate(-offset, 0);
    this.ctx.fillStyle = this.backgroundPattern;
    this.ctx.fillRect(0, 0, this.canvas.width + offset, this.canvas.height);
    this.ctx.restore();
  }

  transformX(x: number): number {
    return X_OFFSET - (this.simulation.x - x);
  }

  transformY(y: number): number {
    return this.height - y;
  }

  transformPoint(point: Point): Point {
    return {
      x: this.transformX(point.x),
      y: this.transformY(point.y),
    };
  }

  transformRect(rect: Rect): Rect {
    const point = this.transformPoint(rect);
    return {
      x: point.x,
      y: point.y - rect.h,
      w: rect.w,
      h: rect.h,
    };
  }

  getBirdRect(bird: EvolutionaryBird): Rect {
    return this.transformRect({
      x: bird.x,
      y: bird.y,
      w: BIRD_WIDTH,
      h: BIRD_HEIGHT,
    });
  }

  drawBird(bird: EvolutionaryBird) {
    const rect = this.getBirdRect(bird);
    const yVelocity = clamp(
      (FLAP_Y_VELOCITY + bird.yVelocity) / FLAP_Y_VELOCITY,
      -GRAVITY,
      FLAP_Y_VELOCITY,
    );
    const angle = -yVelocity * (Math.PI / 12);
    this.drawSprite(sprites.birdMidflap, rect.x, rect.y, {
      anchorV: 'middle',
      angle,
    });

    if (bird.index === this.simulation.selectedIndex) {
      this.drawRect(rect, { stroke: 'yellow' });

      const pointPairs = bird.getInputPointPairs(this.simulation.game);
      for (let i = 0; i < pointPairs.length; i++) {
        const pair = pointPairs[i];
        this.drawLine(
          this.transformPoint(pair[0]),
          this.transformPoint(pair[1]),
          { text: bird.nn.inputNames[i], stroke: 'yellow' },
        );
      }
    }
  }

  drawBirdText(bird: EvolutionaryBird) {
    const { x, y, w } = this.getBirdRect(bird);

    this.drawText(`#${bird.index}`, x + w / 2, y - 20, {
      color: 'black',
      align: 'center',
    });
  }

  frame() {
    this.clear();
    this.drawBackground();

    const { game } = this.simulation;
    const currentX = this.simulation.x;
    const minX = currentX + X_OFFSET;
    const pipes = game.getPipesInRange(minX, minX + this.width);
    for (const pipe of pipes) {
      this.drawPipe(pipe);
    }

    for (const marker of Object.values(this.markers)) {
      const x = this.transformX(marker.x);
      if (x <= -100 || x > this.width) {
        continue;
      }

      this.drawLine(
        { x, y: 0 },
        { x, y: this.height },
        {
          lineWidth: 2,
          stroke: marker.color ?? '#333333',
          text: marker.label,
          textAlignV: 'start',
          textOptions: {
            padding: 4,
            align: 'left',
            size: 16,
          },
        },
      );
    }

    const birds = this.visibleBirds;
    for (const bird of birds) {
      this.drawBird(bird);
    }

    for (const bird of birds) {
      this.drawBirdText(bird);
    }

    this.drawText(
      `Birds: ${game.aliveBirds.length} / ${game.birds.length}`,
      4,
      4,
    );
    this.drawText(`Tracking bird: #${this.simulation.selectedIndex}`, 4, 20);
    this.drawText(`X: ${Math.floor(currentX)}`, 4, 36);
    this.drawText(`Score: ${calculateScore(currentX)}`, 4, 52);

    super.frame();
  }
}
