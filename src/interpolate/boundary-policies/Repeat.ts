import { AnyBoundaryPolicy } from './AnyBoundaryPolicy';


export class Repeat extends AnyBoundaryPolicy {
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
