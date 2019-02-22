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
