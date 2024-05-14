import { BufferAttribute } from "./buffer-attribute";

export class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  static fromArray(array: number[]): Vector3 {
    return new Vector3(array[0], array[1], array[2]);
  }

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  cross(v: Vector3): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;
    return this;
  }

  crossVectors(a: Vector3, b: Vector3): this {
    const ax = a.x,
      ay = a.y,
      az = a.z;
    const bx = b.x,
      by = b.y,
      bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  }

  add(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  fromBufferAttribute(attribute: BufferAttribute, index: number): this {
    const [x, y, z] = attribute.get(index);
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  subVectors(a: Vector3, b: Vector3): this {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): this {
    const length = this.length();
    if (length === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else {
      this.x /= length;
      this.y /= length;
      this.z /= length;
    }
    return this;
  }

  copy(v: Vector3) {
    this.set(v.x, v.y, v.z);
    return this;
  }
}
