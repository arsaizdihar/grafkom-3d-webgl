import { Matrix4 } from "../m4";
import { Quaternion } from "./quaternion";

// internal cache to minimize object creation
const _matrix = Matrix4.zero();

export class Euler {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  static fromQuaternion(q: Quaternion) {
    return new Euler().setFromQuaternion(q);
  }

  setFromQuaternion(q: Quaternion) {
    _matrix.makeRotationFromQuaternion(q);

    return this.setFromRotationMatrix(_matrix);
  }

  setFromRotationMatrix(m: Matrix4) {
    const te = m.el;
    const m11 = te[0],
      m12 = te[4],
      m13 = te[8];
    const m22 = te[5],
      m23 = te[9];
    const m32 = te[6],
      m33 = te[10];

    this.y = Math.asin(Math.max(-1, Math.min(1, m13)));

    if (Math.abs(m13) < 0.9999999) {
      this.x = Math.atan2(-m23, m33);
      this.z = Math.atan2(-m12, m11);
    } else {
      this.x = Math.atan2(m32, m22);
      this.z = 0;
    }
    return this;
  }
}
