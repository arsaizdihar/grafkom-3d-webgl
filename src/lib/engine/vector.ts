import { BufferAttribute } from "./buffer-attribute";

export class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  cross(v: Vector3): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;
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
}
