export class DiscreteSignal {
  private readonly _samples: ReadonlyArray<number>;

  public constructor(samples: ReadonlyArray<number>) {
    this._samples = [...samples];
  }

  public get samplesCount(): number {
    return this._samples.length;
  }

  public at(n: number): number | never {
    if (!Number.isInteger(n)) {
      throw new RangeError(`Non-integer index \`${n}' could not be used to access a sample.`);
    }

    if (n < 0 || n > this.samplesCount - 1) {
      throw new RangeError(`Index \`${n}' is out of bounds.`);
    }

    return this._samples[n];
  }

  public entries(): IterableIterator<[number, number]> {
    return this._samples.entries();
  }

  public [Symbol.iterator](): IterableIterator<number> {
    return this._samples[Symbol.iterator]();
  }
}


export class BoundaryPolicy {
  public constructor() { }

  public at(n: number, samplesCount?: number): number | never {
    if (!Number.isInteger(n)) {
      throw new RangeError(`Non-integer index \`${n}' could not be used to access a sample.`);
    }

    return n;
  }
}


export class ReflectBoundary extends BoundaryPolicy {
  public constructor() {
    super();
  }

  public at(n: number, samplesCount: number): number | never {
    if ((n < 0) || (n > samplesCount - 1)) {
      return this._remap(n, samplesCount - 1);
    }

    return super.at(n);
  }

  private _remap(n: number, halfPeriod: number): number {
    return Math.abs((n + halfPeriod) % (2 * halfPeriod) - halfPeriod);
  }
}


export class RepeatBoundary extends BoundaryPolicy {
  public constructor() {
    super();
  }

  public at(n: number, samplesCount: number): number | never {
    if (n < 0) {
      return 0;
    }

    if (n > samplesCount - 1) {
      return samplesCount - 1;
    }

    return super.at(n);
  }
}


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


export class CompensatingSummator {
  private _sum: number;

  private _correction: number;

  public constructor(initialValue: number = 0.0) {
    this._sum = initialValue;
    this._correction = 0.0;
  }

  public get total(): number {
    return this._sum + this._correction;
  }

  public add(x: number): this {
    const correctedTerm = x - this._correction;
    const newSum = this._sum + correctedTerm;
    this._correction = (newSum - this._sum) - correctedTerm;
    this._sum = newSum;

    return this;
  }
}


export class FirKernel {
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


export class WindowedFirKernel extends FirKernel {
  private readonly _window: (x: number) => number;

  public constructor(radius: number, impulseResponse: (x: number) => number, window: (x: number) => number) {
    super(radius, impulseResponse);

    this._window = window;
  }

  public at(x: number): number {
    return super.at(x) * this._window(x);
  }
}


export const sinc = (x: number) => Math.sin(Math.PI * x) / (Math.PI * x);

export const sincImpulseResponse = (x: number) => (x === 0.0) ? 1.0 : sinc(x);


export class LanczosKernel extends WindowedFirKernel {
  public constructor(radius: number) {
    super(radius, sincImpulseResponse, (x: number) => (x === 0.0) ? 1.0 : sinc(x / radius));
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


export const triangleImpulseResponse = (x: number) => (x < 0.0) ? x + 1 : -x + 1;


export class TriangleKernel extends FirKernel {
  public constructor() {
    super(1, triangleImpulseResponse);
  }
}


export const squareImpulseResponse = (x: number) => 1.0;


export class SquareKernel extends FirKernel {
  public constructor() {
    super(1, squareImpulseResponse);
  }
}


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


/* export class InterpolatedView {
  private readonly _resampleRate: number;

  public constructor(resampleRate: number) {
    if (resampleRate < 1.0) {
      throw new RangeError('Downsampling is not supported.');
    }

    this._resampleRate = resampleRate;
  }

  public get samplesCount(): number {
    return this._samples.length;
  }

  public at(n: number): number | never {
    if (!Number.isInteger(n)) {
      throw new RangeError(`Non-integer index \`${n}' could not be used to access a sample.`);
    }

    if (n < 0 || n > this.samplesCount - 1) {
      throw new RangeError(`Index \`${n}' is out of bounds.`);
    }

    return this._samples[n];
  }

  public entries(): IterableIterator<[number, number]> {
    return this._samples.entries();
  }

  public [Symbol.iterator](): IterableIterator<number> {
    return this._samples[Symbol.iterator]();
  }
} */
