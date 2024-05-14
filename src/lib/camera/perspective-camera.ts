import { Camera } from "../engine/camera";

export class PerspectiveCamera extends Camera {
  fovy: number;
  aspect: number;
  near: number;
  far: number;

  constructor(fovy: number, aspect: number, near: number, far: number) {
    super(); // Setup Node
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    // Jangan lupa untuk panggil computeProjectionMatrix() setiap
    // kali mengubah nilai di atas.
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    this._projectionMatrix
      .perspectiveProjection(this.fovy, this.aspect, this.near, this.far)
      .multiply(this.worldMatrix);
    this.cameraClean();
  }

  onWorldMatrixChange(): void {
    this.computeProjectionMatrix();
  }
}
