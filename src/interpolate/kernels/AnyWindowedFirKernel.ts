import { AnyFirKernel } from './AnyFirKernel';


export class AnyWindowedFirKernel extends AnyFirKernel {
  private readonly _window: (x: number) => number;


  public constructor(radius: number, impulseResponse: (x: number) => number, window: (x: number) => number) {
    super(radius, impulseResponse);

    this._window = window;
  }


  public at(x: number): number {
    return super.at(x) * this._window(x);
  }
}
