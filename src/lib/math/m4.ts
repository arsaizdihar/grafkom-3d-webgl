// source: https://github.com/mrdoob/three.js/blob/e1e2a22e6a2904fcf627cad39e3389dfa1101c07/src/math/Matrix4.js#L4

import { Transform } from "../engine/transform";
import { Vector3 } from "../engine/vector";
import { Euler } from "./euler";
import { Quaternion } from "./quaternion";

// internal cache to minimize object creation
const _transform = new Transform(
  new Vector3(0, 0, 0),
  new Euler(),
  new Vector3(1, 1, 1)
);
const _zeroPosition = _transform.position;
const _oneScale = _transform.scale;

const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();

/**
 * 4x4 column-major matrix
 */
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

  static zero() {
    return new Matrix4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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

  static rotation(euler: Euler) {
    return Matrix4.multiply(
      Matrix4.zRotation(euler.z),
      Matrix4.multiply(Matrix4.yRotation(euler.y), Matrix4.xRotation(euler.x))
    );
  }

  static scaling(sx: number, sy: number, sz: number) {
    return new Matrix4([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
  }

  static orthographic(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number
  ) {
    return new Matrix4([
      2 / (right - left),
      0,
      0,
      (left + right) / (left - right),
      0,
      2 / (top - bottom),
      0,
      (top + bottom) / (bottom - top),
      0,
      0,
      2 / (near - far),
      (near + far) / (near - far),
      0,
      0,
      0,
      1,
    ]);
  }

  static multiplyVector(m: Matrix4, v: Vector3) {
    return new Vector3(
      m.el[0] * v.x + m.el[4] * v.y + m.el[8] * v.z + m.el[12],
      m.el[1] * v.x + m.el[5] * v.y + m.el[9] * v.z + m.el[13],
      m.el[2] * v.x + m.el[6] * v.y + m.el[10] * v.z + m.el[14]
    );
  }

  /**
   *
   * @param aM left matrix
   * @param bM right matrix
   * @returns new matrix that is the product of the two input matrices
   */
  static multiply(aM: Matrix4, bM: Matrix4) {
    return aM.clone().multiply(bM);
  }

  /**
   * Mutates the matrix to its product with another matrix and returns it.
   *
   * @param bM right matrix
   * @returns this
   */
  multiply(bM: Matrix4) {
    const a = this.el;
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

    a[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    a[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    a[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    a[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    a[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    a[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    a[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    a[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    a[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    a[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    a[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    a[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    a[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    a[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    a[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    a[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return this;
  }

  static orthographicProjection(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number
  ) {
    return Matrix4.zero().orthographicProjection(
      left,
      right,
      top,
      bottom,
      near,
      far
    );
  }

  /**
   * Mutates the matrix the orthographic projection matrix based on the input parameters and returns it.
   * The initial matrix dont have any effect on the result.
   *
   * @param left
   * @param right
   * @param top
   * @param bottom
   * @param near
   * @param far
   * @returns
   */
  orthographicProjection(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number
  ) {
    const te = this.el;
    const w = 1.0 / (right - left);
    const h = 1.0 / (top - bottom);
    const p = 1.0 / (far - near);

    const x = (right + left) * w;
    const y = (top + bottom) * h;

    let z, zInv;

    z = (far + near) * p;
    zInv = -2 * p;

    te[0] = 2 * w;
    te[4] = 0;
    te[8] = 0;
    te[12] = -x;
    te[1] = 0;
    te[5] = 2 * h;
    te[9] = 0;
    te[13] = -y;
    te[2] = 0;
    te[6] = 0;
    te[10] = zInv;
    te[14] = -z;
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[15] = 1;

    return this;
  }

  /**
   * Mutates the matrix the oblique projection matrix based on the input parameters and returns it.
   * The initial matrix dont have any effect on the result.
   *
   * @param theta
   * @param phi
   * @returns
   */
  obliqueProjection(theta: number, phi: number) {
    const te = this.el;

    const cotTheta = 1 / Math.tan(theta);
    const cotPhi = 1 / Math.tan(phi);

    te[0] = 1;
    te[4] = 0;
    te[8] = cotTheta;
    te[12] = 0;
    te[1] = 0;
    te[5] = 1;
    te[9] = cotPhi;
    te[13] = 0;
    te[2] = 0;
    te[6] = 0;
    te[10] = 1;
    te[14] = 0;
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[15] = 1;

    return this;
  }

  /**
   * Mutates the matrix the perspective projection matrix based on the input parameters and returns it.
   * The initial matrix dont have any effect on the result.
   *
   * @param fovy // in radians
   * @param aspect // aspect ratio
   * @param near
   * @param far
   * @returns
   */
  perspectiveProjection(
    fovy: number,
    aspect: number,
    near: number,
    far: number
  ) {
    const te = this.el;

    const f = Math.tan(Math.PI / 2 - fovy / 2);
    const rangeInv = 1 / (near - far);

    te[0] = f / aspect;
    te[4] = 0;
    te[8] = 0;
    te[12] = 0;
    te[1] = 0;
    te[5] = f;
    te[9] = 0;
    te[13] = 0;
    te[2] = 0;
    te[6] = 0;
    te[10] = (near + far) * rangeInv;
    te[14] = near * far * rangeInv * 2;
    te[3] = 0;
    te[7] = 0;
    te[11] = -1;
    te[15] = 0;

    return this;
  }

  /**
   *
   * @param transform
   * @param quaternion optional quaternion to use for rotation
   * @returns the computed matrix from the transform with formula M = T * Rz * Ry * Rx * S. Right now using euler angles.
   */
  static compose(transform: Transform, quaternion?: Quaternion) {
    const m = Matrix4.identity();
    return m.compose(transform, quaternion);
  }

  /**
   * Mutates the matrix to its composed matrix with a transform and returns it.
   *
   * @param transform
   * @param quaternion optional quaternion to use for rotation
   * @returns this
   */
  compose(transform: Transform, quaternion?: Quaternion) {
    const te = this.el;
    const position = transform.position;
    if (!quaternion) {
      quaternion = transform.rotationQuaternion;
    }
    const scale = transform.scale;
    const x = quaternion.x,
      y = quaternion.y,
      z = quaternion.z,
      w = quaternion.w;
    const x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    const xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    const yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    const wx = w * x2,
      wy = w * y2,
      wz = w * z2;

    const sx = scale.x,
      sy = scale.y,
      sz = scale.z;

    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;

    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;

    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;

    te[12] = position.x;
    te[13] = position.y;
    te[14] = position.z;
    te[15] = 1;

    return this;
  }

  static translate(m: Matrix4, tx: number, ty: number, tz: number) {
    return Matrix4.multiply(m, Matrix4.translation(tx, ty, tz));
  }

  static xRotate(m: Matrix4, angleInRadians: number) {
    return Matrix4.multiply(m, Matrix4.xRotation(angleInRadians));
  }

  static yRotate(m: Matrix4, angleInRadians: number) {
    return Matrix4.multiply(m, Matrix4.yRotation(angleInRadians));
  }

  static zRotate(m: Matrix4, angleInRadians: number) {
    return Matrix4.multiply(m, Matrix4.zRotation(angleInRadians));
  }

  static scale(m: Matrix4, sx: number, sy: number, sz: number) {
    return Matrix4.multiply(m, Matrix4.scaling(sx, sy, sz));
  }

  clone() {
    return new Matrix4([...this.el]);
  }

  copy(m: Matrix4) {
    const el1 = this.el;
    const el2 = m.el;

    el1[0] = el2[0];
    el1[1] = el2[1];
    el1[2] = el2[2];
    el1[3] = el2[3];
    el1[4] = el2[4];
    el1[5] = el2[5];
    el1[6] = el2[6];
    el1[7] = el2[7];
    el1[8] = el2[8];
    el1[9] = el2[9];
    el1[10] = el2[10];
    el1[11] = el2[11];
    el1[12] = el2[12];
    el1[13] = el2[13];
    el1[14] = el2[14];
    el1[15] = el2[15];

    return this;
  }

  /**
   *
   * @param m the matrix that will be inverted
   * @returns new matrix that is the inverse of the input matrix
   */
  static invert(m: Matrix4) {
    const copy = m.clone();
    return copy.invert();
  }

  /**
   * Mutates the matrix to its inverse and returns it.
   * @returns this
   */
  invert(): this {
    const te = this.el,
      n11 = te[0],
      n21 = te[1],
      n31 = te[2],
      n41 = te[3],
      n12 = te[4],
      n22 = te[5],
      n32 = te[6],
      n42 = te[7],
      n13 = te[8],
      n23 = te[9],
      n33 = te[10],
      n43 = te[11],
      n14 = te[12],
      n24 = te[13],
      n34 = te[14],
      n44 = te[15],
      t11 =
        n23 * n34 * n42 -
        n24 * n33 * n42 +
        n24 * n32 * n43 -
        n22 * n34 * n43 -
        n23 * n32 * n44 +
        n22 * n33 * n44,
      t12 =
        n14 * n33 * n42 -
        n13 * n34 * n42 -
        n14 * n32 * n43 +
        n12 * n34 * n43 +
        n13 * n32 * n44 -
        n12 * n33 * n44,
      t13 =
        n13 * n24 * n42 -
        n14 * n23 * n42 +
        n14 * n22 * n43 -
        n12 * n24 * n43 -
        n13 * n22 * n44 +
        n12 * n23 * n44,
      t14 =
        n14 * n23 * n32 -
        n13 * n24 * n32 -
        n14 * n22 * n33 +
        n12 * n24 * n33 +
        n13 * n22 * n34 -
        n12 * n23 * n34;

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

    if (det === 0) {
      this.el = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      return this;
    }

    const detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] =
      (n24 * n33 * n41 -
        n23 * n34 * n41 -
        n24 * n31 * n43 +
        n21 * n34 * n43 +
        n23 * n31 * n44 -
        n21 * n33 * n44) *
      detInv;
    te[2] =
      (n22 * n34 * n41 -
        n24 * n32 * n41 +
        n24 * n31 * n42 -
        n21 * n34 * n42 -
        n22 * n31 * n44 +
        n21 * n32 * n44) *
      detInv;
    te[3] =
      (n23 * n32 * n41 -
        n22 * n33 * n41 -
        n23 * n31 * n42 +
        n21 * n33 * n42 +
        n22 * n31 * n43 -
        n21 * n32 * n43) *
      detInv;

    te[4] = t12 * detInv;
    te[5] =
      (n13 * n34 * n41 -
        n14 * n33 * n41 +
        n14 * n31 * n43 -
        n11 * n34 * n43 -
        n13 * n31 * n44 +
        n11 * n33 * n44) *
      detInv;
    te[6] =
      (n14 * n32 * n41 -
        n12 * n34 * n41 -
        n14 * n31 * n42 +
        n11 * n34 * n42 +
        n12 * n31 * n44 -
        n11 * n32 * n44) *
      detInv;
    te[7] =
      (n12 * n33 * n41 -
        n13 * n32 * n41 +
        n13 * n31 * n42 -
        n11 * n33 * n42 -
        n12 * n31 * n43 +
        n11 * n32 * n43) *
      detInv;

    te[8] = t13 * detInv;
    te[9] =
      (n14 * n23 * n41 -
        n13 * n24 * n41 -
        n14 * n21 * n43 +
        n11 * n24 * n43 +
        n13 * n21 * n44 -
        n11 * n23 * n44) *
      detInv;
    te[10] =
      (n12 * n24 * n41 -
        n14 * n22 * n41 +
        n14 * n21 * n42 -
        n11 * n24 * n42 -
        n12 * n21 * n44 +
        n11 * n22 * n44) *
      detInv;
    te[11] =
      (n13 * n22 * n41 -
        n12 * n23 * n41 -
        n13 * n21 * n42 +
        n11 * n23 * n42 +
        n12 * n21 * n43 -
        n11 * n22 * n43) *
      detInv;

    te[12] = t14 * detInv;
    te[13] =
      (n13 * n24 * n31 -
        n14 * n23 * n31 +
        n14 * n21 * n33 -
        n11 * n24 * n33 -
        n13 * n21 * n34 +
        n11 * n23 * n34) *
      detInv;
    te[14] =
      (n14 * n22 * n31 -
        n12 * n24 * n31 -
        n14 * n21 * n32 +
        n11 * n24 * n32 +
        n12 * n21 * n34 -
        n11 * n22 * n34) *
      detInv;
    te[15] =
      (n12 * n23 * n31 -
        n13 * n22 * n31 +
        n13 * n21 * n32 -
        n11 * n23 * n32 -
        n12 * n21 * n33 +
        n11 * n22 * n33) *
      detInv;

    return this;
  }

  /**
   *
   * @param m the matrix that will be transposed
   * @returns new matrix that is the transpose of the input matrix
   */
  static transpose(m: Matrix4) {
    const copy = m.clone();
    return copy.transpose();
  }

  /**
   * Mutates the matrix to its transpose and returns it.
   * @returns this
   */
  transpose() {
    const m = this.el;

    this.el = [
      m[0],
      m[4],
      m[8],
      m[12],
      m[1],
      m[5],
      m[9],
      m[13],
      m[2],
      m[6],
      m[10],
      m[14],
      m[3],
      m[7],
      m[11],
      m[15],
    ];
    return this;
  }

  makeRotationFromQuaternion(q: Quaternion) {
    _transform.position = _zeroPosition;
    _transform.scale = _oneScale;

    return this.compose(_transform, q);
  }

  lookAt(eye: Vector3, target: Vector3, up: Vector3) {
    const te = this.el;

    const z = _x.subVectors(eye, target).normalize();
    const x = _y.crossVectors(up, z).normalize();
    const y = _z.crossVectors(z, x).normalize();

    te[0] = x.x;
    te[4] = y.x;
    te[8] = z.x;
    te[12] = eye.x;
    te[1] = x.y;
    te[5] = y.y;
    te[9] = z.y;
    te[13] = eye.y;
    te[2] = x.z;
    te[6] = y.z;
    te[10] = z.z;
    te[14] = eye.z;
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[15] = 1;

    return this;
  }

  toString() {
    return `Matrix4
    ${this.el[0]} ${this.el[4]} ${this.el[8]} ${this.el[12]}
    ${this.el[1]} ${this.el[5]} ${this.el[9]} ${this.el[13]}
    ${this.el[2]} ${this.el[6]} ${this.el[10]} ${this.el[14]}
    ${this.el[3]} ${this.el[7]} ${this.el[11]} ${this.el[15]}`;
  }
}
