import { v4 as uuidv4 } from "uuid";
import { Matrix4 } from "../math/m4";
import { Transform } from "./transform";

export class GLNode {
  public children: GLNode[] = [];
  protected parent: GLNode | null = null;
  public transform: Transform;
  public id;
  private _isDirty = true;
  public name: string = "GLNode";

  private _localMatrix: Matrix4;
  set localMatrix(matrix: Matrix4) {
    this._localMatrix = matrix;
  }
  get localMatrix(): Matrix4 {
    return this._localMatrix;
  }

  get isDirty() {
    return this._isDirty;
  }

  private _worldMatrix: Matrix4;
  get worldMatrix(): Matrix4 {
    return this._worldMatrix;
  }
  private set worldMatrix(matrix: Matrix4) {
    this._worldMatrix = matrix;
  }
  private _worldInvTransposeMatrix: Matrix4;
  get worldInvTransposeMatrix(): Matrix4 {
    return this._worldInvTransposeMatrix;
  }

  constructor(transform?: Transform) {
    this.transform = transform || new Transform();
    this._localMatrix = Matrix4.compose(this.transform);
    this._worldMatrix = Matrix4.identity();
    this._worldInvTransposeMatrix = Matrix4.identity();
    this.id = uuidv4();
  }

  dirty() {
    this._isDirty = true;
  }

  clean() {
    this._isDirty = false;
  }

  addChild(node: GLNode) {
    node.removeFromParent();
    this.children.push(node);
    node.parent = this;
    return this;
  }

  removeChild(node: GLNode) {
    const index = this.children.indexOf(node);
    if (index !== -1) {
      this.children[index].parent = null;
      this.children.splice(index, 1);
    }
    return this;
  }

  removeAllChildren() {
    while (this.children.length > 0) {
      const child = this.children.pop();
      if (child) {
        child.parent = null;
      }
    }
    return this;
  }

  removeFromParent() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    return this;
  }

  computeLocalMatrix() {
    this.localMatrix = Matrix4.compose(this.transform);
  }

  computeWorldMatrix(updateParent = true, updateChildren = true) {
    if (updateParent && this.parent) {
      this.parent.computeWorldMatrix(true, false);
    }
    if (this._isDirty) {
      this.computeLocalMatrix();
    }

    if (this.parent) {
      this._worldMatrix = Matrix4.multiply(
        this.parent.worldMatrix,
        this.localMatrix
      );
    } else {
      this._worldMatrix = this.localMatrix.clone();
    }
    this._worldInvTransposeMatrix.copy(this._worldMatrix).invert().transpose();
    this.onWorldMatrixChange();

    if (updateChildren) {
      this.children.forEach((child) => {
        child.computeWorldMatrix(false, true);
      });
    }
  }

  onWorldMatrixChange() {}
}
