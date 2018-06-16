"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const interpolate_1 = require("./interpolate");
const samples = [
    1.02546, 2.44055, 2.37756, 3.92457, 2.6765, 1.9912,
    1.60972, -0.0249061, -1.05301, -0.809925, 1.11077, -0.183466,
    0.474348, -0.660798, -0.436681, -0.752358, -3.05692, -3.83525,
    -3.64123, -3.19907, -3.3567, -2.39417, -0.746229, 0.877317,
    0.36155, 0.573043, 0.527829, 0.354309, 0.826452, 0.782487,
];
const signal = new interpolate_1.DiscreteSignal(samples);
const reflect = new interpolate_1.ReflectBoundary();
const repeat = new interpolate_1.RepeatBoundary();
const padded = new interpolate_1.BoundedView(signal, reflect);
// const padded = new PaddedView(signal, repeat);
const lanczos3 = new interpolate_1.LanczosKernel(3);
const triangle = new interpolate_1.TriangleKernel();
const square = new interpolate_1.SquareKernel();
const interpolated = new interpolate_1.Interpolator(padded, lanczos3);
// const interpolated = new Interpolator(padded, triangle);
// const interpolated = new Interpolator(padded, square);
// TODO: InterpolatedView
const step = 0.05;
const output = [];
for (let i = 0; i < signal.samplesCount; ++i) {
    console.log(`i: ${i}, s[i]: ${signal.at(i)}, s'[i]: ${interpolated.at(i)}`);
    output.push([i, interpolated.at(i)]);
    for (let j = new interpolate_1.CompensatingSummator(i + step); j.total < i + 1; j.add(step)) {
        console.log(`j: ${j.total}, s'[j]: ${interpolated.at(j.total)}`);
        output.push([j.total, interpolated.at(j.total)]);
    }
}
fs_1.writeFileSync('./output.dat', output.map(([i, s]) => `${i} ${s}`).join('\n'));
//# sourceMappingURL=test.js.map