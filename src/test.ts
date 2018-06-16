import { writeFileSync } from 'fs';

import {
  BoundedView,
  CompensatingSummator,
  DiscreteSignal,
  Interpolator,
  LanczosKernel,
  ReflectBoundary,
  RepeatBoundary,
  SquareKernel,
  TriangleKernel,
} from './interpolate';


const samples = [
  1.02546, 2.44055, 2.37756, 3.92457, 2.6765, 1.9912,
  1.60972, -0.0249061, -1.05301, -0.809925, 1.11077, -0.183466,
  0.474348, -0.660798, -0.436681, -0.752358, -3.05692, -3.83525,
  -3.64123, -3.19907, -3.3567, -2.39417, -0.746229, 0.877317,
  0.36155, 0.573043, 0.527829, 0.354309, 0.826452, 0.782487,
];
const signal = new DiscreteSignal(samples);

const reflect = new ReflectBoundary();
const repeat = new RepeatBoundary();

const padded = new BoundedView(signal, reflect);
// const padded = new PaddedView(signal, repeat);

const lanczos3 = new LanczosKernel(3);
const triangle = new TriangleKernel();
const square = new SquareKernel();

const interpolated = new Interpolator(padded, lanczos3);
// const interpolated = new Interpolator(padded, triangle);
// const interpolated = new Interpolator(padded, square);
// TODO: InterpolatedView

const step = 0.05;
const output = [];
for (let i = 0; i < signal.samplesCount; ++i) {
  console.log(`i: ${i}, s[i]: ${signal.at(i)}, s'[i]: ${interpolated.at(i)}`);

  output.push([i, interpolated.at(i)]);

  for (let j = new CompensatingSummator(i + step); j.total < i + 1; j.add(step)) {
    console.log(`j: ${j.total}, s'[j]: ${interpolated.at(j.total)}`);

    output.push([j.total, interpolated.at(j.total)]);
  }
}

writeFileSync('./output.dat', output.map(([i, s]) => `${i} ${s}`).join('\n'));
