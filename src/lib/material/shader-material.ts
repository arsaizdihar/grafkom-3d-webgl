import { Texture } from "../engine/texture";
import { MATERIAL_TYPE } from "./material-type";

export type MaterialOptions = {
  id: string;
  texture: Texture;
};

export class ShaderMaterial {
  public id: string;
  public texture: Texture;

  public get materialType(): (typeof MATERIAL_TYPE)[keyof typeof MATERIAL_TYPE] {
    return MATERIAL_TYPE.BASIC;
  }

  constructor(options: MaterialOptions) {
    this.id = options.id;
    this.texture = options.texture;
  }

  public getUniforms(gl: WebGLRenderingContext) {
    return {
      materialType: [this.materialType],
      texture: [this.texture.texture],
    };
  }
}
