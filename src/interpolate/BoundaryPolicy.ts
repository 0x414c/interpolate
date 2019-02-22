export class BoundaryPolicy {
  public constructor() { }


  public at(n: number, samplesCount?: number): number | never {
    if (!Number.isInteger(n)) {
      throw new RangeError(`Non-integer index \`${n}' could not be used to access a sample.`);
    }

    return n;
  }
}
