import { AnyBoundaryPolicy } from './boundary-policies';
import { DiscreteSignal } from './DiscreteSignal';


export class BoundedView extends DiscreteSignal {
  private readonly _boundaryPolicy: AnyBoundaryPolicy;


  public constructor(samples: ReadonlyArray<number>, boundaryPolicy: AnyBoundaryPolicy) {
    super(samples);

    this._boundaryPolicy = boundaryPolicy;
  }


  public at(n: number): number | never {
    return super.at(this._boundaryPolicy.at(n, this.samplesCount));
  }
}
