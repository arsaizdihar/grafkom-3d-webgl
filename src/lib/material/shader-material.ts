import { Texture } from "../engine/texture";
import { Program } from "../webgl/program";

export type MaterialOptions = {
  texture: Texture;
};

export abstract class ShaderMaterial {
  private static idCounter = 0;
  public id: string;
  public texture: Texture;

  constructor(options: MaterialOptions) {
    this.id = `material-${ShaderMaterial.idCounter++}`;
    this.texture = options.texture;
  }

  public getUniforms(gl: WebGLRenderingContext) {
    return {
      texture: [this.texture.texture],
    };
  }

  abstract get program(): Program<any, any>;
}
