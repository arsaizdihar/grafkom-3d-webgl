import { ShaderMaterial } from "../material/shader-material";
import { BufferGeometry } from "./buffer-geometry";
import { GLNode } from "./node";

export class Mesh extends GLNode {
  constructor(
    public geometry: BufferGeometry,
    public material: ShaderMaterial
  ) {
    super();
  }
}
