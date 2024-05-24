import { Texture } from "../engine/texture";
import { Program } from "../webgl/program";

export type MaterialOptions = {
  texture?: Texture;
};

export abstract class ShaderMaterial {
  private static idCounter = 0;
  public id: string;
  public texture?: Texture;
  private _type: string;
  public get type() {
    return this._type;
  }

  constructor(options: MaterialOptions, type: string) {
    this.id = `material-${ShaderMaterial.idCounter++}`;
    this.texture = options.texture;
    this._type = type;
  }

  public getUniforms(gl: WebGLRenderingContext) {
    return {
      texture: [this.texture?.texture ?? Texture.WHITE(gl).texture],
    };
  }

  abstract get program(): Program<any, any>;
}
