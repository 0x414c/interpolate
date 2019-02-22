import { AnyBoundaryPolicy } from './AnyBoundaryPolicy';


export class Mirror extends AnyBoundaryPolicy {
  public constructor() {
    super();
  }


  public at(n: number, samplesCount: number): number | never {
    if ((n < 0) || (n > (samplesCount - 1))) {
      return this._remap(n, samplesCount - 1);
    }

    return super.at(n);
  }


  private _remap(n: number, halfPeriod: number): number {
    return Math.abs((n + halfPeriod) % (2 * halfPeriod) - halfPeriod);
  }
}
