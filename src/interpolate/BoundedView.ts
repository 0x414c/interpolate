import { BoundaryPolicy } from './BoundaryPolicy';
import { DiscreteSignal } from './DiscreteSignal';


export class BoundedView {
  private readonly _discreteSignal: DiscreteSignal;

  private readonly _boundaryPolicy: BoundaryPolicy;


  public constructor(discreteSignal: DiscreteSignal, boundaryPolicy: BoundaryPolicy) {
    this._discreteSignal = discreteSignal;
    this._boundaryPolicy = boundaryPolicy;
  }


  public get samplesCount(): number {
    return this._discreteSignal.samplesCount;
  }


  public at(n: number): number | never {
    return this._discreteSignal.at(this._boundaryPolicy.at(n, this.samplesCount));
  }


  public entries(): IterableIterator<[number, number]> {
    return this._discreteSignal.entries();
  }


  public [Symbol.iterator](): IterableIterator<number> {
    return this._discreteSignal[Symbol.iterator]();
  }
}
