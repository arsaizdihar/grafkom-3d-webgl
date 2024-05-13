import { Camera } from "../engine/camera";
import { Matrix4 } from "../math/m4";

export class ObliqueCamera extends Camera {
  top: number;
  bottom: number;
  left: number;
  right: number;
  near: number;
  far: number;

  theta: number;
  phi: number;

  constructor(
    left: number,
    right: number,
    bottom: number,
    top: number,
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
    Matrix4.multiply(
      this.projectionMatrix.obliqueProjection(this.theta, this.phi),
      this._projectionMatrix.orthographicProjection(
        this.left,
        this.right,
        this.bottom,
        this.top,
        this.near,
        this.far
      )
    );
    // this._projectionMatrix.obliqueProjection(
    //   this.theta,
    //   this.phi
    // );
  }
}
