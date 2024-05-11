import { Camera } from "../engine/camera";

export class OrthographicCamera extends Camera {
  top: number;
  bottom: number;
  left: number;
  right: number;
  near: number;
  far: number;

  constructor(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    super(); // Setup Node
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    // Jangan lupa untuk panggil computeProjectionMatrix() setiap
    // kali mengubah nilai left, right, top, bottom, near, atau far.
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    this._projectionMatrix.orthographicProjection(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far
    );
  }
}
