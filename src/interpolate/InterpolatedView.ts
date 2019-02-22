/* export class InterpolatedView {
  private readonly _resampleRate: number;


  public constructor(resampleRate: number) {
    if (resampleRate < 1.0) {
      throw new RangeError('Downsampling isn't supported');
    }

    this._resampleRate = resampleRate;
  }


  public get samplesCount(): number {
    return this._samples.length;
  }


  public at(n: number): number | never {
    if (!Number.isInteger(n)) {
      throw new RangeError(`Non-integer index \`${n}' couldn't be used to access a sample`);
    }

    if ((n < 0) || (n > (this.samplesCount - 1))) {
      throw new RangeError(`Index \`${n}' is out of bounds`);
    }

    return this._samples[n];
  }


  public entries(): IterableIterator<[ number, number ]> {
    return this._samples.entries();
  }


  public [Symbol.iterator](): IterableIterator<number> {
    return this._samples[Symbol.iterator]();
  }
} */
