import { CompensatingSummator } from '../utils';
import { AnyWindowedFirKernel } from './AnyWindowedFirKernel';


const _sinc = (x: number) => Math.sin(Math.PI * x) / (Math.PI * x);


const _sincImpulseResponse = (x: number) => (x === 0.0) ? 1.0 : _sinc(x);


export class LanczosKernel extends AnyWindowedFirKernel {
  public constructor(radius: number) {
    super(radius, _sincImpulseResponse, (x: number) => (x === 0.0) ? 1.0 : _sinc(x / radius));
  }


  public at(x: number): number {
    const from = Math.floor(x) - this.radius + 1;
    const until = Math.floor(x) + this.radius + 1;
    const sum = new CompensatingSummator();
    for (let j = from; j < until; ++j) {
      sum.add(super.at(x - j));
    }

    return super.at(x) / sum.total;
  }
}
