import type { Simulation } from '$/simulation';
import { getSize, SpriteElement } from '$/utils/image';
import { midpoint } from '$/utils/math';
import { Point, Rect } from '$/utils/rect';

export interface TextOptions {
  size?: number;
  color?: string;
  align?: CanvasTextAlign;
  padding?: number;
}

export class CanvasView {
  protected ctx;

  scale = 2;

  constructor(
    protected canvas: HTMLCanvasElement,
    protected simulation: Simulation,
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.ctx.font = '16px sans-serif';

    this.frame = this.frame.bind(this);
    requestAnimationFrame(this.frame);
  }

  get width() {
    return this.ctx.canvas.width / this.scale;
  }

  get height() {
    return this.ctx.canvas.height / this.scale;
  }

  drawText(
    text: string | number,
    x: number,
    y: number,
    {
      size = 12,
      color = 'white',
      align = 'left',
      padding = 0,
    }: TextOptions = {},
  ) {
    const ctx = this.ctx;
    ctx.font = `${size * this.scale}px sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(
      text.toString(),
      (x + padding) * this.scale,
      (y + padding) * this.scale,
    );
  }

  drawSprite(
    sprite: SpriteElement,
    x: number,
    y: number,
    {
      anchorH = 'left',
      anchorV = 'top',

      angle,
    }: {
      anchorV?: 'top' | 'middle' | 'bottom';
      anchorH?: 'left' | 'center' | 'right';
      angle?: number;
    } = {},
  ) {
    let { w, h } = getSize(sprite);

    switch (anchorH) {
      case 'center':
        x -= w / 2;
        break;
      case 'right':
        x -= w;
        break;
    }

    switch (anchorV) {
      case 'middle':
        y -= h / 2;
        break;
      case 'bottom':
        y -= h;
        break;
    }

    const ctx = this.ctx;

    x = Math.floor(x * this.scale);
    y = Math.floor(y * this.scale);
    w = Math.floor(w * this.scale);
    h = Math.floor(h * this.scale);

    if (angle) {
      ctx.save();
      ctx.translate(x, y + h / 2);
      ctx.rotate(angle);
      ctx.drawImage(sprite, 0, 0, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(sprite, x, y, w, h);
    }
  }

  scalePoint(point: Point): [number, number] {
    return [point.x * this.scale, point.y * this.scale];
  }

  scaleRect(rect: Rect): [number, number, number, number] {
    return [
      rect.x * this.scale,
      rect.y * this.scale,
      rect.w * this.scale,
      rect.h * this.scale,
    ];
  }

  drawRect(
    rect: Rect,
    {
      stroke,
      fill,
      lineWidth = 2,
    }: {
      stroke?: string;
      fill?: string;
      lineWidth?: number;
    },
  ) {
    const scaled = this.scaleRect(rect);
    if (stroke) {
      this.ctx.lineWidth = lineWidth * this.scale;
      this.ctx.strokeStyle = stroke;
      this.ctx.strokeRect(...scaled);
    }

    if (fill) {
      this.ctx.fillStyle = fill;
      this.ctx.fillRect(...scaled);
    }
  }

  drawLine(
    a: Point,
    b: Point,
    {
      stroke,
      text,
      textAlignV = 'center',
      textOptions,
      lineWidth = 2,
    }: {
      stroke: string;
      lineWidth?: number;
      text?: string;
      textAlignV?: 'start' | 'center' | 'end';
      textOptions?: TextOptions;
    },
  ) {
    this.ctx.lineWidth = lineWidth * this.scale;
    this.ctx.strokeStyle = stroke;
    this.ctx.beginPath();
    this.ctx.moveTo(...this.scalePoint(a));
    this.ctx.lineTo(...this.scalePoint(b));
    this.ctx.stroke();

    if (text) {
      const mid =
        textAlignV === 'center' ? midpoint(a, b) : textAlignV === 'end' ? b : a;
      this.drawText(text, mid.x, mid.y, {
        color: stroke,
        ...textOptions,
      });
    }
  }

  drawCircle(
    point: Point,
    diameter: number,
    {
      stroke,
      lineWidth = 2,
      fill,
      startAngle = 0,
      endAngle = 2 * Math.PI,
    }: {
      stroke?: string;
      lineWidth?: number;
      fill?: string;
      startAngle?: number;
      endAngle?: number;
    } = {},
  ) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(
      ...this.scalePoint(point),
      (diameter / 2) * this.scale,
      startAngle,
      endAngle,
    );

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth * this.scale;
      ctx.stroke();
    }

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  frame() {
    requestAnimationFrame(this.frame);
  }

  setSize(width: number, height: number) {
    this.canvas.width = Math.floor(width * this.scale);
    this.canvas.height = Math.floor(height * this.scale);
    this.canvas.style.width = `${width}px`;
  }
}
