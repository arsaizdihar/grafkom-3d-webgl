import { Camera } from "./camera";
import { Mesh } from "./mesh";
import { Transform } from "./transform";

export class Node {
  public children: Node[] = [];
  public camera?: Camera = undefined;
  public mesh?: Mesh = undefined;
  public transform: Transform;

  constructor(transform?: Transform, children?: Node[]) {
    this.transform = transform || new Transform();
    if (children) {
      this.children = children;
    }
  }
}
