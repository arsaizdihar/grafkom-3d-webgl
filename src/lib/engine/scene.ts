import { ShaderMaterial } from "../material/shader-material";
import { BufferGeometry } from "./buffer-geometry";
import { Color } from "./color";
import { GLImage } from "./image";
import { GLNode } from "./node";
import { Texture } from "./texture";
import { Vector3 } from "./vector";

export enum LightType {
  Directional = 0,
  Point = 1,
}

export class Scene extends GLNode {
  constructor(
    public background: Color,
    public lightPos = new Vector3(100, 100, 100),
    public lightDir = new Vector3(0, -1, -1),
    public lightRadius = 100,
    public lightType = LightType.Directional,
    public materials: ShaderMaterial[] = [],
    public geometries: BufferGeometry[] = [],
    public textures: Texture[] = [],
    public images: GLImage[] = []
  ) {
    super();
  }
}
