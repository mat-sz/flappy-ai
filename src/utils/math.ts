import { Point } from './rect';

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randInt(min: number, max: number) {
  return Math.floor(rand(min, max));
}

export function median(array: number[]): number {
  const mid = Math.floor(array.length / 2);
  if (array.length % 2 === 1) {
    return array[mid];
  }

  return (array[mid] + array[mid + 1]) / 2;
}

export function average(array: number[]): number {
  let total = 0;
  for (const item of array) {
    total += item;
  }
  return total / array.length;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min);
}

export function normalizeValue(value: number, range: number) {
  const halfRange = range / 2;
  return clamp((value - halfRange) / halfRange, -1, 1);
}

export function distance(a: Point, b: Point) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function atan2(a: Point, b: Point, c: Point) {
  return Math.atan2(b.y - a.y, b.x - a.x) - Math.atan2(c.y - a.y, c.x - a.x);
}

export function angle(a: Point, b: Point, c: Point) {
  const val = atan2(a, b, c);

  if (val > Math.PI) {
    return val - 2 * Math.PI;
  } else if (val <= -Math.PI) {
    return val + 2 * Math.PI;
  }

  return val;
}

export function subVectors(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function linePointWithMinimumDistance(a: Point, b: Point, d: number) {
  const dist = distance(a, b);
  if (dist >= d) {
    return b;
  }

  const scale = dist / d;
  const v = subVectors(b, a);
  return { x: a.x + v.x / scale, y: a.y + v.y / scale };
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function mapScale(
  value: number,
  minFrom: number,
  maxFrom: number,
  minTo: number,
  maxTo: number,
): number {
  return ((value - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
}
