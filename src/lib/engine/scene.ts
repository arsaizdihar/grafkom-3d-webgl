import { ShaderMaterial } from "../material/shader-material";
import { BufferGeometry } from "./buffer-geometry";
import { Color } from "./color";
import { GLImage } from "./image";
import { GLNode } from "./node";
import { Texture } from "./texture";
import { Vector3 } from "./vector";

export class Scene extends GLNode {
  constructor(
    public background: Color,
    public lightPos = new Vector3(),
    public materials: ShaderMaterial[] = [],
    public geometries: BufferGeometry[] = [],
    public textures: Texture[] = [],
    public images: GLImage[] = []
  ) {
    super();
  }
}
