import { AnyFirKernel } from './AnyFirKernel';


const _triangleImpulseResponse = (x: number) => (x < 0.0) ? (x + 1.0) : (-x + 1.0);


export class TriangleKernel extends AnyFirKernel {
  public constructor() {
    super(1.0, _triangleImpulseResponse);
  }
}
