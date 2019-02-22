import { BoundedView } from './BoundedView';
import { CompensatingSummator } from './CompensatingSummator';
import { FirKernel } from './FirKernel';


export class Interpolator {
  private readonly _boundedView: BoundedView;

  private readonly _interpolatingKernel: FirKernel;


  public constructor(boundedView: BoundedView, interpolatingKernel: FirKernel) {
    this._boundedView = boundedView;
    this._interpolatingKernel = interpolatingKernel;
  }


  public at(x: number): number {
    const from = Math.floor(x) - this._interpolatingKernel.radius + 1;
    const until = Math.floor(x) + this._interpolatingKernel.radius + 1;
    const sum = new CompensatingSummator();
    for (let i = from; i < until; ++i) {
      sum.add(this._boundedView.at(i) * this._interpolatingKernel.at(x - i));
    }

    return sum.total;
  }
}
