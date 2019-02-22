import { AnyBoundaryPolicy } from './boundary-policies';
import { BoundedView } from './BoundedView';


export class InterpolatedView extends BoundedView {
  private readonly _resampleRate: number;


  public constructor(samples: ReadonlyArray<number>, boundaryPolicy: AnyBoundaryPolicy, resampleRate: number) {
    super(samples, boundaryPolicy);

    if (resampleRate < 1.0) {
      throw new RangeError('Downsampling isn\'t supported.');
    }

    this._resampleRate = resampleRate;
  }


  public at(n: number): number | never {
    if (!Number.isInteger(n)) {
      throw new RangeError(`Non-integer index \`${n}' couldn't be used to access a sample.`);
    }

    if ((n < 0) || (n > (this.samplesCount - 1))) {
      throw new RangeError(`Index \`${n}' is out of bounds.`);
    }

    throw new Error('Not implemented.');
  }
}
