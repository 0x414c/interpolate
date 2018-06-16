export declare class DiscreteSignal {
    private readonly _samples;
    constructor(samples: ReadonlyArray<number>);
    readonly samplesCount: number;
    at(n: number): number | never;
    entries(): IterableIterator<[number, number]>;
    [Symbol.iterator](): IterableIterator<number>;
}
export declare class BoundaryPolicy {
    constructor();
    at(n: number, samplesCount?: number): number | never;
}
export declare class ReflectBoundary extends BoundaryPolicy {
    constructor();
    at(n: number, samplesCount: number): number | never;
    private _remap;
}
export declare class RepeatBoundary extends BoundaryPolicy {
    constructor();
    at(n: number, samplesCount: number): number | never;
}
export declare class BoundedView {
    private readonly _discreteSignal;
    private readonly _boundaryPolicy;
    constructor(discreteSignal: DiscreteSignal, boundaryPolicy: BoundaryPolicy);
    readonly samplesCount: number;
    at(n: number): number | never;
    entries(): IterableIterator<[number, number]>;
    [Symbol.iterator](): IterableIterator<number>;
}
export declare class CompensatingSummator {
    private _sum;
    private _correction;
    constructor(initialValue?: number);
    readonly total: number;
    add(x: number): this;
}
export declare class FirKernel {
    private readonly _radius;
    private readonly _impulseResponse;
    constructor(radius: number, impulseResponse: (x: number) => number);
    readonly radius: number;
    at(x: number): number;
}
export declare class WindowedFirKernel extends FirKernel {
    private readonly _window;
    constructor(radius: number, impulseResponse: (x: number) => number, window: (x: number) => number);
    at(x: number): number;
}
export declare const sinc: (x: number) => number;
export declare const sincImpulseResponse: (x: number) => number;
export declare class LanczosKernel extends WindowedFirKernel {
    constructor(radius: number);
    at(x: number): number;
}
export declare const triangleImpulseResponse: (x: number) => number;
export declare class TriangleKernel extends FirKernel {
    constructor();
}
export declare const squareImpulseResponse: (x: number) => number;
export declare class SquareKernel extends FirKernel {
    constructor();
}
export declare class Interpolator {
    private readonly _boundedView;
    private readonly _interpolatingKernel;
    constructor(boundedView: BoundedView, interpolatingKernel: FirKernel);
    at(x: number): number;
}
//# sourceMappingURL=interpolate.d.ts.map