// source: https://github.com/mrdoob/three.js/blob/e1e2a22e6a2904fcf627cad39e3389dfa1101c07/src/math/Quaternion.js

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
    let x = euler.x,
      y = euler.y,
      z = euler.z;

    const cos = Math.cos;
    const sin = Math.sin;

    const c1 = cos(x / 2);
    const c2 = cos(y / 2);
    const c3 = cos(z / 2);

    const s1 = sin(x / 2);
    const s2 = sin(y / 2);
    const s3 = sin(z / 2);

    x = s1 * c2 * c3 + c1 * s2 * s3;
    y = c1 * s2 * c3 - s1 * c2 * s3;
    z = c1 * c2 * s3 + s1 * s2 * c3;
    const w = c1 * c2 * c3 - s1 * s2 * s3;
    return new Quaternion(x, y, z, w);
  }
}
