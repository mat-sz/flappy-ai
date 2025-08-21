import { Point } from '$/utils/rect';

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
  TObj,
  Exclude<keyof TObj, ArrayLengthMutationKeys>
> & {
  readonly length: L;
  [I: number]: T;
  [Symbol.iterator]: () => IterableIterator<T>;
  // TODO: Add types for .map, etc.
};

export type Matrix2D<
  TRows extends number = any,
  TColumns extends number = any,
> = FixedLengthArray<FixedLengthArray<number, TColumns>, TRows>;

export interface BirdInputDistance {
  type: 'distance';
  points: [Point, Point];
}

export interface BirdInputAngle {
  type: 'angle';
  points: [Point, Point, Point];
}

export type BirdInput = BirdInputDistance | BirdInputAngle;
