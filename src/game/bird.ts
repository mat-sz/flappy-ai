import { clamp } from '$/utils/math';
import { rectIntersect, Rect } from '$/utils/rect';
import {
  GAME_HEIGHT,
  FLAP_Y_VELOCITY,
  BIRD_WIDTH,
  GRAVITY,
  SCROLL_X_VELOCITY,
  BIRD_HEIGHT,
} from './consts';

export class Bird {
  x = 0;
  y = GAME_HEIGHT / 2;
  alive = true;
  yVelocity = FLAP_Y_VELOCITY;

  flap() {
    this.yVelocity = FLAP_Y_VELOCITY;
  }

  update(diffSec: number) {
    if (!this.alive) {
      return;
    }

    this.y += this.yVelocity * diffSec;
    this.yVelocity -= GRAVITY * diffSec;

    this.x += SCROLL_X_VELOCITY * diffSec;
    if (this.y < BIRD_HEIGHT || this.y > GAME_HEIGHT - BIRD_HEIGHT) {
      this.kill();
    }
  }

  checkPipes(rects: Rect[]) {
    const birdRect = this.rect;
    for (const rect of rects) {
      if (rectIntersect(birdRect, rect)) {
        this.kill();
        return;
      }
    }
  }

  get rect(): Rect {
    return {
      x: this.x,
      y: clamp(this.y, 0, GAME_HEIGHT),
      w: BIRD_WIDTH,
      h: BIRD_WIDTH,
    };
  }

  kill() {
    this.alive = false;
  }
}
