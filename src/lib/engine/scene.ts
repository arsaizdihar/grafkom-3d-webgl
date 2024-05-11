import { ShaderMaterial } from "../material/shader-material";
import { BufferGeometry } from "./buffer-geometry";
import { Node } from "./node";

export class Scene {
  constructor(
    public rootNode: Node,
    public geometry: BufferGeometry,
    public material: ShaderMaterial
  ) {}
}
