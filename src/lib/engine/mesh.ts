import { BufferGeometry } from "./buffer-geometry";
import { Node } from "./node";

export class Mesh extends Node {
  constructor(public geometry: BufferGeometry) {
    super();
  }
}
