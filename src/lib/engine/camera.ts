import { Matrix4 } from "../math/m4";
import { GLNode } from "./node";

export abstract class Camera extends GLNode {
  protected _projectionMatrix = Matrix4.identity();
  private _invWorldMatrix = Matrix4.identity();
  private _isCameraDirty = true;

  get isCameraDirty() {
    return this._isCameraDirty;
  }

  cameraDirty() {
    this._isCameraDirty = true;
  }

  cameraClean() {
    this._isCameraDirty = false;
  }

  computeWorldMatrix(updateParent = true, updateChildren = true) {
    super.computeWorldMatrix(updateParent, updateChildren);
    this._invWorldMatrix.copy(this.worldInvTransposeMatrix).transpose();
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
