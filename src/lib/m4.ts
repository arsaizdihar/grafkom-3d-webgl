// source: https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html

import { Transform } from "./engine/transform";

// column major matrix
export class Matrix4 {
  public el: number[];

  get size() {
    return 4;
  }

  constructor(elements: number[]) {
    this.el = elements;
  }

  static identity() {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  static translation(tx: number, ty: number, tz: number) {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
  }

  static xRotation(angleInRadians: number) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return new Matrix4([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
  }

  static yRotation(angleInRadians: number) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return new Matrix4([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  }

  static zRotation(angleInRadians: number) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return new Matrix4([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  static scaling(sx: number, sy: number, sz: number) {
    return new Matrix4([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
  }

  static multiply(aM: Matrix4, bM: Matrix4) {
    const a = aM.el;
    const b = bM.el;

    const b00 = b[0 * 4 + 0];
    const b01 = b[0 * 4 + 1];
    const b02 = b[0 * 4 + 2];
    const b03 = b[0 * 4 + 3];
    const b10 = b[1 * 4 + 0];
    const b11 = b[1 * 4 + 1];
    const b12 = b[1 * 4 + 2];
    const b13 = b[1 * 4 + 3];
    const b20 = b[2 * 4 + 0];
    const b21 = b[2 * 4 + 1];
    const b22 = b[2 * 4 + 2];
    const b23 = b[2 * 4 + 3];
    const b30 = b[3 * 4 + 0];
    const b31 = b[3 * 4 + 1];
    const b32 = b[3 * 4 + 2];
    const b33 = b[3 * 4 + 3];
    const a00 = a[0 * 4 + 0];
    const a01 = a[0 * 4 + 1];
    const a02 = a[0 * 4 + 2];
    const a03 = a[0 * 4 + 3];
    const a10 = a[1 * 4 + 0];
    const a11 = a[1 * 4 + 1];
    const a12 = a[1 * 4 + 2];
    const a13 = a[1 * 4 + 3];
    const a20 = a[2 * 4 + 0];
    const a21 = a[2 * 4 + 1];
    const a22 = a[2 * 4 + 2];
    const a23 = a[2 * 4 + 3];
    const a30 = a[3 * 4 + 0];
    const a31 = a[3 * 4 + 1];
    const a32 = a[3 * 4 + 2];
    const a33 = a[3 * 4 + 3];

    return new Matrix4([
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ]);
  }

  static projection(width: number, height: number, depth: number) {
    return new Matrix4([
      2 / width,
      0,
      0,
      0,
      0,
      -2 / height,
      0,
      0,
      0,
      0,
      2 / depth,
      0,
      -1,
      1,
      0,
      1,
    ]);
  }

  /**
   *
   * @param transform
   * @returns the computed matrix from the transform with formula M = T * Rz * Ry * Rx * S. Right now using euler angles.
   */
  static compose(transform: Transform) {
    // TODO: use quaternion instead of euler angles
    return Matrix4.multiply(
      Matrix4.translation(
        transform.translation.x,
        transform.translation.y,
        transform.translation.z
      ),
      Matrix4.multiply(
        Matrix4.zRotation(transform.rotation.z),
        Matrix4.multiply(
          Matrix4.yRotation(transform.rotation.y),
          Matrix4.multiply(
            Matrix4.xRotation(transform.rotation.x),
            Matrix4.scaling(
              transform.scaling.x,
              transform.scaling.y,
              transform.scaling.z
            )
          )
        )
      )
    );
  }

  translate(tx: number, ty: number, tz: number) {
    return Matrix4.multiply(this, Matrix4.translation(tx, ty, tz));
  }

  xRotate(angleInRadians: number) {
    return Matrix4.multiply(this, Matrix4.xRotation(angleInRadians));
  }

  yRotate(angleInRadians: number) {
    return Matrix4.multiply(this, Matrix4.yRotation(angleInRadians));
  }

  zRotate(angleInRadians: number) {
    return Matrix4.multiply(this, Matrix4.zRotation(angleInRadians));
  }

  scale(sx: number, sy: number, sz: number) {
    return Matrix4.multiply(this, Matrix4.scaling(sx, sy, sz));
  }
}
