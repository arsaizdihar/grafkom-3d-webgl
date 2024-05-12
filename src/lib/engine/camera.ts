import { Matrix4 } from "../math/m4";
import { GLNode } from "./node";

export abstract class Camera extends GLNode {
  protected _projectionMatrix = Matrix4.identity();
  private _invWorldMatrix = Matrix4.identity();

  computeWorldMatrix() {
    super.computeWorldMatrix();
    this._invWorldMatrix = Matrix4.invert(this.worldMatrix);
  }

  get viewProjectionMatrix() {
    this.computeWorldMatrix();
    return Matrix4.multiply(this.projectionMatrix, this._invWorldMatrix);
  }

  get projectionMatrix() {
    return this._projectionMatrix;
  }

  abstract computeProjectionMatrix(): void;
}
