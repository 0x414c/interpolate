"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiscreteSignal {
    constructor(samples) {
        this._samples = [...samples];
    }
    get samplesCount() {
        return this._samples.length;
    }
    at(n) {
        if (!Number.isInteger(n)) {
            throw new RangeError(`Non-integer index \`${n}' could not be used to access a sample.`);
        }
        if (n < 0 || n > this.samplesCount - 1) {
            throw new RangeError(`Index \`${n}' is out of bounds.`);
        }
        return this._samples[n];
    }
    entries() {
        return this._samples.entries();
    }
    [Symbol.iterator]() {
        return this._samples[Symbol.iterator]();
    }
}
exports.DiscreteSignal = DiscreteSignal;
class BoundaryPolicy {
    constructor() { }
    at(n, samplesCount) {
        if (!Number.isInteger(n)) {
            throw new RangeError(`Non-integer index \`${n}' could not be used to access a sample.`);
        }
        return n;
    }
}
exports.BoundaryPolicy = BoundaryPolicy;
class ReflectBoundary extends BoundaryPolicy {
    constructor() {
        super();
    }
    at(n, samplesCount) {
        if ((n < 0) || (n > samplesCount - 1)) {
            return this._remap(n, samplesCount - 1);
        }
        return super.at(n);
    }
    _remap(n, halfPeriod) {
        return Math.abs((n + halfPeriod) % (2 * halfPeriod) - halfPeriod);
    }
}
exports.ReflectBoundary = ReflectBoundary;
class RepeatBoundary extends BoundaryPolicy {
    constructor() {
        super();
    }
    at(n, samplesCount) {
        if (n < 0) {
            return 0;
        }
        if (n > samplesCount - 1) {
            return samplesCount - 1;
        }
        return super.at(n);
    }
}
exports.RepeatBoundary = RepeatBoundary;
class BoundedView {
    constructor(discreteSignal, boundaryPolicy) {
        this._discreteSignal = discreteSignal;
        this._boundaryPolicy = boundaryPolicy;
    }
    get samplesCount() {
        return this._discreteSignal.samplesCount;
    }
    at(n) {
        return this._discreteSignal.at(this._boundaryPolicy.at(n, this.samplesCount));
    }
    entries() {
        return this._discreteSignal.entries();
    }
    [Symbol.iterator]() {
        return this._discreteSignal[Symbol.iterator]();
    }
}
exports.BoundedView = BoundedView;
class CompensatingSummator {
    constructor(initialValue = 0.0) {
        this._sum = initialValue;
        this._correction = 0.0;
    }
    get total() {
        return this._sum + this._correction;
    }
    add(x) {
        const correctedTerm = x - this._correction;
        const newSum = this._sum + correctedTerm;
        this._correction = (newSum - this._sum) - correctedTerm;
        this._sum = newSum;
        return this;
    }
}
exports.CompensatingSummator = CompensatingSummator;
class FirKernel {
    constructor(radius, impulseResponse) {
        if (!Number.isInteger(radius)) {
            throw new RangeError('Kernel radius must be an integer.');
        }
        if (radius < 1) {
            throw new RangeError('Kernel radius must be greater than or equal to 1.');
        }
        this._radius = radius;
        this._impulseResponse = impulseResponse;
    }
    get radius() {
        return this._radius;
    }
    at(x) {
        if (Math.abs(x) > this.radius) {
            return 0.0;
        }
        return this._impulseResponse(x);
    }
}
exports.FirKernel = FirKernel;
class WindowedFirKernel extends FirKernel {
    constructor(radius, impulseResponse, window) {
        super(radius, impulseResponse);
        this._window = window;
    }
    at(x) {
        return super.at(x) * this._window(x);
    }
}
exports.WindowedFirKernel = WindowedFirKernel;
exports.sinc = (x) => Math.sin(Math.PI * x) / (Math.PI * x);
exports.sincImpulseResponse = (x) => (x === 0.0) ? 1.0 : exports.sinc(x);
class LanczosKernel extends WindowedFirKernel {
    constructor(radius) {
        super(radius, exports.sincImpulseResponse, (x) => (x === 0.0) ? 1.0 : exports.sinc(x / radius));
    }
    at(x) {
        const from = Math.floor(x) - this.radius + 1;
        const until = Math.floor(x) + this.radius + 1;
        const sum = new CompensatingSummator();
        for (let j = from; j < until; ++j) {
            sum.add(super.at(x - j));
        }
        return super.at(x) / sum.total;
    }
}
exports.LanczosKernel = LanczosKernel;
exports.triangleImpulseResponse = (x) => (x < 0.0) ? x + 1 : -x + 1;
class TriangleKernel extends FirKernel {
    constructor() {
        super(1, exports.triangleImpulseResponse);
    }
}
exports.TriangleKernel = TriangleKernel;
exports.squareImpulseResponse = (x) => 1.0;
class SquareKernel extends FirKernel {
    constructor() {
        super(1, exports.squareImpulseResponse);
    }
}
exports.SquareKernel = SquareKernel;
class Interpolator {
    constructor(boundedView, interpolatingKernel) {
        this._boundedView = boundedView;
        this._interpolatingKernel = interpolatingKernel;
    }
    at(x) {
        const from = Math.floor(x) - this._interpolatingKernel.radius + 1;
        const until = Math.floor(x) + this._interpolatingKernel.radius + 1;
        const sum = new CompensatingSummator();
        for (let i = from; i < until; ++i) {
            sum.add(this._boundedView.at(i) * this._interpolatingKernel.at(x - i));
        }
        return sum.total;
    }
}
exports.Interpolator = Interpolator;
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
//# sourceMappingURL=interpolate.js.map