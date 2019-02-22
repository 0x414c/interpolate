import { AnyFirKernel } from './AnyFirKernel';


const _squareImpulseResponse = (x_: number) => 1.0;


export class SquareKernel extends AnyFirKernel {
  public constructor() {
    super(1.0, _squareImpulseResponse);
  }
}
