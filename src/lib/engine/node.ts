import { Matrix4 } from "../m4";
import { Transform } from "./transform";

export class Node {
  public children: Node[] = [];
  public transform: Transform;
  protected parent: Node | null = null;

  private _localMatrix: Matrix4;
  set localMatrix(matrix: Matrix4) {
    this._localMatrix = matrix;
    this.computeWorldMatrix();
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

  constructor(transform?: Transform, parent?: Node, children?: Node[]) {
    this.transform = transform || new Transform();
    this.parent = parent || null;
    if (children) {
      this.children = children;
    }
    this._localMatrix = Matrix4.compose(this.transform);
    this._worldMatrix = Matrix4.identity();
  }

  computeLocalMatrix() {
    this.localMatrix = Matrix4.compose(this.transform);
  }

  computeWorldMatrix() {
    this._worldMatrix = this.parent
      ? Matrix4.multiply(this.parent.worldMatrix, this.localMatrix)
      : this.localMatrix;

    this.children.forEach((child) => {
      child.computeWorldMatrix();
    });
  }
}
