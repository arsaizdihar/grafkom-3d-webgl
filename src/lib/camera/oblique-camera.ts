import { Camera } from "../engine/camera";
import { Matrix4 } from "../math/m4";

export class ObliqueCamera extends Camera {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;

  theta: number;
  phi: number;

  constructor(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,

    theta: number,
    phi: number
  ) {
    super(); // Setup Node

    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;

    this.theta = theta;
    this.phi = phi;
    // Jangan lupa untuk panggil computeProjectionMatrix() setiap
    // kali mengubah nilai di atas.
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    const orthoMatrix = new Matrix4([]);
    orthoMatrix.orthographicProjection(
      this.left,
      this.right,
      this.top,
      this.bottom,
      this.near,
      this.far
    );

    const obliqueMatrix = new Matrix4([]);
    obliqueMatrix.obliqueProjection(this.theta, this.phi);

    this._projectionMatrix = orthoMatrix.multiply(obliqueMatrix);
    this.cameraClean();
  }
}
