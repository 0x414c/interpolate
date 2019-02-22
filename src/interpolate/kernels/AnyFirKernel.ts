export class AnyFirKernel {
  private readonly _radius: number;

  private readonly _impulseResponse: (x: number) => number;


  public constructor(radius: number, impulseResponse: (x: number) => number) {
    if (!Number.isInteger(radius)) {
      throw new RangeError('Kernel radius must be an integer.');
    }

    if (radius < 1) {
      throw new RangeError('Kernel radius must be greater than or equal to 1.');
    }

    this._radius = radius;
    this._impulseResponse = impulseResponse;
  }


  public get radius(): number {
    return this._radius;
  }


  public at(x: number): number {
    if (Math.abs(x) > this.radius) {
      return 0.0;
    }

    return this._impulseResponse(x);
  }
}
