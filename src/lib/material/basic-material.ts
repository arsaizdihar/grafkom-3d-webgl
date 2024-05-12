import { Color } from "../engine/color";
import { MATERIAL_TYPE } from "./material-type";
import { MaterialOptions, ShaderMaterial } from "./shader-material";

export interface BasicMaterialOptions extends MaterialOptions {
  color: Color;
}

export class BasicMaterial extends ShaderMaterial {
  public color: Color;

  constructor(options: BasicMaterialOptions) {
    super(options);
    this.color = options.color;
  }

  public get materialType() {
    return MATERIAL_TYPE.BASIC;
  }

  public get uniforms() {
    return {
      ...super.uniforms,
      color: this.color.value,
    };
  }
}
