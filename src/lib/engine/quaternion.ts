import { Euler } from "./euler";

export class Quaternion {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public w: number = 1
  ) {}

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  copy(q: Quaternion): this {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
  }

  clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  equals(q: Quaternion): boolean {
    return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w;
  }

  multiply(q: Quaternion): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    const a = q.x;
    const b = q.y;
    const c = q.z;
    const d = q.w;
    this.x = w * a + x * d + y * c - z * b;
    this.y = w * b + y * d + z * a - x * c;
    this.z = w * c + z * d + x * b - y * a;
    this.w = w * d - x * a - y * b - z * c;
    return this;
  }

  static fromEuler(euler: Euler) {
    // TODO: implement if want to use quaternion
  }
}
