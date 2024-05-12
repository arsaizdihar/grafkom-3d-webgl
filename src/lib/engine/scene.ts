import { ShaderMaterial } from "../material/shader-material";
import { BufferGeometry } from "./buffer-geometry";
import { GLNode } from "./node";

export class Scene {
  constructor(
    public rootNode: GLNode,
    public geometry?: BufferGeometry,
    public material?: ShaderMaterial
  ) {}
}
