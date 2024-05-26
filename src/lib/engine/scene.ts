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
  private _toControl: GLNode | null = null;
  private static multiplier = 50;

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

  set toControl(node: GLNode | null) {
    if (this._toControl && this._toControl !== node) {
      this._toControl.vy = 0;
    }
    this._toControl = node;
  }

  updateController(v: number, h: number, jump: boolean, dt: number) {
    if (!this._toControl) {
      return;
    }
    const node = this._toControl;
    if (jump && node.transform.position.y === 0) {
      node.vy = 5 * Scene.multiplier;
    }
    if (node.transform.position.y > 0) {
      node.vy -= 9.8 * Scene.multiplier * dt;
    }
    if (node.vy) {
      node.transform.position.y += node.vy * dt;
      if (node.transform.position.y < 0) {
        node.transform.position.y = 0;
        node.vy = 0;
      }
      node.dirty();
    }
    if (v === 0 && h === 0) {
      return;
    }
    const moveVector = new Vector3(h, 0, v)
      .normalize()
      .multScalar(10 * Scene.multiplier * dt);
    node.transform.position.add(moveVector);
    node.dirty();
  }
}
