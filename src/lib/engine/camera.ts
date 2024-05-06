import { Matrix4 } from "../m4";
import { Node } from "./node";

export abstract class Camera extends Node {
  protected _projectionMatrix = Matrix4.identity();
  private _invWorldMatrix = Matrix4.identity();

  computeWorldMatrix() {
    super.computeWorldMatrix();
    this._invWorldMatrix = this.worldMatrix.inv();
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
