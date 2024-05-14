import { Camera } from "../engine/camera";

export class OrthographicCamera extends Camera {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;

  constructor(
    left: number,
    right: number,
    top: number,
    bottom: number,
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
    // kali mengubah nilai di atas.
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    this._projectionMatrix.orthographicProjection(
      this.left,
      this.right,
      this.top,
      this.bottom,
      this.near,
      this.far
    );
    this.cameraClean();
  }
}
