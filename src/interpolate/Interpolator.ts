import { BoundedView } from './BoundedView';
import { CompensatingSummator } from './utils';
import { AnyFirKernel } from './kernels';


export class Interpolator {
  private readonly _boundedView: BoundedView;

  private readonly _interpolatingKernel: AnyFirKernel;


  public constructor(boundedView: BoundedView, interpolatingKernel: AnyFirKernel) {
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
