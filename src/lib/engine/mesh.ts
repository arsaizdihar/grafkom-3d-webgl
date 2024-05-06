import { ShaderMaterial } from "../material/shader-material";
import { BufferGeometry } from "./buffer-geometry";
import { Node } from "./node";

export class Mesh extends Node {
  constructor(
    public geometry: BufferGeometry,
    public material: ShaderMaterial
  ) {
    super();
  }
}
