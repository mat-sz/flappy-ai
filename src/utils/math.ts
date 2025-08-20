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
