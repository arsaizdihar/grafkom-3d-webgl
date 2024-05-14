import { v4 as uuidv4 } from "uuid";
import { Matrix4 } from "../math/m4";
import { Transform } from "./transform";

export class GLNode {
  public children: GLNode[] = [];
  protected parent: GLNode | null = null;
  public transform: Transform;
  public id;
  public isDirty = true;
  public name: string = "GLNode";

  private _localMatrix: Matrix4;
  set localMatrix(matrix: Matrix4) {
    this._localMatrix = matrix;
  }
  get localMatrix(): Matrix4 {
    return this._localMatrix;
  }

  private _worldMatrix: Matrix4;
  get worldMatrix(): Matrix4 {
    return this._worldMatrix;
  }
  private set worldMatrix(matrix: Matrix4) {
    this._worldMatrix = matrix;
  }

  constructor(transform?: Transform) {
    this.transform = transform || new Transform();
    this._localMatrix = Matrix4.compose(this.transform);
    this._worldMatrix = Matrix4.identity();
    this.id = uuidv4();
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

    this.computeLocalMatrix();

    if (this.parent) {
      this._worldMatrix = Matrix4.multiply(
        this.parent.worldMatrix,
        this.localMatrix
      );
    } else {
      this._worldMatrix = this.localMatrix.clone();
    }

    if (updateChildren) {
      this.children.forEach((child) => {
        child.computeWorldMatrix(false, true);
      });
    }
  }
}
