import { Matrix2D } from './types';
import { linear, tanh } from './utils';

export abstract class NNLayer<
  TInput extends Matrix2D,
  TOutput extends Matrix2D,
> {
  abstract forward(input: TInput): TOutput;
}

export class NNLinearLayer<
  TInputFeatures extends number,
  TOutputFeatures extends number,
> extends NNLayer<
  Matrix2D<TInputFeatures, any>,
  Matrix2D<TOutputFeatures, any>
> {
  constructor(public weight: Matrix2D<TOutputFeatures, TInputFeatures>) {
    super();
  }

  forward(
    input: Matrix2D<any, TInputFeatures>,
  ): Matrix2D<TOutputFeatures, any> {
    return linear(input, this.weight);
  }
}

export class NNTanhLayer<TMatrix extends Matrix2D> extends NNLayer<
  TMatrix,
  TMatrix
> {
  forward(input: TMatrix): TMatrix {
    return tanh(input);
  }
}
