import { Texture } from "../engine/texture";
import { MATERIAL_TYPE } from "./material-type";

export type MaterialOptions = {
  id: string;
  textures: Texture[];
};

export class ShaderMaterial {
  public id: string;
  public textures: Texture[];

  public get materialType(): (typeof MATERIAL_TYPE)[keyof typeof MATERIAL_TYPE] {
    return MATERIAL_TYPE.BASIC;
  }

  constructor(options: MaterialOptions) {
    this.id = options.id;
    this.textures = options.textures;
  }
}
