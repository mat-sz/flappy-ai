import { Matrix2D } from '$/nn/types';
import { randMatrixItem } from '$/nn/utils';

export function breed<TMatrix extends Matrix2D>(
  a: TMatrix,
  b: TMatrix,
  mutationChance = 0.05,
): TMatrix {
  return a.map((col, colI) =>
    col.map((item, rowI) => {
      if (Math.random() <= mutationChance) {
        return randMatrixItem();
      }

      const rand = Math.random();
      return item * rand + b[colI][rowI] * (1 - rand);
    }),
  ) as any;
}

export function applyMutations<TMatrix extends Matrix2D>(
  a: TMatrix,
  mutationChance: number,
): TMatrix {
  return a.map(col =>
    col.map(item =>
      Math.random() <= mutationChance ? randMatrixItem() : item,
    ),
  ) as any;
}
