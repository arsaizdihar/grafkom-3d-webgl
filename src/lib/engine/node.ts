import { Camera } from "./camera";
import { Mesh } from "./mesh";
import { Transform } from "./transform";

export class Node {
  public children: Node[] = [];
  public camera?: Camera = undefined;
  public mesh?: Mesh = undefined;

  constructor(public transform: Transform, children?: Node[]) {
    if (children) {
      this.children = children;
    }
  }
}
