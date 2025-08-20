import { Matrix2D } from './types';

export function randMatrixItem() {
  return 1 - Math.random() * 2;
}

export function randMatrix<TRows extends number, TColumns extends number>(
  rows: TRows,
  columns: TColumns,
): Matrix2D<TRows, TColumns> {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, randMatrixItem),
  ) as any;
}

export function transpose<TRows extends number, TColumns extends number>(
  input: Matrix2D<TRows, TColumns>,
): Matrix2D<TColumns, TRows> {
  return input[0].map((_, col) => input.map(row => row[col])) as any;
}

export function multiply<
  TRows extends number,
  TN extends number,
  TColumns extends number,
>(
  a: Matrix2D<TRows, TN>,
  b: Matrix2D<TN, TColumns>,
): Matrix2D<TColumns, TRows> {
  const aNumRows = a.length,
    aNumCols = a[0].length,
    bNumCols = b[0].length;

  // TODO: Use a better algorithm for this.
  // Doesn't really matter for the small matrices we're dealing with right now.
  const m = new Array(aNumRows) as any as Matrix2D<TColumns, TRows>;
  for (let r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols) as any;
    for (let c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;
      for (let i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }

  return m;
}

export function multiplyScalar<TMatrix extends Matrix2D>(
  a: TMatrix,
  b: number,
): TMatrix {
  return a.map(col => col.map(item => item * b)) as any;
}

export function add<TMatrix extends Matrix2D>(a: TMatrix, b: TMatrix): TMatrix {
  return a.map((col, colI) =>
    col.map((item, rowI) => item + b[colI][rowI]),
  ) as any;
}

export function linear<
  TRows extends number,
  TColumns extends number,
  TWeightRows extends number,
>(
  input: Matrix2D<TRows, TColumns>,
  weight: Matrix2D<TWeightRows, TColumns>,
  bias?: Matrix2D<TWeightRows, TRows>,
): Matrix2D<TWeightRows, TRows> {
  const output = multiply(input, transpose(weight));
  return bias ? add(output, bias) : output;
}

export function tanh<TMatrix extends Matrix2D>(input: TMatrix): TMatrix {
  return input.map(col => col.map(item => Math.tanh(item))) as any;
}
