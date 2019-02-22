import { BoundaryPolicy } from './BoundaryPolicy';


export class ReflectBoundary extends BoundaryPolicy {
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


export class RepeatBoundary extends BoundaryPolicy {
  public constructor() {
    super();
  }


  public at(n: number, samplesCount: number): number | never {
    if (n < 0) {
      return 0;
    }

    if (n > (samplesCount - 1)) {
      return samplesCount - 1;
    }

    return super.at(n);
  }
}
